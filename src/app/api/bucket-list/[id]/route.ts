import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// Helper to get database user ID from Clerk user
async function getDbUserId(supabase: any, email: string): Promise<string | null> {
  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  return dbUser?.id || null;
}

// PUT /api/bucket-list/[id] - Update bucket list item (mark as visited, update note)
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

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    const resolvedParams = await params;
    const body = await req.json();
    const { is_visited, note } = body;

    const supabase = await createClient();
    const dbUserId = await getDbUserId(supabase, email || '');

    if (!dbUserId) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: any = {};
    if (is_visited !== undefined) updateData.is_visited = is_visited;
    if (note !== undefined) updateData.note = note;

    // Update bucket list item (only if owned by user)
    const { data: updated, error } = await supabase
      .from('bucket_list')
      .update(updateData)
      .eq('id', resolvedParams.id)
      .eq('user_id', dbUserId)
      .select(`
        id,
        note,
        is_visited,
        created_at,
        restaurant:restaurants(id, name, categories, address, image_url),
        added_from_friend:users!bucket_list_added_from_friend_id_fkey(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating bucket list item:', error);
    return NextResponse.json(
      { error: 'Failed to update bucket list item' },
      { status: 500 }
    );
  }
}

// DELETE /api/bucket-list/[id] - Remove from bucket list
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

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    const resolvedParams = await params;

    const supabase = await createClient();
    const dbUserId = await getDbUserId(supabase, email || '');

    if (!dbUserId) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 400 }
      );
    }

    // Delete bucket list item (only if owned by user)
    const { error } = await supabase
      .from('bucket_list')
      .delete()
      .eq('id', resolvedParams.id)
      .eq('user_id', dbUserId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bucket list item:', error);
    return NextResponse.json(
      { error: 'Failed to delete bucket list item' },
      { status: 500 }
    );
  }
}
