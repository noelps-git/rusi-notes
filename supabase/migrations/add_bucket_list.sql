-- Create bucket_list table
CREATE TABLE IF NOT EXISTS bucket_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  note TEXT,
  is_visited BOOLEAN DEFAULT FALSE,
  added_from_friend_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, restaurant_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bucket_list_user_id ON bucket_list(user_id);
CREATE INDEX IF NOT EXISTS idx_bucket_list_restaurant_id ON bucket_list(restaurant_id);

-- Enable RLS
ALTER TABLE bucket_list ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own bucket list" ON bucket_list
  FOR SELECT USING (auth.uid()::text = user_id::text OR true);

CREATE POLICY "Users can insert into their own bucket list" ON bucket_list
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own bucket list items" ON bucket_list
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own bucket list items" ON bucket_list
  FOR DELETE USING (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_bucket_list_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bucket_list_updated_at
  BEFORE UPDATE ON bucket_list
  FOR EACH ROW
  EXECUTE FUNCTION update_bucket_list_updated_at();
