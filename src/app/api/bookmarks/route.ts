import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// Helper to get database user ID from Clerk user
async function getDbUserId(supabase: any, email: string) {
  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  return dbUser?.id;
}

// GET /api/bookmarks - Get all bookmarked notes
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    const supabase = await createClient();
    const dbUserId = await getDbUserId(supabase, email || '');

    if (!dbUserId) {
      return NextResponse.json([]);
    }

    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select(`
        id,
        created_at,
        note:tasting_notes(
          id,
          title,
          content,
          rating,
          images,
          tags,
          created_at,
          likes_count,
          user:users(id, full_name, avatar_url),
          restaurant:restaurants(id, name, categories)
        )
      `)
      .eq('user_id', dbUserId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

// POST /api/bookmarks - Add bookmark
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { note_id } = body;

    if (!note_id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const dbUserId = await getDbUserId(supabase, email || '');

    if (!dbUserId) {
      return NextResponse.json(
        { error: 'Please complete your profile setup first' },
        { status: 400 }
      );
    }

    // Check if already bookmarked
    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', dbUserId)
      .eq('note_id', note_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Note already bookmarked' },
        { status: 400 }
      );
    }

    // Create bookmark
    const { data: bookmark, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: dbUserId,
        note_id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmarks/[id] handled in separate file
