import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const openaiKey = process.env.OPENAI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000),
    dimensions: 1536,
  });
  return response.data[0].embedding;
}

function buildRestaurantText(r: any, tags: string[], dishes: string[]): string {
  const parts = [
    `Restaurant: ${r.name}`,
    r.description ? `Description: ${r.description}` : '',
    r.categories?.length ? `Cuisine: ${r.categories.join(', ')}` : '',
    r.price_range ? `Price: ${r.price_range}` : '',
    `Rating: ${(r.average_rating || 0).toFixed(1)}/5`,
    `Location: ${r.city || 'Chennai'}`,
    tags.length ? `Known for: ${tags.join(', ')}` : '',
    dishes.length ? `Popular dishes: ${dishes.join(', ')}` : '',
  ];
  return parts.filter(Boolean).join('. ');
}

async function main() {
  console.log('Fetching restaurants...');

  const { data: restaurants, error } = await supabase
    .from('restaurants')
    .select('id, name, description, categories, price_range, average_rating, city')
    .eq('is_verified', true);

  if (error || !restaurants) {
    console.error('Error fetching restaurants:', error);
    return;
  }

  console.log(`Found ${restaurants.length} restaurants`);

  let success = 0;
  let failed = 0;

  for (const r of restaurants) {
    try {
      // Get tags from reviews
      const { data: reviews } = await supabase
        .from('tasting_notes')
        .select('tags')
        .eq('restaurant_id', r.id)
        .eq('is_public', true);

      const tagCounts = new Map<string, number>();
      reviews?.forEach((rev: any) => {
        rev.tags?.forEach((t: string) => tagCounts.set(t, (tagCounts.get(t) || 0) + 1));
      });
      const topTags = [...tagCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([t]) => t);

      // Get dishes
      const { data: dishes } = await supabase
        .from('dishes')
        .select('name')
        .eq('restaurant_id', r.id)
        .eq('is_available', true)
        .limit(10);

      const dishNames = dishes?.map((d: any) => d.name) || [];

      // Build text and generate embedding
      const text = buildRestaurantText(r, topTags, dishNames);
      const embedding = await generateEmbedding(text);

      // Upsert
      const { error: upsertError } = await supabase
        .from('restaurant_embeddings')
        .upsert({
          restaurant_id: r.id,
          embedding: `[${embedding.join(',')}]`,
          embedding_text: text,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'restaurant_id' });

      if (upsertError) throw upsertError;

      success++;
      console.log(`✓ ${r.name}`);
    } catch (err) {
      failed++;
      console.error(`✗ ${r.name}:`, err);
    }
  }

  console.log(`\nDone! Generated: ${success}, Failed: ${failed}`);
}

main();
