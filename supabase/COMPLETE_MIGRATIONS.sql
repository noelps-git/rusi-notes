-- ============================================================================
-- RUSI NOTES - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- This file combines all 4 migrations into one complete SQL script
-- Run this entire file in your Supabase SQL Editor to set up the database
--
-- Creates 13 tables for:
-- - User authentication and profiles
-- - Restaurant listings and management
-- - Tasting notes and reviews
-- - Social features (friends, groups, chat)
-- - Real-time notifications
-- - Business features (dishes, feedback)
-- ============================================================================

-- ============================================================================
-- MIGRATION 1: INITIAL SCHEMA
-- ============================================================================
-- Creates core tables: users, sessions, restaurants, tasting_notes,
-- comments, friendships, groups, group_members, messages, bookmarks

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'business', 'admin')),
  image TEXT,
  email_verified TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Create sessions table (for NextAuth)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT,
  city VARCHAR(100) DEFAULT 'Chennai',
  cuisine_type VARCHAR(100),
  price_range VARCHAR(50) CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
  phone VARCHAR(20),
  email VARCHAR(255),
  website TEXT,
  image_url TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_restaurants_city ON restaurants(city);
CREATE INDEX idx_restaurants_owner ON restaurants(owner_id);
CREATE INDEX idx_restaurants_verified ON restaurants(verified);

-- Create tasting_notes table
CREATE TABLE IF NOT EXISTS tasting_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  tags TEXT[], -- Array of tags
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notes_user ON tasting_notes(user_id);
CREATE INDEX idx_notes_restaurant ON tasting_notes(restaurant_id);
CREATE INDEX idx_notes_created ON tasting_notes(created_at DESC);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID NOT NULL REFERENCES tasting_notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For nested comments
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_note ON comments(note_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);

-- Create friendships table
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_friend ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_private BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_groups_creator ON groups(creator_id);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_group ON messages(group_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note_id UUID NOT NULL REFERENCES tasting_notes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, note_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_note ON bookmarks(note_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Anyone can read, users can update their own data
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Sessions: Users can manage their own sessions
CREATE POLICY "Users can manage own sessions" ON sessions FOR ALL USING (auth.uid() = user_id);

-- Restaurants: Public read, business users can manage their own
CREATE POLICY "Restaurants are viewable by everyone" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Business users can create restaurants" ON restaurants FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Business users can update own restaurants" ON restaurants FOR UPDATE USING (auth.uid() = owner_id);

-- Tasting Notes: Public read for public notes, users manage their own
CREATE POLICY "Public notes are viewable by everyone" ON tasting_notes FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can create notes" ON tasting_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON tasting_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON tasting_notes FOR DELETE USING (auth.uid() = user_id);

-- Comments: Public read, users manage their own
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Friendships: Users can view their own friendships
CREATE POLICY "Users can view own friendships" ON friendships FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can create friend requests" ON friendships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update received friend requests" ON friendships FOR UPDATE USING (auth.uid() = friend_id);
CREATE POLICY "Users can delete own friendships" ON friendships FOR DELETE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Groups: Public groups viewable by all, members can view private groups
CREATE POLICY "Groups are viewable by members" ON groups FOR SELECT USING (
  is_private = false OR
  EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = groups.id AND group_members.user_id = auth.uid())
);
CREATE POLICY "Users can create groups" ON groups FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Group creators/admins can update groups" ON groups FOR UPDATE USING (
  auth.uid() = creator_id OR
  EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = groups.id AND group_members.user_id = auth.uid() AND group_members.role = 'admin')
);

-- Group Members: Members can view other members
CREATE POLICY "Group members are viewable by members" ON group_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid())
);
CREATE POLICY "Group admins can add members" ON group_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM group_members WHERE group_id = group_members.group_id AND user_id = auth.uid() AND role = 'admin')
  OR EXISTS (SELECT 1 FROM groups WHERE id = group_members.group_id AND creator_id = auth.uid())
);
CREATE POLICY "Group admins can remove members" ON group_members FOR DELETE USING (
  EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid() AND gm.role = 'admin')
  OR EXISTS (SELECT 1 FROM groups WHERE id = group_members.group_id AND creator_id = auth.uid())
  OR auth.uid() = user_id -- Users can leave groups
);

-- Messages: Group members can view and send messages
CREATE POLICY "Group members can view messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = messages.group_id AND group_members.user_id = auth.uid())
);
CREATE POLICY "Group members can send messages" ON messages FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = messages.group_id AND group_members.user_id = auth.uid())
);

-- Bookmarks: Users manage their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON tasting_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON friendships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- MIGRATION 2: GST NUMBER
-- ============================================================================
-- Adds GST number field for business restaurants (Indian compliance)

-- Add GST number column to restaurants table
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS gst_number VARCHAR(15);

-- Add index for GST number lookups
CREATE INDEX IF NOT EXISTS idx_restaurants_gst ON restaurants(gst_number);

-- Add comment for documentation
COMMENT ON COLUMN restaurants.gst_number IS 'GST registration number for business compliance in India';


-- ============================================================================
-- MIGRATION 3: NOTIFICATIONS SYSTEM
-- ============================================================================
-- Creates real-time notifications table with 10-second polling support

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('friend_request', 'friend_accepted', 'comment', 'restaurant_verified', 'group_invite', 'message')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link TEXT, -- URL to navigate to when clicked
  read BOOLEAN DEFAULT FALSE,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL, -- User who triggered the notification
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for fast queries
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Create function to count unread notifications
CREATE OR REPLACE FUNCTION count_unread_notifications(uid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM notifications WHERE user_id = uid AND read = false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON TABLE notifications IS 'Real-time notification system with 10-second polling';


-- ============================================================================
-- MIGRATION 4: DISHES AND FEEDBACK
-- ============================================================================
-- Creates dishes (menu items) and customer feedback tables for businesses

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


-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================
--
-- ✅ 13 Tables Created:
--    - users (signup data appears here!)
--    - sessions
--    - restaurants
--    - tasting_notes
--    - comments
--    - friendships
--    - groups
--    - group_members
--    - messages
--    - bookmarks
--    - notifications
--    - dishes
--    - dish_feedback
--
-- ✅ Row Level Security (RLS) enabled on all tables
-- ✅ Indexes created for fast queries
-- ✅ Triggers set up for automatic updates
-- ✅ Functions created for business insights
--
-- 🎯 Next Steps:
-- 1. Go to "Table Editor" in Supabase to verify tables
-- 2. Click on "users" table to see where signup data will appear
-- 3. Deploy your app and watch signups appear in real-time!
--
-- ============================================================================
