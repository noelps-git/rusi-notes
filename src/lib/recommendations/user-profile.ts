import { createClient } from '@/lib/supabase/server';
import { generateEmbedding, formatEmbeddingForPostgres } from '@/lib/ai/embeddings';

interface UserTasteData {
  favoriteCategories: { category: string; count: number }[];
  averageRating: number;
  preferredPriceRange: string | null;
  dietaryPreferences: string[];
  topTags: string[];
  recentFavorites: string[];
  allergies: string[];
}

function describeRatingStyle(avgRating: number): string {
  if (avgRating >= 4.5) return 'highly selective, only rates places they love';
  if (avgRating >= 4.0) return 'positive reviewer, appreciates good experiences';
  if (avgRating >= 3.5) return 'balanced reviewer';
  if (avgRating >= 3.0) return 'critical reviewer';
  return 'very discerning';
}

function aggregateUserTaste(
  reviews: any[] | null,
  dishFeedback: any[] | null,
  user: any | null
): UserTasteData {
  const categoryCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();
  const priceCounts = new Map<string, number>();
  let totalRating = 0;
  let ratingCount = 0;
  const recentFavorites: string[] = [];

  if (reviews) {
    for (const review of reviews) {
      if (review.rating) {
        totalRating += review.rating;
        ratingCount++;

        if (review.rating >= 4 && review.restaurant?.name) {
          if (recentFavorites.length < 5) {
            recentFavorites.push(review.restaurant.name);
          }
        }
      }

      if (review.tags) {
        for (const tag of review.tags) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      }

      if (review.restaurant?.categories) {
        for (const cat of review.restaurant.categories) {
          categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
        }
      }

      if (review.restaurant?.price_range) {
        priceCounts.set(
          review.restaurant.price_range,
          (priceCounts.get(review.restaurant.price_range) || 0) + 1
        );
      }
    }
  }

  if (dishFeedback) {
    for (const feedback of dishFeedback) {
      if (feedback.tags) {
        for (const tag of feedback.tags) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      }
    }
  }

  const favoriteCategories = Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));

  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  const preferredPriceRange =
    priceCounts.size > 0
      ? Array.from(priceCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]
      : null;

  return {
    favoriteCategories,
    averageRating: ratingCount > 0 ? totalRating / ratingCount : 4.0,
    preferredPriceRange,
    dietaryPreferences: user?.dietary_preferences || [],
    topTags,
    recentFavorites,
    allergies: user?.allergies || [],
  };
}

function buildUserTasteEmbeddingText(data: UserTasteData): string {
  const parts = [
    data.favoriteCategories.length > 0
      ? `Preferred cuisines: ${data.favoriteCategories.map((c) => c.category).join(', ')}`
      : '',
    `Typical rating style: ${describeRatingStyle(data.averageRating)}`,
    data.preferredPriceRange
      ? `Price preference: ${data.preferredPriceRange}`
      : '',
    data.dietaryPreferences.length > 0
      ? `Diet: ${data.dietaryPreferences.join(', ')}`
      : '',
    data.topTags.length > 0 ? `Enjoys: ${data.topTags.join(', ')}` : '',
    data.recentFavorites.length > 0
      ? `Recently loved: ${data.recentFavorites.join(', ')}`
      : '',
    data.allergies.length > 0 ? `Avoids: ${data.allergies.join(', ')}` : '',
  ];

  return parts.filter(Boolean).join('. ');
}

export async function generateUserTasteProfile(userId: string): Promise<void> {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from('tasting_notes')
    .select(
      `
      rating,
      tags,
      restaurant:restaurants(name, categories, price_range)
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  const { data: dishFeedback } = await supabase
    .from('dish_feedback')
    .select('rating, tags')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);

  const { data: user } = await supabase
    .from('users')
    .select('dietary_preferences, allergies')
    .eq('id', userId)
    .single();

  const tasteData = aggregateUserTaste(reviews, dishFeedback, user);
  const embeddingText = buildUserTasteEmbeddingText(tasteData);

  if (!embeddingText || embeddingText.length < 10) {
    console.log('Not enough data to generate user taste profile for:', userId);
    return;
  }

  const embedding = await generateEmbedding(embeddingText);
  const embeddingStr = formatEmbeddingForPostgres(embedding);

  const { error: upsertError } = await supabase
    .from('user_taste_profiles')
    .upsert(
      {
        user_id: userId,
        embedding: embeddingStr,
        embedding_text: embeddingText,
        review_count: reviews?.length || 0,
        last_activity_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  if (upsertError) {
    console.error('Error upserting user taste profile:', upsertError);
  }
}
