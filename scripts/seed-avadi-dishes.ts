// Script to seed dishes for Avadi restaurants
// Run with: npx tsx scripts/seed-avadi-dishes.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Restaurant name -> dishes mapping
const restaurantDishes: Record<string, { name: string; category: string }[]> = {
  'Bagheera Multi Cuisine Restaurant - Avadi': [
    { name: 'Chicken 65', category: 'Starter' },
    { name: 'Mutton Biryani', category: 'Biryani' },
    { name: 'Paneer Butter Masala', category: 'Curry' },
    { name: 'Veg Fried Rice', category: 'Chinese' },
    { name: 'BBQ Chicken', category: 'Grill' },
    { name: 'Gobi 65', category: 'Starter' },
    { name: 'Butter Naan', category: 'Bread' },
    { name: 'Manchurian Gravy', category: 'Chinese' },
    { name: 'Chicken Lollipop', category: 'Starter' },
    { name: 'Multi Cuisine Thali', category: 'Lunch' },
    { name: 'Prawn Fried Rice', category: 'Seafood' },
  ],
  'Ayyar Bhavan - Avadi': [
    { name: 'Idli Sambar', category: 'Breakfast' },
    { name: 'Dosa Plain', category: 'Breakfast' },
    { name: 'Pongal', category: 'Breakfast' },
    { name: 'Medhu Vadai', category: 'Appetizer' },
    { name: 'Filter Coffee', category: 'Beverage' },
    { name: 'South Indian Meals', category: 'Lunch' },
    { name: 'Appam Stew', category: 'Breakfast' },
    { name: 'Uttapam', category: 'Breakfast' },
    { name: 'Bisi Bele Bath', category: 'Rice' },
    { name: 'Rava Dosa', category: 'Breakfast' },
  ],
  "Domino's Pizza - Avadi": [
    { name: 'Margherita Pizza', category: 'Pizza' },
    { name: 'Chicken Dominator', category: 'Pizza' },
    { name: 'Peppy Paneer', category: 'Pizza' },
    { name: 'Cheese Burst Pizza', category: 'Pizza' },
    { name: 'Garlic Bread', category: 'Side' },
    { name: 'Veg Lava Cake', category: 'Dessert' },
    { name: 'Chicken Wings', category: 'Side' },
    { name: 'Paneer Tikka Pizza', category: 'Pizza' },
    { name: 'Farmhouse Pizza', category: 'Pizza' },
    { name: 'Choco Lava Cake', category: 'Dessert' },
  ],
  'Boozo the Kulfi Laboratory - Avadi': [
    { name: 'Kulfi Falooda', category: 'Dessert' },
    { name: 'Mango Kulfi', category: 'Dessert' },
    { name: 'Pista Kulfi', category: 'Dessert' },
    { name: 'Rabri Falooda', category: 'Dessert' },
    { name: 'Sitaphal Kulfi', category: 'Dessert' },
    { name: 'Kesar Kulfi', category: 'Dessert' },
    { name: 'Malai Kulfi', category: 'Dessert' },
    { name: 'Badam Kulfi', category: 'Dessert' },
    { name: 'Rose Falooda', category: 'Dessert' },
    { name: 'Vanilla Kulfi', category: 'Dessert' },
  ],
  'Nostra Suvai - Avadi': [
    { name: 'Chettinad Chicken', category: 'Curry' },
    { name: 'Mutton Biryani', category: 'Biryani' },
    { name: 'Paneer 65', category: 'Starter' },
    { name: 'Veg Biryani', category: 'Biryani' },
    { name: 'Chicken Fried Rice', category: 'Chinese' },
    { name: 'Dosa Variants', category: 'Breakfast' },
    { name: 'Parotta Set', category: 'Main' },
    { name: 'Crab Lollipop', category: 'Seafood' },
    { name: 'Ghee Roast', category: 'Specialty' },
    { name: 'Idiyappam', category: 'Main' },
    { name: 'Mushroom Masala', category: 'Curry' },
  ],
  'Elite Restaurant - Avadi': [
    { name: 'North Indian Thali', category: 'Lunch' },
    { name: 'Chicken Tikka Masala', category: 'Curry' },
    { name: 'Veg Hakka Noodles', category: 'Chinese' },
    { name: 'Seafood Platter', category: 'Seafood' },
    { name: 'Chettinad Meals', category: 'Lunch' },
    { name: 'Continental Grill', category: 'Grill' },
    { name: 'Manchow Soup', category: 'Soup' },
    { name: 'Butter Chicken', category: 'Curry' },
    { name: 'Fish Fry', category: 'Starter' },
    { name: 'Paneer Tikka', category: 'Starter' },
    { name: 'Biryani House Special', category: 'Biryani' },
  ],
  'Nandavanam Mess - Avadi': [
    { name: 'Chicken Biryani', category: 'Biryani' },
    { name: 'Mutton Curry', category: 'Curry' },
    { name: 'Dosa', category: 'Breakfast' },
    { name: 'Parotta Gravy', category: 'Main' },
    { name: 'Idli Sambar', category: 'Breakfast' },
    { name: 'Chicken Lollipop', category: 'Starter' },
    { name: 'Non-Veg Thali', category: 'Lunch' },
    { name: 'Egg Dosa', category: 'Breakfast' },
    { name: 'Chicken Fry', category: 'Dry' },
    { name: 'Prawn Masala', category: 'Seafood' },
  ],
  'Ayyaar Bawan Sweets & Restaurant - Avadi Paruthipet': [
    { name: 'Sweet Pongal', category: 'Dessert' },
    { name: 'Laddu', category: 'Sweet' },
    { name: 'Jalebi', category: 'Sweet' },
    { name: 'Mysore Pak', category: 'Sweet' },
    { name: 'Badam Halwa', category: 'Sweet' },
    { name: 'Filter Coffee', category: 'Beverage' },
    { name: 'Dosa', category: 'Breakfast' },
    { name: 'Meals', category: 'Lunch' },
    { name: 'Vadai', category: 'Appetizer' },
    { name: 'Rava Kesari', category: 'Sweet' },
  ],
  'SS Hyderabad Biryani - Avadi HVF Road': [
    { name: 'Chicken Dum Biryani', category: 'Biryani' },
    { name: 'Mutton Dum Biryani', category: 'Biryani' },
    { name: 'Egg Biryani', category: 'Biryani' },
    { name: 'Chicken 65', category: 'Starter' },
    { name: 'Mutton Keema Biryani', category: 'Biryani' },
    { name: 'Prawn Biryani', category: 'Biryani' },
    { name: 'Fish Biryani', category: 'Biryani' },
    { name: 'Kadai Chicken', category: 'Curry' },
    { name: 'Butter Naan', category: 'Bread' },
    { name: 'Chicken Haleem', category: 'Specialty' },
  ],
  'Biriyani Brothers - Avadi': [
    { name: 'Chicken Biryani', category: 'Biryani' },
    { name: 'Mutton Biryani', category: 'Biryani' },
    { name: 'Egg Biryani', category: 'Biryani' },
    { name: 'Chicken Fry', category: 'Dry' },
    { name: 'Parotta', category: 'Main' },
    { name: 'Mutton Chops', category: 'Grill' },
    { name: 'Fish Fry', category: 'Starter' },
    { name: 'Veg Biryani', category: 'Biryani' },
    { name: 'Chicken Lollipop', category: 'Starter' },
    { name: 'Gravy Options', category: 'Curry' },
  ],
  'The Pasta Pot - Avadi': [
    { name: 'Aglio Olio Pasta', category: 'Pasta' },
    { name: 'Red Sauce Pasta', category: 'Pasta' },
    { name: 'White Sauce Pasta', category: 'Pasta' },
    { name: 'Penne Arrabiata', category: 'Pasta' },
    { name: 'Chicken Pasta', category: 'Pasta' },
    { name: 'Veg Lasagna', category: 'Pasta' },
    { name: 'Cheese Pasta', category: 'Pasta' },
    { name: 'Spaghetti', category: 'Pasta' },
    { name: 'Mushroom Pasta', category: 'Pasta' },
    { name: 'Italian Bread', category: 'Side' },
  ],
  'Hotel Pandian - Avadi': [
    { name: 'Chettinad Meals', category: 'Lunch' },
    { name: 'Chicken Biryani', category: 'Biryani' },
    { name: 'Dosa', category: 'Breakfast' },
    { name: 'Idli', category: 'Breakfast' },
    { name: 'Parotta', category: 'Main' },
    { name: 'Mutton Curry', category: 'Curry' },
    { name: 'Chicken 65', category: 'Starter' },
    { name: 'Vadai', category: 'Appetizer' },
    { name: 'Pongal', category: 'Breakfast' },
    { name: 'Filter Coffee', category: 'Beverage' },
  ],
  'Behrouz Biryani - Avadi': [
    { name: 'Chicken Dum Biryani', category: 'Biryani' },
    { name: 'Mutton Dum Biryani', category: 'Biryani' },
    { name: 'Veg Dum Biryani', category: 'Biryani' },
    { name: 'Chicken Kalimirch Biryani', category: 'Biryani' },
    { name: 'Mutton Afghani Biryani', category: 'Biryani' },
    { name: 'Egg Biryani', category: 'Biryani' },
    { name: 'Raita', category: 'Side' },
    { name: 'Salan', category: 'Side' },
    { name: 'Lukmi', category: 'Side' },
    { name: 'Mirchi Ka Salan', category: 'Side' },
  ],
  'Kuppusamy Chettinadu Mess - Avadi': [
    { name: 'Chettinad Chicken Biryani', category: 'Biryani' },
    { name: 'Mutton Varuval', category: 'Dry' },
    { name: 'Prawn Fry', category: 'Starter' },
    { name: 'Crab Masala', category: 'Seafood' },
    { name: 'South Indian Meals', category: 'Lunch' },
    { name: 'Dosa', category: 'Breakfast' },
    { name: 'Idiyappam', category: 'Main' },
    { name: 'Seafood Curry', category: 'Curry' },
    { name: 'North Indian Thali', category: 'Lunch' },
    { name: 'Chicken Chettinad', category: 'Curry' },
  ],
  'Mulberry Tea Shop - Avadi': [
    { name: 'Masala Tea', category: 'Beverage' },
    { name: 'Filter Coffee', category: 'Beverage' },
    { name: 'Rose Milk', category: 'Beverage' },
    { name: 'Bun Omlette', category: 'Snack' },
    { name: 'Vada', category: 'Breakfast' },
    { name: 'Samosa', category: 'Snack' },
    { name: 'Pani Puri', category: 'Snack' },
    { name: 'Sandwich', category: 'Snack' },
    { name: 'Puffs', category: 'Pastry' },
    { name: 'Maggi', category: 'Snack' },
  ],
  'Rajan Tea Stall - Poompozhil Nagar': [
    { name: 'Masala Chai', category: 'Beverage' },
    { name: 'Sulaimani Tea', category: 'Beverage' },
    { name: 'Vada', category: 'Snack' },
    { name: 'Biscuits', category: 'Snack' },
    { name: 'Bun', category: 'Snack' },
    { name: 'Omlette', category: 'Snack' },
    { name: 'Puffs', category: 'Snack' },
    { name: 'Samosa', category: 'Snack' },
    { name: 'Filter Coffee', category: 'Beverage' },
    { name: 'Lemon Tea', category: 'Beverage' },
  ],
  'Stepup Constructions Tea - CTH Road': [
    { name: 'Masala Tea', category: 'Beverage' },
    { name: 'Black Tea', category: 'Beverage' },
    { name: 'Vada Pav', category: 'Snack' },
    { name: 'Samosa', category: 'Snack' },
    { name: 'Bhaji', category: 'Snack' },
    { name: 'Omlette', category: 'Snack' },
    { name: 'Pakoda', category: 'Snack' },
    { name: 'Bun Butter', category: 'Snack' },
    { name: 'Coffee', category: 'Beverage' },
    { name: 'Milk Tea', category: 'Beverage' },
  ],
  'Rose Milk Tea And Juice Shop - Avadi': [
    { name: 'Rose Milk', category: 'Beverage' },
    { name: 'Fresh Juice', category: 'Beverage' },
    { name: 'Lassi', category: 'Beverage' },
    { name: 'Masala Tea', category: 'Beverage' },
    { name: 'Badam Milk', category: 'Beverage' },
    { name: 'Fruit Salad', category: 'Snack' },
    { name: 'Sandwich', category: 'Snack' },
    { name: 'Vada', category: 'Snack' },
    { name: 'Puffs', category: 'Snack' },
    { name: 'Cool Drinks', category: 'Beverage' },
  ],
  'Tea Time - Avadi': [
    { name: 'Green Tea', category: 'Beverage' },
    { name: 'Herbal Tea', category: 'Beverage' },
    { name: 'Masala Chai', category: 'Beverage' },
    { name: 'Cookies', category: 'Snack' },
    { name: 'Rusk', category: 'Snack' },
    { name: 'Sandwich', category: 'Snack' },
    { name: 'Maggi', category: 'Snack' },
    { name: 'Toasts', category: 'Snack' },
    { name: 'Coffee', category: 'Beverage' },
    { name: 'Lemon Tea', category: 'Beverage' },
  ],
  'En-Chai Bar - Periyar Nagar': [
    { name: 'Masala Chai', category: 'Beverage' },
    { name: 'Adrak Chai', category: 'Beverage' },
    { name: 'Elixir Tea', category: 'Beverage' },
    { name: 'Vada', category: 'Snack' },
    { name: 'Sandwich', category: 'Snack' },
    { name: 'Pakoda', category: 'Snack' },
    { name: 'Bhaji', category: 'Snack' },
    { name: 'Omlette Pav', category: 'Snack' },
    { name: 'Puffs', category: 'Snack' },
    { name: 'Samosa', category: 'Snack' },
  ],
  'Single Tea For Siva - Avadi Paruthippattu': [
    { name: 'Single Tea', category: 'Beverage' },
    { name: 'Masala Tea', category: 'Beverage' },
    { name: 'Coffee', category: 'Beverage' },
    { name: 'Vada', category: 'Snack' },
    { name: 'Bun', category: 'Snack' },
    { name: 'Omlette', category: 'Snack' },
    { name: 'Pakoda', category: 'Snack' },
    { name: 'Samosa', category: 'Snack' },
    { name: 'Biscuits', category: 'Snack' },
    { name: 'Puffs', category: 'Snack' },
  ],
  'Teaboy - Avadi JB Estate': [
    { name: 'Chai Latte', category: 'Beverage' },
    { name: 'Cold Brew Tea', category: 'Beverage' },
    { name: 'Masala Chai', category: 'Beverage' },
    { name: 'Sandwich', category: 'Snack' },
    { name: 'Muffin', category: 'Pastry' },
    { name: 'Cookies', category: 'Snack' },
    { name: 'Brownie', category: 'Pastry' },
    { name: 'Toast', category: 'Snack' },
    { name: 'Pasta', category: 'Snack' },
    { name: 'Maggi', category: 'Snack' },
  ],
  'SRM Hotels & Cafe - Avadi': [
    { name: 'Masala Tea', category: 'Beverage' },
    { name: 'Filter Coffee', category: 'Beverage' },
    { name: 'Dosa', category: 'Breakfast' },
    { name: 'Idli', category: 'Breakfast' },
    { name: 'Vadai', category: 'Appetizer' },
    { name: 'Parotta', category: 'Main' },
    { name: 'Biryani', category: 'Biryani' },
    { name: 'Meals', category: 'Lunch' },
    { name: 'Sandwich', category: 'Snack' },
    { name: 'Juice', category: 'Beverage' },
  ],
  'Shree Dharan Tea Stall - TNHB': [
    { name: 'Masala Tea', category: 'Beverage' },
    { name: 'Sulaimani', category: 'Beverage' },
    { name: 'Vada', category: 'Snack' },
    { name: 'Bun Omlette', category: 'Snack' },
    { name: 'Pakoda', category: 'Snack' },
    { name: 'Samosa', category: 'Snack' },
    { name: 'Puffs', category: 'Snack' },
    { name: 'Bhaji', category: 'Snack' },
    { name: 'Coffee', category: 'Beverage' },
    { name: 'Milk Tea', category: 'Beverage' },
  ],
  'Balan Tea Stall - Nehru Bazaar': [
    { name: 'Chai', category: 'Beverage' },
    { name: 'Coffee', category: 'Beverage' },
    { name: 'Vada', category: 'Snack' },
    { name: 'Samosa', category: 'Snack' },
    { name: 'Bun', category: 'Snack' },
    { name: 'Omlette', category: 'Snack' },
    { name: 'Pakoda', category: 'Snack' },
    { name: 'Puffs', category: 'Snack' },
    { name: 'Biscuits', category: 'Snack' },
    { name: 'Lemon Tea', category: 'Beverage' },
  ],
};

async function seedDishes() {
  console.log('Starting to seed dishes for Avadi restaurants...\n');

  let totalSuccess = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let restaurantsNotFound = 0;

  for (const [restaurantName, dishes] of Object.entries(restaurantDishes)) {
    // Find the restaurant
    const { data: restaurant, error: findError } = await supabase
      .from('restaurants')
      .select('id, name')
      .eq('name', restaurantName)
      .maybeSingle();

    if (!restaurant) {
      console.log(`❓ Restaurant not found: ${restaurantName}`);
      restaurantsNotFound++;
      continue;
    }

    console.log(`\n📍 ${restaurant.name}`);

    for (const dish of dishes) {
      try {
        // Check if dish already exists
        const { data: existing } = await supabase
          .from('dishes')
          .select('id')
          .eq('restaurant_id', restaurant.id)
          .eq('name', dish.name)
          .maybeSingle();

        if (existing) {
          console.log(`   ⏭️  ${dish.name} (exists)`);
          totalSkipped++;
          continue;
        }

        // Insert dish
        const { error } = await supabase
          .from('dishes')
          .insert({
            restaurant_id: restaurant.id,
            name: dish.name,
            category: dish.category,
            is_available: true,
          });

        if (error) {
          console.error(`   ❌ ${dish.name}: ${error.message}`);
          totalErrors++;
        } else {
          console.log(`   ✅ ${dish.name}`);
          totalSuccess++;
        }
      } catch (err: any) {
        console.error(`   ❌ ${dish.name}: ${err.message}`);
        totalErrors++;
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Dish seeding complete!`);
  console.log(`✅ Successfully added: ${totalSuccess}`);
  console.log(`⏭️  Skipped (already exist): ${totalSkipped}`);
  console.log(`❌ Errors: ${totalErrors}`);
  console.log(`❓ Restaurants not found: ${restaurantsNotFound}`);
  console.log(`========================================\n`);
}

seedDishes();
