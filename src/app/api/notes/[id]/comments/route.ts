import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { createNotification } from '@/lib/utils/notifications';

// GET /api/notes/[id]/comments - Get all comments for a note
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const supabase = await createClient();

    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        parent_id,
        likes_count,
        created_at,
        user:users(id, full_name, avatar_url)
      `)
      .eq('note_id', resolvedParams.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/notes/[id]/comments - Add a comment to a note
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    const resolvedParams = await params;
    const body = await req.json();
    const { content, parent_id } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Look up the database user by email
    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!dbUser) {
      return NextResponse.json(
        { error: 'Please complete your profile setup first' },
        { status: 400 }
      );
    }

    // Check if note exists and get author
    const { data: note } = await supabase
      .from('tasting_notes')
      .select('id, user_id, title')
      .eq('id', resolvedParams.id)
      .single();

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Create comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        note_id: resolvedParams.id,
        user_id: dbUser.id,
        content: content.trim(),
        parent_id: parent_id || null,
      })
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

    // Create notification for note author (if not commenting on own note)
    if (note.user_id !== dbUser.id) {
      await createNotification({
        user_id: note.user_id,
        type: 'comment',
        title: 'New Comment',
        message: `${user?.fullName || 'Someone'} commented on your note "${note.title || 'Untitled'}"`,
        link: `/notes/${note.id}`,
        metadata: {
          commenter_id: dbUser.id,
          commenter_name: user?.fullName,
          comment_id: comment.id,
          note_id: note.id,
        },
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
