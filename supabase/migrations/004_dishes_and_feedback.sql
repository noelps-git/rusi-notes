-- 004_dishes_and_feedback.sql
-- Dish management and customer feedback system for businesses

-- Create dishes table
CREATE TABLE IF NOT EXISTS dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- appetizer, main, dessert, beverage, etc.
  price DECIMAL(10,2),
  image_url TEXT,

  -- Dietary information
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  is_halal BOOLEAN DEFAULT FALSE,
  is_jain BOOLEAN DEFAULT FALSE,

  -- Allergen information
  allergens TEXT[], -- Array of allergen strings

  -- Availability
  is_available BOOLEAN DEFAULT TRUE,

  -- Ratings
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_dishes_restaurant ON dishes(restaurant_id);
CREATE INDEX idx_dishes_category ON dishes(category);
CREATE INDEX idx_dishes_available ON dishes(is_available);
CREATE INDEX idx_dishes_vegetarian ON dishes(is_vegetarian);

-- Create dish_feedback table
CREATE TABLE IF NOT EXISTS dish_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  tags TEXT[], -- Array of tags like "spicy", "authentic", "value for money"
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(dish_id, user_id) -- One feedback per user per dish
);

-- Create indexes
CREATE INDEX idx_dish_feedback_dish ON dish_feedback(dish_id);
CREATE INDEX idx_dish_feedback_user ON dish_feedback(user_id);
CREATE INDEX idx_dish_feedback_rating ON dish_feedback(rating);
CREATE INDEX idx_dish_feedback_created ON dish_feedback(created_at DESC);

-- Enable RLS
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dish_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dishes
CREATE POLICY "Dishes are viewable by everyone" ON dishes FOR SELECT USING (true);
CREATE POLICY "Restaurant owners can create dishes" ON dishes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM restaurants WHERE restaurants.id = dishes.restaurant_id AND restaurants.owner_id = auth.uid())
);
CREATE POLICY "Restaurant owners can update own dishes" ON dishes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM restaurants WHERE restaurants.id = dishes.restaurant_id AND restaurants.owner_id = auth.uid())
);
CREATE POLICY "Restaurant owners can delete own dishes" ON dishes FOR DELETE USING (
  EXISTS (SELECT 1 FROM restaurants WHERE restaurants.id = dishes.restaurant_id AND restaurants.owner_id = auth.uid())
);

-- RLS Policies for dish_feedback
CREATE POLICY "Dish feedback is viewable by everyone" ON dish_feedback FOR SELECT USING (true);
CREATE POLICY "Users can create dish feedback" ON dish_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own feedback" ON dish_feedback FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own feedback" ON dish_feedback FOR DELETE USING (auth.uid() = user_id);

-- Function to update dish ratings
CREATE OR REPLACE FUNCTION update_dish_ratings()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE dishes
  SET
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM dish_feedback
      WHERE dish_id = NEW.dish_id
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM dish_feedback
      WHERE dish_id = NEW.dish_id
    )
  WHERE id = NEW.dish_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update ratings after feedback
CREATE TRIGGER update_dish_ratings_after_feedback
AFTER INSERT OR UPDATE OR DELETE ON dish_feedback
FOR EACH ROW
EXECUTE FUNCTION update_dish_ratings();

-- Add updated_at triggers
CREATE TRIGGER update_dishes_updated_at
BEFORE UPDATE ON dishes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dish_feedback_updated_at
BEFORE UPDATE ON dish_feedback
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function for business insights
CREATE OR REPLACE FUNCTION get_business_insights(owner_uuid UUID)
RETURNS TABLE (
  total_dishes INTEGER,
  total_feedback INTEGER,
  average_rating DECIMAL,
  top_rated_dishes JSONB,
  low_rated_dishes JSONB,
  popular_tags JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH restaurant_data AS (
    SELECT id FROM restaurants WHERE owner_id = owner_uuid
  ),
  dish_stats AS (
    SELECT
      COUNT(DISTINCT d.id)::INTEGER as dish_count,
      COUNT(df.id)::INTEGER as feedback_count,
      COALESCE(AVG(df.rating), 0)::DECIMAL(3,2) as avg_rating
    FROM dishes d
    LEFT JOIN dish_feedback df ON d.id = df.dish_id
    WHERE d.restaurant_id IN (SELECT id FROM restaurant_data)
  ),
  top_dishes AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', d.id,
        'name', d.name,
        'rating', d.average_rating,
        'count', d.rating_count
      )
    ) as top_rated
    FROM dishes d
    WHERE d.restaurant_id IN (SELECT id FROM restaurant_data)
      AND d.rating_count >= 2
    ORDER BY d.average_rating DESC
    LIMIT 5
  ),
  low_dishes AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', d.id,
        'name', d.name,
        'rating', d.average_rating,
        'count', d.rating_count
      )
    ) as low_rated
    FROM dishes d
    WHERE d.restaurant_id IN (SELECT id FROM restaurant_data)
      AND d.rating_count >= 2
    ORDER BY d.average_rating ASC
    LIMIT 5
  ),
  tag_stats AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'tag', tag,
        'count', tag_count
      )
    ) as tags
    FROM (
      SELECT unnest(tags) as tag, COUNT(*) as tag_count
      FROM dish_feedback df
      JOIN dishes d ON df.dish_id = d.id
      WHERE d.restaurant_id IN (SELECT id FROM restaurant_data)
      GROUP BY unnest(tags)
      ORDER BY tag_count DESC
      LIMIT 10
    ) t
  )
  SELECT
    ds.dish_count,
    ds.feedback_count,
    ds.avg_rating,
    td.top_rated,
    ld.low_rated,
    ts.tags
  FROM dish_stats ds
  CROSS JOIN top_dishes td
  CROSS JOIN low_dishes ld
  CROSS JOIN tag_stats ts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON TABLE dishes IS 'Restaurant menu items with dietary and allergen information';
COMMENT ON TABLE dish_feedback IS 'Customer ratings and feedback for dishes';
