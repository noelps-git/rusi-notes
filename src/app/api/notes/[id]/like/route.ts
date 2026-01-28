import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/notes/[id]/like - Toggle like
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const supabase = await createClient();

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('note_id', resolvedParams.id)
      .single();

    if (existingLike) {
      // Unlike
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('note_id', resolvedParams.id);

      // Decrement likes count
      await supabase.rpc('decrement_likes', { note_id: resolvedParams.id });

      return NextResponse.json({ liked: false });
    } else {
      // Like
      await supabase
        .from('likes')
        .insert({
          user_id: userId,
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
