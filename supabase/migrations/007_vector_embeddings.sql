-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Restaurant embeddings table
-- Stores vector representation of restaurant profile for similarity search
CREATE TABLE restaurant_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  embedding vector(1536),  -- OpenAI text-embedding-3-small dimension
  embedding_text TEXT,     -- The text that was embedded (for debugging)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(restaurant_id)
);

-- User taste profile embeddings
-- Aggregated from all user's reviews/feedback
CREATE TABLE user_taste_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  embedding vector(1536),
  embedding_text TEXT,     -- Aggregated taste description
  review_count INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Recommendation cache (for performance)
CREATE TABLE recommendation_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recommendations JSONB NOT NULL,  -- Array of {restaurant_id, score, reasons}
  generated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '1 hour'),
  UNIQUE(user_id)
);

-- Indexes for vector similarity search (IVFFlat for approximate nearest neighbor)
-- lists = sqrt(num_vectors) approximately, 100 is good for up to 10k restaurants
CREATE INDEX idx_restaurant_embeddings_vector
  ON restaurant_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX idx_user_taste_profiles_vector
  ON user_taste_profiles
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX idx_recommendation_cache_user_expires
  ON recommendation_cache(user_id, expires_at);

-- Function to find restaurants similar to user taste profile
CREATE OR REPLACE FUNCTION match_restaurants_by_taste(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_user_id uuid,
  exclude_visited boolean
)
RETURNS TABLE (
  restaurant_id uuid,
  name text,
  description text,
  similarity float,
  categories text[],
  price_range text,
  average_rating float,
  total_reviews int,
  logo_url text,
  city text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id as restaurant_id,
    r.name,
    r.description,
    1 - (re.embedding <=> query_embedding) as similarity,
    r.categories::text[],
    r.price_range,
    r.average_rating::float,
    r.total_reviews::int,
    r.logo_url,
    r.city
  FROM restaurant_embeddings re
  JOIN restaurants r ON r.id = re.restaurant_id
  WHERE
    r.is_verified = true
    AND re.embedding IS NOT NULL
    AND 1 - (re.embedding <=> query_embedding) > match_threshold
    AND (
      NOT exclude_visited
      OR r.id NOT IN (
        SELECT DISTINCT tn.restaurant_id
        FROM tasting_notes tn
        WHERE tn.user_id = p_user_id
          AND tn.restaurant_id IS NOT NULL
      )
    )
  ORDER BY re.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function to get friend reviews for restaurants (for social proof boost)
CREATE OR REPLACE FUNCTION get_friend_restaurant_reviews(
  current_user_id uuid
)
RETURNS TABLE (
  restaurant_id uuid,
  friend_count int,
  avg_rating float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tn.restaurant_id,
    COUNT(DISTINCT tn.user_id)::int as friend_count,
    AVG(tn.rating)::float as avg_rating
  FROM tasting_notes tn
  WHERE tn.user_id IN (
    -- Friends who accepted the current user's request
    SELECT f.recipient_id
    FROM friendships f
    WHERE f.requester_id = current_user_id
      AND f.status = 'accepted'
    UNION
    -- Friends who the current user accepted
    SELECT f.requester_id
    FROM friendships f
    WHERE f.recipient_id = current_user_id
      AND f.status = 'accepted'
  )
  AND tn.restaurant_id IS NOT NULL
  AND tn.rating IS NOT NULL
  GROUP BY tn.restaurant_id;
END;
$$;

-- Trigger for updated_at on restaurant_embeddings
CREATE OR REPLACE FUNCTION update_restaurant_embeddings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_restaurant_embeddings_updated_at
  BEFORE UPDATE ON restaurant_embeddings
  FOR EACH ROW EXECUTE FUNCTION update_restaurant_embeddings_timestamp();

-- Trigger for updated_at on user_taste_profiles
CREATE TRIGGER update_user_taste_profiles_updated_at
  BEFORE UPDATE ON user_taste_profiles
  FOR EACH ROW EXECUTE FUNCTION update_restaurant_embeddings_timestamp();

-- Enable RLS
ALTER TABLE restaurant_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_taste_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Restaurant embeddings: readable by all, writable by system only
CREATE POLICY "Restaurant embeddings are viewable by everyone"
  ON restaurant_embeddings FOR SELECT
  USING (true);

-- User taste profiles: users can only view their own
CREATE POLICY "Users can view their own taste profile"
  ON user_taste_profiles FOR SELECT
  USING (auth.uid()::text = user_id::text OR true);

CREATE POLICY "Users can manage their own taste profile"
  ON user_taste_profiles FOR ALL
  USING (true);

-- Recommendation cache: users can only view their own
CREATE POLICY "Users can view their own recommendations"
  ON recommendation_cache FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own recommendations"
  ON recommendation_cache FOR ALL
  USING (true);
