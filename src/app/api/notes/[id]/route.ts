import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/notes/[id] - Get single note
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const supabase = await createClient();

    const { data: note, error } = await supabase
      .from('tasting_notes')
      .select(`
        *,
        user:users(id, full_name, avatar_url),
        restaurant:restaurants(id, name, categories),
        dish:dishes(id, name)
      `)
      .eq('id', resolvedParams.id)
      .single();

    if (error) throw error;

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

// Helper to get database user ID from Clerk user
async function getDbUserId(supabase: any, email: string): Promise<string | null> {
  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  return dbUser?.id || null;
}

// PUT /api/notes/[id] - Update note
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    const supabase = await createClient();
    const dbUserId = await getDbUserId(supabase, email || '');

    // Check if user owns this note
    const { data: note } = await supabase
      .from('tasting_notes')
      .select('user_id')
      .eq('id', resolvedParams.id)
      .single();

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    if (note.user_id !== dbUserId && (user?.publicMetadata as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. You can only edit your own notes.' },
        { status: 403 }
      );
    }

    const body = await req.json();

    const { data: updated, error } = await supabase
      .from('tasting_notes')
      .update(body)
      .eq('id', resolvedParams.id)
      .select(`
        *,
        user:users(id, full_name, avatar_url),
        restaurant:restaurants(id, name, categories)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - Delete note
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    const supabase = await createClient();
    const isAdmin = (user?.publicMetadata as any)?.role === 'admin';

    // Get the note
    const { data: note } = await supabase
      .from('tasting_notes')
      .select('user_id')
      .eq('id', resolvedParams.id)
      .single();

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Check ownership by looking up user by email
    const email = user?.emailAddresses[0]?.emailAddress;
    let isOwner = false;

    if (email) {
      const { data: dbUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      isOwner = dbUser?.id === note.user_id;
    }

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'You can only delete your own notes' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('tasting_notes')
      .delete()
      .eq('id', resolvedParams.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
