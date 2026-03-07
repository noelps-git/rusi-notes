import { createClient } from '@/lib/supabase/server';
import type {
  ScoredRecommendation,
  RecommendationOptions,
  RestaurantMatch,
  FriendReview,
} from './types';
import { getColdStartRecommendations } from './cold-start';

async function applyBoosts(
  restaurants: RestaurantMatch[],
  userId: string,
  friendReviewMap: Map<string, FriendReview>,
  bucketListIds: Set<string>
): Promise<ScoredRecommendation[]> {
  return restaurants.map((r) => {
    let boost = 0;
    const reasons: string[] = [];

    const friendReview = friendReviewMap.get(r.restaurant_id);
    if (friendReview && friendReview.avg_rating >= 4) {
      boost += 0.15;
      reasons.push(
        `Loved by ${friendReview.friend_count} friend${friendReview.friend_count > 1 ? 's' : ''}`
      );
    }

    if (r.average_rating >= 4.5) {
      boost += 0.1;
      reasons.push('Highly rated');
    }

    if (bucketListIds.has(r.restaurant_id)) {
      boost += 0.2;
      reasons.push('On your bucket list');
    }

    if (r.similarity > 0.8) {
      reasons.push('Matches your taste perfectly');
    } else if (r.similarity > 0.6) {
      reasons.push('Similar to places you love');
    } else if (reasons.length === 0) {
      reasons.push('You might enjoy this');
    }

    return {
      restaurant_id: r.restaurant_id,
      similarity_score: r.similarity,
      boost_score: boost,
      final_score: r.similarity + boost,
      reasons,
    };
  });
}

export async function getRecommendations(
  userId: string,
  options: RecommendationOptions = {}
): Promise<ScoredRecommendation[]> {
  const { limit = 10, excludeVisited = true } = options;
  const supabase = await createClient();

  const { data: userProfile } = await supabase
    .from('user_taste_profiles')
    .select('embedding')
    .eq('user_id', userId)
    .single();

  if (!userProfile?.embedding) {
    return getColdStartRecommendations(userId, options);
  }

  const { data: similarRestaurants, error: matchError } = await supabase.rpc(
    'match_restaurants_by_taste',
    {
      query_embedding: userProfile.embedding,
      match_threshold: 0.3,
      match_count: limit * 3,
      p_user_id: userId,
      exclude_visited: excludeVisited,
    }
  );

  if (matchError) {
    console.error('Error matching restaurants:', matchError);
    return getColdStartRecommendations(userId, options);
  }

  if (!similarRestaurants || similarRestaurants.length === 0) {
    return getColdStartRecommendations(userId, options);
  }

  const { data: friendReviews } = await supabase.rpc(
    'get_friend_restaurant_reviews',
    { current_user_id: userId }
  );

  const friendReviewMap = new Map<string, FriendReview>(
    friendReviews?.map((r: FriendReview) => [r.restaurant_id, r]) || []
  );

  const { data: bucketList } = await supabase
    .from('bucket_list')
    .select('restaurant_id')
    .eq('user_id', userId)
    .eq('is_visited', false);

  const bucketListIds = new Set(bucketList?.map((b) => b.restaurant_id) || []);

  const scoredResults = await applyBoosts(
    similarRestaurants as RestaurantMatch[],
    userId,
    friendReviewMap,
    bucketListIds
  );

  return scoredResults
    .sort((a, b) => b.final_score - a.final_score)
    .slice(0, limit);
}
