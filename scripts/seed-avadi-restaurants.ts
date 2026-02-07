// Script to seed Avadi restaurants into the database
// Run with: npx tsx scripts/seed-avadi-restaurants.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Valid categories: south_indian, north_indian, chinese, continental, fast_food, bakery, cafe, street_food, biryani, chettinad, seafood, desserts
const avadiRestaurants = [
  {
    name: 'Dindigul Thalappakatti - Avadi',
    description: 'Famous for their signature Thalappakatti Biryani since 1957. Known for authentic Dindigul-style biryani with seeraga samba rice and tender mutton pieces.',
    categories: ['biryani', 'south_indian'],
    address: 'CTH Road, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26550505',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'Saravana Bhavan - Avadi',
    description: 'Iconic vegetarian restaurant chain serving authentic South Indian cuisine. Famous for dosas, idlis, and thalis since 1981.',
    categories: ['south_indian'],
    address: 'Main Road, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26381234',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'Anjappar Chettinad Restaurant - Avadi',
    description: 'Pioneer in Chettinad cuisine since 1964. Famous for spicy Chettinad chicken, mutton sukka, and authentic flavors from Karaikudi.',
    categories: ['chettinad', 'south_indian'],
    address: 'New Military Road, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26555678',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'Ponnusamy Hotel Elite - Avadi',
    description: 'Known for authentic Chettinad and South Indian non-veg dishes. Their chicken 65 and mutton biryani are local favorites.',
    categories: ['chettinad', 'biryani'],
    address: 'Kamaraj Nagar Main Road, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26389012',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'Ganga Sweets & Restaurant - Avadi',
    description: 'Popular for sweets, snacks, and South Indian meals. A go-to spot for fresh sweets and quick bites.',
    categories: ['desserts', 'south_indian'],
    address: 'CTH Road, Near Bus Stand, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26553456',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Sharief Bhai Biryani - Avadi',
    description: 'Hyderabadi-style dum biryani specialists. Known for aromatic basmati rice biryani and spicy kebabs.',
    categories: ['biryani', 'north_indian'],
    address: 'HVF Tank Road, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26557890',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'Sri Devi Food Court - Avadi',
    description: 'Local favorite for authentic appam with coconut milk, dosas, and home-style South Indian cooking.',
    categories: ['south_indian'],
    address: 'Avadi Main Road, Near Railway Station',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26384567',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Classic Food - Avadi',
    description: 'Casual dining with multi-cuisine options including Indian, Chinese, and Continental dishes in a cozy atmosphere.',
    categories: ['chinese', 'north_indian', 'continental'],
    address: 'Kamaraj Nagar, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26389876',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'Junior Kuppanna - Avadi',
    description: 'Famous Kongunadu cuisine restaurant. Known for their Seeraga Samba biryani, Nattu kozhi curry, and Kongu-style dishes.',
    categories: ['biryani', 'south_indian'],
    address: 'CTH Road, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26556543',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'A2B - Adyar Ananda Bhavan - Avadi',
    description: 'Renowned vegetarian chain serving South Indian meals, sweets, and snacks. Known for consistency and quality.',
    categories: ['south_indian', 'desserts'],
    address: 'Main Road, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26382345',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'Sangeetha Veg Restaurant - Avadi',
    description: 'Popular vegetarian restaurant serving authentic South Indian cuisine. Known for unlimited meals and filter coffee.',
    categories: ['south_indian'],
    address: 'Near Avadi Bus Stand',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26387654',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Ambur Star Biryani - Avadi',
    description: 'Specialists in Ambur-style biryani with aromatic short-grain rice and tender meat. A must-try for biryani lovers.',
    categories: ['biryani', 'south_indian'],
    address: 'HVF Road, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26551234',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Madras Masala - Avadi',
    description: 'Local eatery serving Chennai-style street food, dosas, and quick bites at affordable prices.',
    categories: ['street_food', 'south_indian'],
    address: 'New Military Road, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26559876',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Maplai Biryani House - Avadi',
    description: 'Specializing in Muslim-style Maplai biryani and non-veg dishes. Known for generous portions and authentic flavors.',
    categories: ['biryani', 'north_indian'],
    address: 'Avadi Tank Road',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26554321',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Hot Chips - Avadi',
    description: 'Fast food chain popular for burgers, pizzas, fried chicken, and quick snacks at student-friendly prices.',
    categories: ['fast_food'],
    address: 'CTH Road, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26558765',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Cream Centre - Avadi',
    description: 'Multi-cuisine vegetarian restaurant known for innovative dishes, chaats, and fusion food.',
    categories: ['chinese', 'north_indian'],
    address: 'Kamaraj Nagar, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26385432',
    price_range: '$$',
    is_verified: true,
  },
  {
    name: 'Sree Krishna Sweets - Avadi',
    description: 'Popular sweet shop and restaurant serving South Indian snacks, meals, and fresh sweets daily.',
    categories: ['desserts', 'south_indian'],
    address: 'Main Road, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26381098',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Barbeque Nation - Avadi',
    description: 'Live grill-on-your-table concept with unlimited starters, main course, and desserts buffet style.',
    categories: ['north_indian', 'continental'],
    address: 'Near Avadi Junction',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26559999',
    price_range: '$$$',
    is_verified: true,
  },
  {
    name: 'Chicking - Avadi',
    description: 'Popular fried chicken chain offering crispy chicken, burgers, and quick meals with Middle Eastern flavors.',
    categories: ['fast_food'],
    address: 'CTH Road, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26552222',
    price_range: '$',
    is_verified: true,
  },
  {
    name: 'Palmshore Restaurant - Avadi',
    description: 'Family restaurant serving Kerala and South Indian cuisine. Known for fish curry, appam, and seafood dishes.',
    categories: ['seafood', 'south_indian'],
    address: 'HVF Tank Road, Avadi',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26557777',
    price_range: '$$',
    is_verified: true,
  },
];

async function seedRestaurants() {
  console.log('Starting to seed Avadi restaurants...\n');

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const restaurant of avadiRestaurants) {
    try {
      // Check if restaurant already exists
      const { data: existing } = await supabase
        .from('restaurants')
        .select('id')
        .eq('name', restaurant.name)
        .single();

      if (existing) {
        console.log(`⏭️  Skipped (exists): ${restaurant.name}`);
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
