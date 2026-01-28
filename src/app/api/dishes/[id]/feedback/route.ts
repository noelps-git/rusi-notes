import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/dishes/[id]/feedback - Get all feedback for a dish
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const supabase = await createClient();

    const { data: feedback, error } = await supabase
      .from('dish_feedback')
      .select(`
        id,
        rating,
        feedback,
        tags,
        created_at,
        user:users(id, full_name, avatar_url)
      `)
      .eq('dish_id', resolvedParams.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

// POST /api/dishes/[id]/feedback - Submit feedback for a dish
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const body = await req.json();
    const { rating, feedback, tags } = body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if dish exists
    const { data: dish } = await supabase
      .from('dishes')
      .select('id')
      .eq('id', resolvedParams.id)
      .single();

    if (!dish) {
      return NextResponse.json(
        { error: 'Dish not found' },
        { status: 404 }
      );
    }

    // Upsert feedback (update if exists, insert if new)
    const { data: dishFeedback, error } = await supabase
      .from('dish_feedback')
      .upsert(
        {
          dish_id: resolvedParams.id,
          user_id: session.user.id,
          rating,
          feedback: feedback || null,
          tags: tags || [],
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'dish_id,user_id',
        }
      )
      .select(`
        id,
        rating,
        feedback,
        tags,
        created_at,
        user:users(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(dishFeedback, { status: 201 });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
