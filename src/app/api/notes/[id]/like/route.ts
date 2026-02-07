import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/notes/[id]/like - Toggle like
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

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', dbUser.id)
      .eq('note_id', resolvedParams.id)
      .single();

    if (existingLike) {
      // Unlike
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', dbUser.id)
        .eq('note_id', resolvedParams.id);

      // Decrement likes count
      await supabase.rpc('decrement_likes', { note_id: resolvedParams.id });

      return NextResponse.json({ liked: false });
    } else {
      // Like
      await supabase
        .from('likes')
        .insert({
          user_id: dbUser.id,
          note_id: resolvedParams.id,
        });

      // Increment likes count
      await supabase.rpc('increment_likes', { note_id: resolvedParams.id });

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
