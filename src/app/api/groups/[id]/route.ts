import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/groups/[id] - Get single group with members
export async function GET(
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
    const supabase = await createClient();

    // Check if user is a member
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

    // Get group details
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select(`
        id,
        name,
        description,
        avatar_url,
        is_private,
        created_at,
        creator:users!groups_creator_id_fkey(id, full_name, avatar_url)
      `)
      .eq('id', resolvedParams.id)
      .single();

    if (groupError) throw groupError;

    // Get all members
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select(`
        role,
        joined_at,
        user:users(id, full_name, avatar_url, email)
      `)
      .eq('group_id', resolvedParams.id);

    if (membersError) throw membersError;

    return NextResponse.json({
      ...group,
      members,
      user_role: membership.role,
    });
  } catch (error) {
    console.error('Error fetching group:', error);
    return NextResponse.json(
      { error: 'Failed to fetch group' },
      { status: 500 }
    );
  }
}

// PUT /api/groups/[id] - Update group (admin only)
export async function PUT(
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
    const supabase = await createClient();

    // Check if user is admin
    const { data: membership } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', resolvedParams.id)
      .eq('user_id', userId)
      .single();

    if (!membership || membership.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can update the group' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, is_private } = body;

    // Update group
    const { data: updated, error } = await supabase
      .from('groups')
      .update({
        name: name?.trim(),
        description: description?.trim(),
        is_private,
      })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating group:', error);
    return NextResponse.json(
      { error: 'Failed to update group' },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[id] - Delete group (admin only)
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
    const supabase = await createClient();

    // Check if user is admin
    const { data: membership } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', resolvedParams.id)
      .eq('user_id', userId)
      .single();

    if (!membership || membership.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can delete the group' },
        { status: 403 }
      );
    }

    // Delete group (members and messages will cascade)
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', resolvedParams.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json(
      { error: 'Failed to delete group' },
      { status: 500 }
    );
  }
}
