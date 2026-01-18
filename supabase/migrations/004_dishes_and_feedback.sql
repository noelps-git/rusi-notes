-- Dishes and Feedback System Migration
-- For business insights and recommendations

-- Create dishes table
CREATE TABLE IF NOT EXISTS dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  category VARCHAR(100),
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_halal BOOLEAN DEFAULT false,
  is_jain BOOLEAN DEFAULT false,
  allergens TEXT[], -- Array of allergens
  is_available BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create dish_feedback table
CREATE TABLE IF NOT EXISTS dish_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  tags TEXT[], -- Positive tags like "spicy", "flavorful", "fresh"
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(dish_id, user_id) -- One feedback per user per dish
);

-- Create indexes
CREATE INDEX idx_dishes_restaurant_id ON dishes(restaurant_id);
CREATE INDEX idx_dishes_category ON dishes(category);
CREATE INDEX idx_dishes_available ON dishes(is_available);
CREATE INDEX idx_dish_feedback_dish_id ON dish_feedback(dish_id);
CREATE INDEX idx_dish_feedback_user_id ON dish_feedback(user_id);
CREATE INDEX idx_dish_feedback_rating ON dish_feedback(rating);

-- Add RLS policies for dishes
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

-- Anyone can view dishes
CREATE POLICY "Anyone can view dishes"
  ON dishes FOR SELECT
  USING (true);

-- Only restaurant owner can create/update/delete dishes
CREATE POLICY "Restaurant owner can manage dishes"
  ON dishes FOR ALL
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- Add RLS policies for dish_feedback
ALTER TABLE dish_feedback ENABLE ROW LEVEL SECURITY;

-- Anyone can view feedback
CREATE POLICY "Anyone can view feedback"
  ON dish_feedback FOR SELECT
  USING (true);

-- Users can create their own feedback
CREATE POLICY "Users can create own feedback"
  ON dish_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update/delete their own feedback
CREATE POLICY "Users can update own feedback"
  ON dish_feedback FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feedback"
  ON dish_feedback FOR DELETE
  USING (auth.uid() = user_id);

-- Add comments
COMMENT ON TABLE dishes IS 'Menu items for restaurants';
COMMENT ON TABLE dish_feedback IS 'User feedback and ratings for dishes';
COMMENT ON COLUMN dishes.allergens IS 'Array of allergen names (peanuts, dairy, shellfish, etc.)';
COMMENT ON COLUMN dish_feedback.tags IS 'Descriptive tags from users (spicy, sweet, crunchy, etc.)';
