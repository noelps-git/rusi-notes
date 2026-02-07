// Script to seed additional Avadi restaurants/cafes into the database
// Run with: npx tsx scripts/seed-avadi-restaurants-batch2.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Valid categories: south_indian, north_indian, chinese, continental, fast_food, bakery, cafe, street_food, biryani, chettinad, seafood, desserts
const newEstablishments = [
  // Restaurants
  {
    name: 'Bagheera Multi Cuisine Restaurant - Avadi',
    description: 'Multi-cuisine restaurant offering a variety of Indian, Chinese, and Continental dishes in a comfortable setting.',
    categories: ['chinese', 'north_indian', 'continental'],
    address: 'Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'Ayyar Bhavan - Avadi',
    description: 'Traditional South Indian vegetarian restaurant known for authentic home-style cooking and filter coffee.',
    categories: ['south_indian'],
    address: 'Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: "Domino's Pizza - Avadi",
    description: 'Popular pizza chain offering a wide variety of pizzas, sides, and desserts with quick delivery.',
    categories: ['fast_food'],
    address: 'Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'Boozo the Kulfi Laboratory - Avadi',
    description: 'Unique dessert spot specializing in creative kulfi flavors and ice cream innovations.',
    categories: ['desserts'],
    address: 'Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Nostra Suvai - Avadi',
    description: 'Local restaurant serving tasty South Indian cuisine with a focus on authentic flavors.',
    categories: ['south_indian'],
    address: 'Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Elite Restaurant - Avadi',
    description: 'Family dining restaurant offering South Indian meals and snacks in a comfortable atmosphere.',
    categories: ['south_indian'],
    address: 'Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Nandavanam Mess - Avadi',
    description: 'Traditional mess-style restaurant serving unlimited South Indian meals at affordable prices.',
    categories: ['south_indian'],
    address: 'Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Ayyaar Bawan Sweets & Restaurant - Avadi Paruthipet',
    description: 'Popular sweet shop and restaurant serving South Indian snacks, meals, and fresh sweets.',
    categories: ['south_indian', 'desserts'],
    address: 'Avadi Paruthipet, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'SS Hyderabad Biryani - Avadi HVF Road',
    description: 'Authentic Hyderabadi-style dum biryani specialists known for flavorful rice and tender meat.',
    categories: ['biryani', 'north_indian'],
    address: 'HVF Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'Biriyani Brothers - Avadi',
    description: 'Biryani-focused restaurant offering various styles of biryani and kebabs.',
    categories: ['biryani'],
    address: 'Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'The Pasta Pot - Avadi',
    description: 'Casual dining spot specializing in pasta dishes and Continental cuisine.',
    categories: ['continental'],
    address: 'Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'Dindigul Thalappakatti - Ambattur',
    description: 'Famous for their signature Thalappakatti Biryani since 1957. Known for authentic Dindigul-style biryani.',
    categories: ['biryani', 'south_indian'],
    address: 'Ambattur, Chennai',
    city: 'Chennai',
    pincode: '600053',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'SS Hyderabad Biryani - Avadi NM Road',
    description: 'Authentic Hyderabadi-style dum biryani specialists with aromatic spices and tender meat.',
    categories: ['biryani', 'north_indian'],
    address: 'New Military Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'Hotel Pandian - Avadi',
    description: 'Traditional South Indian restaurant serving authentic meals and tiffin items.',
    categories: ['south_indian'],
    address: 'Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Behrouz Biryani - Avadi',
    description: 'Premium biryani delivery brand known for Persian-inspired Dum Biryani and kebabs.',
    categories: ['biryani', 'north_indian'],
    address: 'Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$$$',
    is_verified: true,
  },
  {
    name: 'Kuppusamy Chettinadu Mess - Avadi',
    description: 'Authentic Chettinad mess serving traditional non-veg dishes with bold spices and flavors.',
    categories: ['chettinad', 'south_indian'],
    address: 'Near Avadi Fire Station, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  // Tea Shops / Cafes
  {
    name: 'Mulberry Tea Shop - Avadi',
    description: 'Cozy tea shop serving hot chai, coffee, and light snacks in Bishop Lane.',
    categories: ['cafe'],
    address: 'Bishop Lane, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Rajan Tea Stall - Poompozhil Nagar',
    description: 'Popular local tea stall known for strong filter coffee and tea.',
    categories: ['cafe'],
    address: 'Poompozhil Nagar, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Stepup Constructions Tea - CTH Road',
    description: 'Roadside tea shop serving fresh chai and snacks to morning commuters.',
    categories: ['cafe'],
    address: 'CTH Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Rose Milk Tea And Juice Shop - Avadi',
    description: 'Refreshing beverage shop known for rose milk, fresh juices, and milkshakes.',
    categories: ['cafe'],
    address: 'Mariamman Koil Street, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Tea Time - Avadi',
    description: 'Quick-service tea shop offering various chai varieties and evening snacks.',
    categories: ['cafe'],
    address: 'New Military Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'En-Chai Bar - Periyar Nagar',
    description: 'Modern tea bar concept serving specialty chai blends and quick bites.',
    categories: ['cafe'],
    address: 'Periyar Nagar, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Single Tea For Siva - Avadi Paruthippattu',
    description: 'Popular neighborhood tea stall with loyal local following.',
    categories: ['cafe'],
    address: 'Avadi Paruthippattu, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Teaboy - Avadi JB Estate',
    description: 'Tea chain outlet serving signature tea varieties and light snacks.',
    categories: ['cafe'],
    address: 'Poonamalle High Road, JB Estate, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'SRM Hotels & Cafe - Avadi',
    description: 'Cafe serving tea, coffee, and South Indian snacks in Sriram Samaj Nagar.',
    categories: ['cafe', 'south_indian'],
    address: 'Sriram Samaj Nagar, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Shree Dharan Tea Stall - TNHB',
    description: 'Neighborhood tea stall in TNHB MIG V Block known for evening chai.',
    categories: ['cafe'],
    address: 'TNHB MIG V Block, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Balan Tea Stall - Nehru Bazaar',
    description: 'Classic tea stall in Nehru Bazaar serving hot beverages and snacks.',
    categories: ['cafe'],
    address: 'Nehru Bazaar, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    price_range: '$',
    is_verified: true,
  },
];

async function seedRestaurants() {
  console.log('Starting to seed additional Avadi establishments...\n');

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const restaurant of newEstablishments) {
    try {
      // Check if restaurant already exists (by name similarity)
      const { data: existing } = await supabase
        .from('restaurants')
        .select('id, name')
        .ilike('name', `%${restaurant.name.split(' - ')[0]}%`)
        .maybeSingle();

      if (existing) {
        console.log(`⏭️  Skipped (similar exists): ${restaurant.name} -> ${existing.name}`);
        skipCount++;
        continue;
      }

      // Insert restaurant
      const { data, error } = await supabase
        .from('restaurants')
        .insert(restaurant)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error adding ${restaurant.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Added: ${restaurant.name}`);
        successCount++;
      }
    } catch (err: any) {
      console.error(`❌ Error adding ${restaurant.name}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Seeding complete!`);
  console.log(`✅ Successfully added: ${successCount}`);
  console.log(`⏭️  Skipped (already exist): ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`========================================\n`);
}

seedRestaurants();
