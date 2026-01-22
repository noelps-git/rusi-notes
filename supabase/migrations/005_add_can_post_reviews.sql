-- Add can_post_reviews column to users table
-- This allows tracking which users have opted in to post reviews

ALTER TABLE users
ADD COLUMN IF NOT EXISTS can_post_reviews BOOLEAN DEFAULT true;

-- Add comment to column
COMMENT ON COLUMN users.can_post_reviews IS 'Whether the user has opted in to post reviews and share with the community';
