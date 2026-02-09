-- 002_add_gst_number.sql
-- Add GST number field for business restaurants

-- Add GST number column to restaurants table
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS gst_number VARCHAR(15);

-- Add index for GST number lookups
CREATE INDEX IF NOT EXISTS idx_restaurants_gst ON restaurants(gst_number);

-- Add comment for documentation
COMMENT ON COLUMN restaurants.gst_number IS 'GST registration number for business compliance in India';
