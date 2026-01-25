-- Seed Chennai Restaurants and Dishes for user reviews

-- Insert sample restaurants across Chennai
INSERT INTO restaurants (name, categories, address, chennai_area, is_verified, created_at) VALUES
('Saravana Bhavan', ARRAY['South Indian', 'Vegetarian'], '77 Usman Road, T. Nagar', 'T. Nagar', true, NOW()),
('Anjappar Chettinad', ARRAY['Chettinad', 'Non-Vegetarian'], '156 Anna Salai, Mount Road', 'Mount Road', true, NOW()),
('Murugan Idli Shop', ARRAY['South Indian', 'Vegetarian'], '123 GN Chetty Road, T. Nagar', 'T. Nagar', true, NOW()),
('Buhari Hotel', ARRAY['Biryani', 'Non-Vegetarian'], '83 Mount Road', 'Mount Road', true, NOW()),
('Sangeetha Restaurant', ARRAY['South Indian', 'Vegetarian'], '24 Pondy Bazaar, T. Nagar', 'T. Nagar', true, NOW()),
('Nair Mess', ARRAY['Kerala', 'Non-Vegetarian'], '45 Sterling Road, Nungambakkam', 'Nungambakkam', true, NOW()),
('Adyar Ananda Bhavan', ARRAY['South Indian', 'Vegetarian', 'Sweets'], '12 GN Chetty Road, Adyar', 'Adyar', true, NOW()),
('Thalappakatti Biriyani', ARRAY['Biryani', 'Non-Vegetarian'], '67 Velachery Main Road', 'Velachery', true, NOW()),
('Ponnusamy Hotel', ARRAY['Chettinad', 'Non-Vegetarian'], '89 Nungambakkam High Road', 'Nungambakkam', true, NOW()),
('Ratna Cafe', ARRAY['South Indian', 'Vegetarian'], '34 Triplicane High Road', 'Triplicane', true, NOW()),
('Wangs Kitchen', ARRAY['Chinese', 'Non-Vegetarian'], '23 OMR Road', 'OMR', true, NOW()),
('Kalyana Bhavan', ARRAY['South Indian', 'Vegetarian'], '56 Royapettah High Road', 'Royapettah', true, NOW()),
('The Marina', ARRAY['Seafood', 'Non-Vegetarian'], '12 ECR Road', 'ECR', true, NOW()),
('Junior Kuppanna', ARRAY['Chettinad', 'Non-Vegetarian'], '78 Cathedral Road', 'Gopalapuram', true, NOW()),
('Sree Annapoorna', ARRAY['South Indian', 'Vegetarian'], '45 Coimbatore Avinashi Road', 'Anna Nagar', true, NOW());

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
  (saravana_id, 'Masala Dosa', 80, ARRAY['Vegetarian'], ARRAY[]::text[], NOW()),
  (saravana_id, 'Ghee Pongal', 100, ARRAY['Vegetarian'], ARRAY['Dairy'], NOW()),
  (saravana_id, 'Filter Coffee', 40, ARRAY['Vegetarian'], ARRAY['Dairy'], NOW()),
  (saravana_id, 'Vada Sambar', 60, ARRAY['Vegetarian'], ARRAY[]::text[], NOW());

  -- Anjappar dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (anjappar_id, 'Chettinad Chicken', 280, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW()),
  (anjappar_id, 'Mutton Pepper Fry', 320, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW()),
  (anjappar_id, 'Prawn Masala', 350, ARRAY['Non-Vegetarian'], ARRAY['Shellfish'], NOW()),
  (anjappar_id, 'Chicken Biryani', 250, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW());

  -- Murugan Idli Shop dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (murugan_id, 'Podi Idli', 70, ARRAY['Vegetarian'], ARRAY[]::text[], NOW()),
  (murugan_id, 'Ghee Roast', 90, ARRAY['Vegetarian'], ARRAY['Dairy'], NOW()),
  (murugan_id, 'Vada', 50, ARRAY['Vegetarian'], ARRAY[]::text[], NOW());

  -- Buhari Hotel dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (buhari_id, 'Buhari Chicken Biryani', 300, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW()),
  (buhari_id, 'Mutton Biryani', 350, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW()),
  (buhari_id, 'Chicken 65', 220, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW());

  -- Sangeetha dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (sangeetha_id, 'Rava Dosa', 85, ARRAY['Vegetarian'], ARRAY[]::text[], NOW()),
  (sangeetha_id, 'Paneer Butter Masala', 180, ARRAY['Vegetarian'], ARRAY['Dairy'], NOW()),
  (sangeetha_id, 'Curd Rice', 90, ARRAY['Vegetarian'], ARRAY['Dairy'], NOW());

  -- Nair Mess dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (nair_id, 'Fish Curry', 200, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW()),
  (nair_id, 'Beef Fry', 250, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW()),
  (nair_id, 'Parotta', 40, ARRAY['Vegetarian'], ARRAY[]::text[], NOW());

  -- Adyar Ananda Bhavan dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (adyar_id, 'Mini Tiffin', 120, ARRAY['Vegetarian'], ARRAY[]::text[], NOW()),
  (adyar_id, 'Mysore Pak', 100, ARRAY['Vegetarian'], ARRAY['Dairy'], NOW()),
  (adyar_id, 'Pav Bhaji', 130, ARRAY['Vegetarian'], ARRAY['Dairy'], NOW());

  -- Thalappakatti dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (thalappakatti_id, 'Mutton Biryani', 380, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW()),
  (thalappakatti_id, 'Chicken Biryani', 300, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW());

  -- Ponnusamy dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (ponnusamy_id, 'Chicken Chettinad', 290, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW()),
  (ponnusamy_id, 'Crab Masala', 450, ARRAY['Non-Vegetarian'], ARRAY['Shellfish'], NOW());

  -- Ratna Cafe dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (ratna_id, 'Kesari Bath', 60, ARRAY['Vegetarian'], ARRAY['Dairy'], NOW()),
  (ratna_id, 'Upma', 50, ARRAY['Vegetarian'], ARRAY[]::text[], NOW());

  -- Wangs Kitchen dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (wangs_id, 'Chicken Manchurian', 240, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW()),
  (wangs_id, 'Hakka Noodles', 180, ARRAY['Vegetarian'], ARRAY[]::text[], NOW());

  -- Kalyana Bhavan dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (kalyana_id, 'Meals', 150, ARRAY['Vegetarian'], ARRAY[]::text[], NOW()),
  (kalyana_id, 'Sambar Vada', 65, ARRAY['Vegetarian'], ARRAY[]::text[], NOW());

  -- The Marina dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (marina_id, 'Prawn Fry', 380, ARRAY['Non-Vegetarian'], ARRAY['Shellfish'], NOW()),
  (marina_id, 'Fish Curry', 320, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW());

  -- Junior Kuppanna dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (kuppanna_id, 'Nattu Kozhi Varuval', 350, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW()),
  (kuppanna_id, 'Mutton Chukka', 380, ARRAY['Non-Vegetarian'], ARRAY[]::text[], NOW());

  -- Sree Annapoorna dishes
  INSERT INTO dishes (restaurant_id, name, price, dietary_info, allergens, created_at) VALUES
  (annapoorna_id, 'Special Meals', 140, ARRAY['Vegetarian'], ARRAY[]::text[], NOW()),
  (annapoorna_id, 'Poori Masala', 80, ARRAY['Vegetarian'], ARRAY[]::text[], NOW());

END $$;

COMMENT ON TABLE restaurants IS 'Seeded with popular Chennai restaurants for user reviews';
