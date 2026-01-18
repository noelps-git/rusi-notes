-- Add GST number field to restaurants table for business verification
ALTER TABLE restaurants ADD COLUMN gst_number VARCHAR(15);

-- Add index for GST number lookups
CREATE INDEX idx_restaurants_gst ON restaurants(gst_number);

-- Add comment
COMMENT ON COLUMN restaurants.gst_number IS 'GST number for business verification (kept private)';
