import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/groups/[id]/members - Add member to group
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if requester is admin
    const { data: membership } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', resolvedParams.id)
      .eq('user_id', userId)
      .single();

    if (!membership || membership.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can add members' },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', resolvedParams.id)
      .eq('user_id', user_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'User is already a member' },
        { status: 400 }
      );
    }

    // Add member
    const { data: newMember, error } = await supabase
      .from('group_members')
      .insert({
        group_id: resolvedParams.id,
        user_id,
        role: 'member',
      })
      .select(`
        role,
        joined_at,
        user:users(id, full_name, avatar_url, email)
      `)
      .single();

    if (error) throw error;

    // TODO: Create notification for added user

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[id]/members/[userId] - Remove member
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const searchParams = req.nextUrl.searchParams;
    const targetUserId = searchParams.get('userId');

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if requester is admin or removing themselves
    const { data: membership } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', resolvedParams.id)
      .eq('user_id', userId)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this group' },
        { status: 403 }
      );
    }

    // Allow self-removal or admin removing others
    if (targetUserId !== userId && membership.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can remove other members' },
        { status: 403 }
      );
    }

    // Remove member
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', resolvedParams.id)
      .eq('user_id', targetUserId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json(
      { error: 'Failed to remove member' },
      { status: 500 }
    );
  }
}
