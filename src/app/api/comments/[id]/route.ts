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

// PUT /api/comments/[id] - Update a comment
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const email = user?.emailAddresses[0]?.emailAddress;
    const resolvedParams = await params;
    const body = await req.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const dbUserId = await getDbUserId(supabase, email || '');

    if (!dbUserId) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 400 }
      );
    }

    // Check if user owns this comment
    const { data: comment } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', resolvedParams.id)
      .single();

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    if (comment.user_id !== dbUserId) {
      return NextResponse.json(
        { error: 'You can only edit your own comments' },
        { status: 403 }
      );
    }

    // Update comment
    const { data: updated, error } = await supabase
      .from('comments')
      .update({ content: content.trim() })
      .eq('id', resolvedParams.id)
      .select(`
        id,
        content,
        parent_id,
        likes_count,
        created_at,
        user:users(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id] - Delete a comment
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Check if user owns this comment or is admin
    const { data: comment } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', resolvedParams.id)
      .single();

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    if (comment.user_id !== dbUserId && (user?.publicMetadata as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'You can only delete your own comments' },
        { status: 403 }
      );
    }

    // Delete comment (will also delete replies due to CASCADE)
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', resolvedParams.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
