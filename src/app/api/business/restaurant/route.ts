import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createClient } from '@/lib/supabase/server';

// GET /api/business/restaurant - Check if business user has a restaurant
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'business') {
      return NextResponse.json(
        { error: 'Only business users can access this endpoint' },
        { status: 403 }
      );
    }

    const supabase = await createClient();

    // Check if user has a restaurant
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .select('id, name, is_verified')
      .eq('owner_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw error;
    }

    return NextResponse.json({
      hasRestaurant: !!restaurant,
      restaurant: restaurant || null,
    });
  } catch (error) {
    console.error('Error checking restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to check restaurant status' },
      { status: 500 }
    );
  }
}
