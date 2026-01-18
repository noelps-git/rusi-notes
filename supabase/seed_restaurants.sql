-- Sample Chennai Restaurants Seed Data
-- Run this in Supabase SQL Editor to populate sample restaurants

-- Note: First create a business user to own these restaurants
-- You can do this via the signup page or insert manually:

INSERT INTO users (email, password_hash, full_name, role, business_name, business_verified)
VALUES
  ('saravana@test.com', '$2a$10$YourHashHere', 'Saravana Bhavan', 'business', 'Saravana Bhavan', true),
  ('murugan@test.com', '$2a$10$YourHashHere', 'Murugan Idli Shop', 'business', 'Murugan Idli Shop', true),
  ('buhari@test.com', '$2a$10$YourHashHere', 'Buhari Hotel', 'business', 'Buhari Hotel', true)
ON CONFLICT (email) DO NOTHING;

-- Get the user IDs
DO $$
DECLARE
  saravana_id UUID;
  murugan_id UUID;
  buhari_id UUID;
BEGIN
  SELECT id INTO saravana_id FROM users WHERE email = 'saravana@test.com';
  SELECT id INTO murugan_id FROM users WHERE email = 'murugan@test.com';
  SELECT id INTO buhari_id FROM users WHERE email = 'buhari@test.com';

  -- Insert Sample Restaurants
  INSERT INTO restaurants (
    owner_id, name, description, categories, address, city, phone,
    price_range, average_rating, total_reviews, is_verified
  ) VALUES
  (
    saravana_id,
    'Saravana Bhavan',
    'Famous for authentic South Indian vegetarian cuisine. Known for their crispy dosas, fluffy idlis, and aromatic filter coffee.',
    ARRAY['south_indian'::restaurant_category, 'vegetarian'::restaurant_category],
    '77, Usman Road, T. Nagar, Chennai',
    'Chennai',
    '+91 44 2434 6555',
    '₹₹',
    4.5,
    1250,
    true
  ),
  (
    murugan_id,
    'Murugan Idli Shop',
    'The original idli shop that started it all. Soft, fluffy idlis served with 17 varieties of chutney and sambar.',
    ARRAY['south_indian'::restaurant_category],
    '31, Gandhi Irwin Bridge Road, Egmore, Chennai',
    'Chennai',
    '+91 44 2819 3422',
    '₹',
    4.7,
    2100,
    true
  ),
  (
    buhari_id,
    'Buhari Hotel',
    'Legendary restaurant credited with inventing biryani. Rich, flavorful dishes with authentic Chennai spices.',
    ARRAY['biryani'::restaurant_category, 'north_indian'::restaurant_category],
    '83/1, Mount Road, Anna Salai, Chennai',
    'Chennai',
    '+91 44 2434 9090',
    '₹₹₹',
    4.4,
    3200,
    true
  ),
  (
    saravana_id,
    'Anjappar Chettinad',
    'Authentic Chettinad cuisine with bold flavors and spices. Famous for their spicy chicken dishes and mutton biryani.',
    ARRAY['chettinad'::restaurant_category, 'south_indian'::restaurant_category],
    '803, Mount Road, Thousand Lights, Chennai',
    'Chennai',
    '+91 44 2857 1478',
    '₹₹',
    4.3,
    1800,
    true
  ),
  (
    murugan_id,
    'The Marina',
    'Seafood paradise with fresh catch daily. Specializes in Chettinad-style fish curry and prawns masala.',
    ARRAY['seafood'::restaurant_category, 'chettinad'::restaurant_category],
    '134, Kamaraj Salai, R. A. Puram, Chennai',
    'Chennai',
    '+91 44 2434 7777',
    '₹₹₹',
    4.6,
    950,
    true
  ),
  (
    buhari_id,
    'A2B - Adyar Ananda Bhavan',
    'Sweets and snacks haven! Famous for their Mysore Pak, variety dosas, and South Indian breakfast items.',
    ARRAY['south_indian'::restaurant_category, 'desserts'::restaurant_category],
    '20, Venkatakrishna Road, Mandaveli, Chennai',
    'Chennai',
    '+91 44 2434 0404',
    '₹₹',
    4.2,
    1600,
    true
  ),
  (
    saravana_id,
    'Copper Chimney',
    'North Indian and Continental cuisine in an elegant setting. Great for special occasions.',
    ARRAY['north_indian'::restaurant_category, 'continental'::restaurant_category],
    'Express Avenue Mall, Royapettah, Chennai',
    'Chennai',
    '+91 44 4299 4000',
    '₹₹₹',
    4.1,
    720,
    true
  ),
  (
    murugan_id,
    'Hot Breads',
    'Premium bakery and cafe chain. Known for their croissants, pastries, and freshly baked breads.',
    ARRAY['bakery'::restaurant_category, 'cafe'::restaurant_category],
    'Spencer Plaza, Anna Salai, Chennai',
    'Chennai',
    '+91 44 2852 4455',
    '₹₹',
    4.0,
    890,
    true
  ),
  (
    buhari_id,
    'Ponnusamy Hotel',
    'Authentic Chettinad non-vegetarian delicacies. Famous for their pepper chicken and mutton chukka.',
    ARRAY['chettinad'::restaurant_category],
    '229, Royapettah High Road, Mylapore, Chennai',
    'Chennai',
    '+91 44 2499 7110',
    '₹₹',
    4.5,
    1420,
    true
  ),
  (
    saravana_id,
    'Sangeetha Restaurant',
    'Pure vegetarian multi-cuisine restaurant. Wide variety of South and North Indian dishes.',
    ARRAY['south_indian'::restaurant_category, 'north_indian'::restaurant_category],
    '2, Cathedral Road, Gopalapuram, Chennai',
    'Chennai',
    '+91 44 2811 2233',
    '₹₹',
    4.2,
    1150,
    true
  );

  -- Insert Sample Dishes for some restaurants
  INSERT INTO dishes (restaurant_id, name, description, price, category, dietary_info)
  SELECT
    id as restaurant_id,
    'Masala Dosa',
    'Crispy rice crepe filled with spiced potato masala, served with sambar and chutneys',
    120.00,
    'Main Course',
    ARRAY['vegetarian'::dietary_preference]
  FROM restaurants WHERE name = 'Saravana Bhavan'
  UNION ALL
  SELECT
    id,
    'Filter Coffee',
    'Traditional South Indian coffee brewed with chicory, served in a steel tumbler',
    40.00,
    'Beverages',
    ARRAY['vegetarian'::dietary_preference]
  FROM restaurants WHERE name = 'Saravana Bhavan'
  UNION ALL
  SELECT
    id,
    'Pongal',
    'Comforting rice and lentil porridge tempered with ghee, cashews, and black pepper',
    80.00,
    'Breakfast',
    ARRAY['vegetarian'::dietary_preference]
  FROM restaurants WHERE name = 'Murugan Idli Shop'
  UNION ALL
  SELECT
    id,
    'Mini Tiffin',
    '2 Idlis, 1 Vada, served with 5 types of chutney and sambar',
    100.00,
    'Breakfast',
    ARRAY['vegetarian'::dietary_preference]
  FROM restaurants WHERE name = 'Murugan Idli Shop'
  UNION ALL
  SELECT
    id,
    'Chicken Biryani',
    'Fragrant basmati rice layered with tender chicken pieces and aromatic spices',
    280.00,
    'Main Course',
    ARRAY['non_veg'::dietary_preference]
  FROM restaurants WHERE name = 'Buhari Hotel'
  UNION ALL
  SELECT
    id,
    'Mutton Chukka',
    'Dry preparation of mutton cooked with aromatic Chettinad spices',
    350.00,
    'Main Course',
    ARRAY['non_veg'::dietary_preference]
  FROM restaurants WHERE name = 'Anjappar Chettinad';

END $$;

-- Success message
SELECT 'Sample restaurants and dishes created successfully!' as message;
