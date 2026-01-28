import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/business/restaurant - Check if business user has a restaurant
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if ((user?.publicMetadata as any)?.role !== 'business') {
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
      .eq('owner_id', userId)
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
