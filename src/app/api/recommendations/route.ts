import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { getRecommendations } from '@/lib/recommendations';

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    const user = await currentUser();

    if (!clerkId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const supabase = await createClient();

    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const excludeVisited = searchParams.get('excludeVisited') !== 'false';

    const recommendations = await getRecommendations(dbUser.id, {
      limit,
      excludeVisited,
      categoryFilter: category ? [category] : undefined,
    });

    const restaurantIds = recommendations.map((r) => r.restaurant_id);

    const { data: restaurants } = await supabase
      .from('restaurants')
      .select(
        'id, name, description, categories, price_range, average_rating, total_reviews, logo_url, city'
      )
      .in('id', restaurantIds);

    const enrichedRecommendations = recommendations.map((rec) => ({
      ...rec,
      restaurant: restaurants?.find((r) => r.id === rec.restaurant_id) || null,
    }));

    return NextResponse.json({
      recommendations: enrichedRecommendations,
      meta: {
        count: enrichedRecommendations.length,
        hasMore: recommendations.length >= limit,
      },
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
