import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createClient } from '@/lib/supabase/server';

// GET /api/notes - List all tasting notes
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const restaurantId = searchParams.get('restaurantId');
    const limit = parseInt(searchParams.get('limit') || '20');

    const supabase = await createClient();
    let query = supabase
      .from('tasting_notes')
      .select(`
        *,
        user:users(id, full_name, avatar_url),
        restaurant:restaurants(id, name, categories)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId);
    }

    const { data: notes, error } = await query;

    if (error) throw error;

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasting notes' },
      { status: 500 }
    );
  }
}

// POST /api/notes - Create new tasting note
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      restaurant_id,
      dish_id,
      title,
      content,
      rating,
      images,
      tags,
      is_public,
    } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create tasting note
    const { data: note, error } = await supabase
      .from('tasting_notes')
      .insert({
        user_id: session.user.id,
        restaurant_id,
        dish_id,
        title,
        content,
        rating,
        images: images || [],
        tags: tags || [],
        is_public: is_public !== undefined ? is_public : true,
      })
      .select(`
        *,
        user:users(id, full_name, avatar_url),
        restaurant:restaurants(id, name, categories)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create tasting note' },
      { status: 500 }
    );
  }
}
