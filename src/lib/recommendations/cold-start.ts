import { createClient } from '@/lib/supabase/server';
import type { ScoredRecommendation, RecommendationOptions } from './types';

export async function getColdStartRecommendations(
  userId: string,
  options: RecommendationOptions = {}
): Promise<ScoredRecommendation[]> {
  const { limit = 10 } = options;
  const supabase = await createClient();

  const { data: user } = await supabase
    .from('users')
    .select('dietary_preferences')
    .eq('id', userId)
    .single();

  const { data: bucketList } = await supabase
    .from('bucket_list')
    .select('restaurant_id')
    .eq('user_id', userId)
    .eq('is_visited', false)
    .limit(5);

  const bucketListIds = new Set(bucketList?.map((b) => b.restaurant_id) || []);

  let query = supabase
    .from('restaurants')
    .select('id, name, categories, average_rating, total_reviews, price_range')
    .eq('is_verified', true)
    .order('average_rating', { ascending: false })
    .order('total_reviews', { ascending: false });

  const { data: restaurants } = await query.limit(limit * 3);

  if (!restaurants || restaurants.length === 0) {
    return [];
  }

  const scored: ScoredRecommendation[] = restaurants.map((r) => {
    let score = 0.5;
    const reasons: string[] = [];

    score += ((r.average_rating || 0) / 5) * 0.2;

    if (r.total_reviews && r.total_reviews > 10) {
      score += 0.05;
    }

    if (bucketListIds.has(r.id)) {
      score += 0.3;
      reasons.push('On your bucket list');
    }

    if (r.average_rating && r.average_rating >= 4.5) {
      reasons.push('Highly rated');
    }

    if (r.total_reviews && r.total_reviews > 20 && r.average_rating && r.average_rating >= 4.0) {
      reasons.push('Local favorite');
    }

    if (reasons.length === 0) {
      reasons.push('Popular in your area');
    }

    return {
      restaurant_id: r.id,
      similarity_score: 0,
      boost_score: score,
      final_score: score,
      reasons,
    };
  });

  return scored.sort((a, b) => b.final_score - a.final_score).slice(0, limit);
}
