import { createClient } from '@/lib/supabase/server';
import { generateEmbedding, formatEmbeddingForPostgres } from '@/lib/ai/embeddings';

interface RestaurantProfileData {
  name: string;
  description: string | null;
  categories: string[];
  price_range: string | null;
  average_rating: number;
  city: string;
  topTags: string[];
  popularDishes: string[];
}

function extractTopTags(reviews: { tags: string[] | null }[] | null): string[] {
  if (!reviews) return [];

  const tagCounts = new Map<string, number>();

  for (const review of reviews) {
    if (review.tags) {
      for (const tag of review.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }
  }

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);
}

function buildRestaurantEmbeddingText(data: RestaurantProfileData): string {
  const parts = [
    `Restaurant: ${data.name}`,
    data.description ? `Description: ${data.description}` : '',
    data.categories.length > 0 ? `Cuisine: ${data.categories.join(', ')}` : '',
    data.price_range ? `Price: ${data.price_range}` : '',
    `Rating: ${data.average_rating.toFixed(1)}/5`,
    `Location: ${data.city}`,
    data.topTags.length > 0 ? `Known for: ${data.topTags.join(', ')}` : '',
    data.popularDishes.length > 0
      ? `Popular dishes: ${data.popularDishes.join(', ')}`
      : '',
  ];

  return parts.filter(Boolean).join('. ');
}

export async function generateRestaurantEmbedding(
  restaurantId: string
): Promise<void> {
  const supabase = await createClient();

  const { data: restaurant, error: restaurantError } = await supabase
    .from('restaurants')
    .select('id, name, description, categories, price_range, average_rating, city')
    .eq('id', restaurantId)
    .single();

  if (restaurantError || !restaurant) {
    console.error('Restaurant not found:', restaurantId);
    return;
  }

  const { data: reviews } = await supabase
    .from('tasting_notes')
    .select('tags')
    .eq('restaurant_id', restaurantId)
    .eq('is_public', true);

  const { data: dishes } = await supabase
    .from('dishes')
    .select('name')
    .eq('restaurant_id', restaurantId)
    .eq('is_available', true)
    .limit(10);

  const profileData: RestaurantProfileData = {
    name: restaurant.name,
    description: restaurant.description,
    categories: restaurant.categories || [],
    price_range: restaurant.price_range,
    average_rating: restaurant.average_rating || 0,
    city: restaurant.city || 'Chennai',
    topTags: extractTopTags(reviews),
    popularDishes: dishes?.map((d) => d.name) || [],
  };

  const embeddingText = buildRestaurantEmbeddingText(profileData);
  const embedding = await generateEmbedding(embeddingText);
  const embeddingStr = formatEmbeddingForPostgres(embedding);

  const { error: upsertError } = await supabase
    .from('restaurant_embeddings')
    .upsert(
      {
        restaurant_id: restaurantId,
        embedding: embeddingStr,
        embedding_text: embeddingText,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'restaurant_id' }
    );

  if (upsertError) {
    console.error('Error upserting restaurant embedding:', upsertError);
  }
}

export async function generateAllRestaurantEmbeddings(): Promise<{
  success: number;
  failed: number;
}> {
  const supabase = await createClient();

  const { data: restaurants, error } = await supabase
    .from('restaurants')
    .select('id')
    .eq('is_verified', true);

  if (error || !restaurants) {
    console.error('Error fetching restaurants:', error);
    return { success: 0, failed: 0 };
  }

  let success = 0;
  let failed = 0;

  for (const restaurant of restaurants) {
    try {
      await generateRestaurantEmbedding(restaurant.id);
      success++;
    } catch (err) {
      console.error(`Failed to generate embedding for ${restaurant.id}:`, err);
      failed++;
    }
  }

  return { success, failed };
}
