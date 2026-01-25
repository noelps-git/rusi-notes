-- Seed Chennai Restaurants and Dishes for user reviews

-- Insert sample restaurants across Chennai
INSERT INTO restaurants (name, categories, address, is_verified, created_at) VALUES
('Saravana Bhavan', ARRAY['south_indian']::restaurant_category[], '77 Usman Road, T. Nagar, Chennai', true, NOW()),
('Anjappar Chettinad', ARRAY['chettinad']::restaurant_category[], '156 Anna Salai, Mount Road, Chennai', true, NOW()),
('Murugan Idli Shop', ARRAY['south_indian']::restaurant_category[], '123 GN Chetty Road, T. Nagar, Chennai', true, NOW()),
('Buhari Hotel', ARRAY['biryani']::restaurant_category[], '83 Mount Road, Chennai', true, NOW()),
('Sangeetha Restaurant', ARRAY['south_indian']::restaurant_category[], '24 Pondy Bazaar, T. Nagar, Chennai', true, NOW()),
('Nair Mess', ARRAY['south_indian']::restaurant_category[], '45 Sterling Road, Nungambakkam, Chennai', true, NOW()),
('Adyar Ananda Bhavan', ARRAY['south_indian', 'desserts']::restaurant_category[], '12 GN Chetty Road, Adyar, Chennai', true, NOW()),
('Thalappakatti Biriyani', ARRAY['biryani']::restaurant_category[], '67 Velachery Main Road, Chennai', true, NOW()),
('Ponnusamy Hotel', ARRAY['chettinad']::restaurant_category[], '89 Nungambakkam High Road, Chennai', true, NOW()),
('Ratna Cafe', ARRAY['south_indian', 'cafe']::restaurant_category[], '34 Triplicane High Road, Chennai', true, NOW()),
('Wangs Kitchen', ARRAY['chinese']::restaurant_category[], '23 OMR Road, Chennai', true, NOW()),
('Kalyana Bhavan', ARRAY['south_indian']::restaurant_category[], '56 Royapettah High Road, Chennai', true, NOW()),
('The Marina', ARRAY['seafood']::restaurant_category[], '12 ECR Road, Chennai', true, NOW()),
('Junior Kuppanna', ARRAY['chettinad']::restaurant_category[], '78 Cathedral Road, Gopalapuram, Chennai', true, NOW()),
('Sree Annapoorna', ARRAY['south_indian']::restaurant_category[], '45 Coimbatore Avinashi Road, Anna Nagar, Chennai', true, NOW());

-- Get restaurant IDs for adding dishes
DO $$
DECLARE
  saravana_id UUID;
  anjappar_id UUID;
  murugan_id UUID;
  buhari_id UUID;
  sangeetha_id UUID;
  nair_id UUID;
  adyar_id UUID;
  thalappakatti_id UUID;
  ponnusamy_id UUID;
  ratna_id UUID;
  wangs_id UUID;
  kalyana_id UUID;
  marina_id UUID;
  kuppanna_id UUID;
  annapoorna_id UUID;
BEGIN
  -- Get restaurant IDs
  SELECT id INTO saravana_id FROM restaurants WHERE name = 'Saravana Bhavan' LIMIT 1;
  SELECT id INTO anjappar_id FROM restaurants WHERE name = 'Anjappar Chettinad' LIMIT 1;
  SELECT id INTO murugan_id FROM restaurants WHERE name = 'Murugan Idli Shop' LIMIT 1;
  SELECT id INTO buhari_id FROM restaurants WHERE name = 'Buhari Hotel' LIMIT 1;
  SELECT id INTO sangeetha_id FROM restaurants WHERE name = 'Sangeetha Restaurant' LIMIT 1;
  SELECT id INTO nair_id FROM restaurants WHERE name = 'Nair Mess' LIMIT 1;
  SELECT id INTO adyar_id FROM restaurants WHERE name = 'Adyar Ananda Bhavan' LIMIT 1;
  SELECT id INTO thalappakatti_id FROM restaurants WHERE name = 'Thalappakatti Biriyani' LIMIT 1;
  SELECT id INTO ponnusamy_id FROM restaurants WHERE name = 'Ponnusamy Hotel' LIMIT 1;
  SELECT id INTO ratna_id FROM restaurants WHERE name = 'Ratna Cafe' LIMIT 1;
  SELECT id INTO wangs_id FROM restaurants WHERE name = 'Wangs Kitchen' LIMIT 1;
  SELECT id INTO kalyana_id FROM restaurants WHERE name = 'Kalyana Bhavan' LIMIT 1;
  SELECT id INTO marina_id FROM restaurants WHERE name = 'The Marina' LIMIT 1;
  SELECT id INTO kuppanna_id FROM restaurants WHERE name = 'Junior Kuppanna' LIMIT 1;
  SELECT id INTO annapoorna_id FROM restaurants WHERE name = 'Sree Annapoorna' LIMIT 1;

  -- Saravana Bhavan dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (saravana_id, 'Masala Dosa', 80, ARRAY['vegetarian']::dietary_preference[], ARRAY[]::text[], NOW()),
  (saravana_id, 'Ghee Pongal', 100, ARRAY['vegetarian']::dietary_preference[], ARRAY['Dairy'], NOW()),
  (saravana_id, 'Filter Coffee', 40, ARRAY['vegetarian']::dietary_preference[], ARRAY['Dairy'], NOW()),
  (saravana_id, 'Vada Sambar', 60, ARRAY['vegetarian']::dietary_preference[], ARRAY[]::text[], NOW());

  -- Anjappar dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (anjappar_id, 'Chettinad Chicken', 280, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW()),
  (anjappar_id, 'Mutton Pepper Fry', 320, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW()),
  (anjappar_id, 'Prawn Masala', 350, ARRAY['non_veg']::dietary_preference[], ARRAY['Shellfish'], NOW()),
  (anjappar_id, 'Chicken Biryani', 250, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW());

  -- Murugan Idli Shop dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (murugan_id, 'Podi Idli', 70, ARRAY['vegetarian']::dietary_preference[], ARRAY[]::text[], NOW()),
  (murugan_id, 'Ghee Roast', 90, ARRAY['vegetarian']::dietary_preference[], ARRAY['Dairy'], NOW()),
  (murugan_id, 'Vada', 50, ARRAY['vegetarian']::dietary_preference[], ARRAY[]::text[], NOW());

  -- Buhari Hotel dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (buhari_id, 'Buhari Chicken Biryani', 300, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW()),
  (buhari_id, 'Mutton Biryani', 350, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW()),
  (buhari_id, 'Chicken 65', 220, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW());

  -- Sangeetha dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (sangeetha_id, 'Rava Dosa', 85, ARRAY['vegetarian']::dietary_preference[], ARRAY[]::text[], NOW()),
  (sangeetha_id, 'Paneer Butter Masala', 180, ARRAY['vegetarian']::dietary_preference[], ARRAY['Dairy'], NOW()),
  (sangeetha_id, 'Curd Rice', 90, ARRAY['vegetarian']::dietary_preference[], ARRAY['Dairy'], NOW());

  -- Nair Mess dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (nair_id, 'Fish Curry', 200, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW()),
  (nair_id, 'Beef Fry', 250, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW()),
  (nair_id, 'Parotta', 40, ARRAY['vegetarian']::dietary_preference[], ARRAY[]::text[], NOW());

  -- Adyar Ananda Bhavan dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (adyar_id, 'Mini Tiffin', 120, ARRAY['vegetarian']::dietary_preference[], ARRAY[]::text[], NOW()),
  (adyar_id, 'Mysore Pak', 100, ARRAY['vegetarian']::dietary_preference[], ARRAY['Dairy'], NOW()),
  (adyar_id, 'Pav Bhaji', 130, ARRAY['vegetarian']::dietary_preference[], ARRAY['Dairy'], NOW());

  -- Thalappakatti dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (thalappakatti_id, 'Mutton Biryani', 380, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW()),
  (thalappakatti_id, 'Chicken Biryani', 300, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW());

  -- Ponnusamy dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (ponnusamy_id, 'Chicken Chettinad', 290, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW()),
  (ponnusamy_id, 'Crab Masala', 450, ARRAY['non_veg']::dietary_preference[], ARRAY['Shellfish'], NOW());

  -- Ratna Cafe dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (ratna_id, 'Kesari Bath', 60, ARRAY['vegetarian']::dietary_preference[], ARRAY['Dairy'], NOW()),
  (ratna_id, 'Upma', 50, ARRAY['vegetarian']::dietary_preference[], ARRAY[]::text[], NOW());

  -- Wangs Kitchen dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (wangs_id, 'Chicken Manchurian', 240, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW()),
  (wangs_id, 'Hakka Noodles', 180, ARRAY['vegetarian']::dietary_preference[], ARRAY[]::text[], NOW());

  -- Kalyana Bhavan dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (kalyana_id, 'Meals', 150, ARRAY['vegetarian']::dietary_preference[], ARRAY[]::text[], NOW()),
  (kalyana_id, 'Sambar Vada', 65, ARRAY['vegetarian']::dietary_preference[], ARRAY[]::text[], NOW());

  -- The Marina dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (marina_id, 'Prawn Fry', 380, ARRAY['non_veg']::dietary_preference[], ARRAY['Shellfish'], NOW()),
  (marina_id, 'Fish Curry', 320, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW());

  -- Junior Kuppanna dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (kuppanna_id, 'Nattu Kozhi Varuval', 350, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW()),
  (kuppanna_id, 'Mutton Chukka', 380, ARRAY['non_veg']::dietary_preference[], ARRAY[]::text[], NOW());

  -- Sree Annapoorna dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (annapoorna_id, 'Special Meals', 140, ARRAY['vegetarian']::dietary_preference[], ARRAY[]::text[], NOW()),
  (annapoorna_id, 'Poori Masala', 80, ARRAY['vegetarian']::dietary_preference[], ARRAY[]::text[], NOW());

END $$;

COMMENT ON TABLE restaurants IS 'Seeded with popular Chennai restaurants for user reviews';
