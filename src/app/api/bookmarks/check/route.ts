import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/bookmarks/check?note_id=xxx - Check if note is bookmarked
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ bookmarked: false });
    }

    const searchParams = req.nextUrl.searchParams;
    const noteId = searchParams.get('note_id');

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: bookmark } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('note_id', noteId)
      .single();

    return NextResponse.json({
      bookmarked: !!bookmark,
      bookmark_id: bookmark?.id || null,
    });
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return NextResponse.json({ bookmarked: false });
  }
}
