import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/groups - Get all groups user is a member of
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Get all groups where user is a member
    const { data: memberships, error } = await supabase
      .from('group_members')
      .select(`
        group_id,
        role,
        joined_at,
        group:groups(
          id,
          name,
          description,
          avatar_url,
          is_private,
          created_at,
          creator:users!groups_creator_id_fkey(id, full_name, avatar_url)
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    // Transform to return group objects with member role
    const groups = memberships?.map((m: any) => ({
      ...m.group,
      member_role: m.role,
      joined_at: m.joined_at,
    })) || [];

    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}

// POST /api/groups - Create a new group
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, description, is_private } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        creator_id: userId,
        is_private: is_private !== undefined ? is_private : true,
      })
      .select()
      .single();

    if (groupError) throw groupError;

    // Add creator as admin member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: userId,
        role: 'admin',
      });

    if (memberError) throw memberError;

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { error: 'Failed to create group' },
      { status: 500 }
    );
  }
}
