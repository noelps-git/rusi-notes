import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createClient } from '@/lib/supabase/server';

// GET /api/business/insights - Get business insights and analytics
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'business') {
      return NextResponse.json(
        { error: 'Unauthorized. Business account required.' },
        { status: 403 }
      );
    }

    const supabase = await createClient();

    // Get restaurant
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id, name')
      .eq('owner_id', session.user.id)
      .single();

    if (!restaurant) {
      return NextResponse.json(
        { error: 'No restaurant found' },
        { status: 404 }
      );
    }

    // Get all dishes with feedback
    const { data: dishes } = await supabase
      .from('dishes')
      .select(`
        id,
        name,
        category,
        price,
        is_available,
        dish_feedback(rating, feedback, tags, created_at)
      `)
      .eq('restaurant_id', restaurant.id);

    // Calculate insights
    const insights = {
      totalDishes: dishes?.length || 0,
      availableDishes: dishes?.filter((d: any) => d.is_available).length || 0,
      totalFeedback: 0,
      averageRating: 0,
      topRatedDishes: [] as any[],
      lowRatedDishes: [] as any[],
      categoryBreakdown: {} as Record<string, number>,
      recentFeedback: [] as any[],
      popularTags: {} as Record<string, number>,
    };

    if (dishes && dishes.length > 0) {
      // Calculate dish ratings
      const dishesWithRatings = dishes.map((dish: any) => {
        const feedbacks = dish.dish_feedback || [];
        const totalRating = feedbacks.reduce(
          (sum: number, f: any) => sum + f.rating,
          0
        );
        const avgRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;

        return {
          id: dish.id,
          name: dish.name,
          category: dish.category,
          feedbackCount: feedbacks.length,
          averageRating: avgRating,
          feedbacks: feedbacks,
        };
      });

      // Total feedback count
      insights.totalFeedback = dishesWithRatings.reduce(
        (sum, d) => sum + d.feedbackCount,
        0
      );

      // Overall average rating
      const totalRatings = dishesWithRatings
        .filter((d) => d.feedbackCount > 0)
        .reduce((sum, d) => sum + d.averageRating, 0);
      insights.averageRating =
        dishesWithRatings.filter((d) => d.feedbackCount > 0).length > 0
          ? totalRatings / dishesWithRatings.filter((d) => d.feedbackCount > 0).length
          : 0;

      // Top rated dishes (min 2 feedback, sorted by rating)
      insights.topRatedDishes = dishesWithRatings
        .filter((d) => d.feedbackCount >= 2)
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 5)
        .map((d) => ({
          name: d.name,
          rating: d.averageRating,
          feedbackCount: d.feedbackCount,
        }));

      // Low rated dishes (min 2 feedback, bottom 5)
      insights.lowRatedDishes = dishesWithRatings
        .filter((d) => d.feedbackCount >= 2 && d.averageRating < 3.5)
        .sort((a, b) => a.averageRating - b.averageRating)
        .slice(0, 5)
        .map((d) => ({
          name: d.name,
          rating: d.averageRating,
          feedbackCount: d.feedbackCount,
        }));

      // Category breakdown
      dishes.forEach((dish: any) => {
        const category = dish.category || 'Uncategorized';
        insights.categoryBreakdown[category] =
          (insights.categoryBreakdown[category] || 0) + 1;
      });

      // Recent feedback (last 10)
      const allFeedback: any[] = [];
      dishesWithRatings.forEach((dish) => {
        dish.feedbacks.forEach((f: any) => {
          allFeedback.push({
            dishName: dish.name,
            rating: f.rating,
            feedback: f.feedback,
            tags: f.tags,
            created_at: f.created_at,
          });
        });
      });
      insights.recentFeedback = allFeedback
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 10);

      // Popular tags
      allFeedback.forEach((f) => {
        if (f.tags && Array.isArray(f.tags)) {
          f.tags.forEach((tag: string) => {
            insights.popularTags[tag] = (insights.popularTags[tag] || 0) + 1;
          });
        }
      });
    }

    return NextResponse.json({
      restaurant,
      insights,
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}
