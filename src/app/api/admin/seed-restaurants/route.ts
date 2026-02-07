import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

const avadiRestaurants = [
  {
    name: 'Dindigul Thalappakatti - Avadi',
    description: 'Famous for their signature Thalappakatti Biryani since 1957. Known for authentic Dindigul-style biryani with seeraga samba rice and tender mutton pieces.',
    categories: ['Biryani', 'South Indian', 'Non-Veg'],
    address: 'CTH Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26550505',
    price_range: '$$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Saravana Bhavan - Avadi',
    description: 'Iconic vegetarian restaurant chain serving authentic South Indian cuisine. Famous for dosas, idlis, and thalis since 1981.',
    categories: ['South Indian', 'Vegetarian', 'Pure Veg'],
    address: 'Main Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26381234',
    price_range: '$$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Anjappar Chettinad Restaurant - Avadi',
    description: 'Pioneer in Chettinad cuisine since 1964. Famous for spicy Chettinad chicken, mutton sukka, and authentic flavors from Karaikudi.',
    categories: ['Chettinad', 'Non-Veg', 'South Indian'],
    address: 'New Military Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26555678',
    price_range: '$$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Ponnusamy Hotel Elite - Avadi',
    description: 'Known for authentic Chettinad and South Indian non-veg dishes. Their chicken 65 and mutton biryani are local favorites.',
    categories: ['Chettinad', 'Biryani', 'Non-Veg'],
    address: 'Kamaraj Nagar Main Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26389012',
    price_range: '$$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Ganga Sweets & Restaurant - Avadi',
    description: 'Popular for sweets, snacks, and South Indian meals. A go-to spot for fresh sweets and quick bites.',
    categories: ['Sweets', 'South Indian', 'Vegetarian'],
    address: 'CTH Road, Near Bus Stand, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26553456',
    price_range: '$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Sharief Bhai Biryani - Avadi',
    description: 'Hyderabadi-style dum biryani specialists. Known for aromatic basmati rice biryani and spicy kebabs.',
    categories: ['Biryani', 'Mughlai', 'Non-Veg'],
    address: 'HVF Tank Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26557890',
    price_range: '$$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Sri Devi Food Court - Avadi',
    description: 'Local favorite for authentic appam with coconut milk, dosas, and home-style South Indian cooking.',
    categories: ['South Indian', 'Vegetarian', 'Tiffin'],
    address: 'Avadi Main Road, Near Railway Station, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26384567',
    price_range: '$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Classic Food - Avadi',
    description: 'Casual dining with multi-cuisine options including Indian, Chinese, and Continental dishes in a cozy atmosphere.',
    categories: ['Multi-Cuisine', 'Chinese', 'North Indian'],
    address: 'Kamaraj Nagar, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26389876',
    price_range: '$$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Junior Kuppanna - Avadi',
    description: 'Famous Kongunadu cuisine restaurant. Known for their Seeraga Samba biryani, Nattu kozhi curry, and Kongu-style dishes.',
    categories: ['Kongunadu', 'Biryani', 'Non-Veg'],
    address: 'CTH Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26556543',
    price_range: '$$',
    is_verified: true,
    images: [],
  },
  {
    name: 'A2B - Adyar Ananda Bhavan - Avadi',
    description: 'Renowned vegetarian chain serving South Indian meals, sweets, and snacks. Known for consistency and quality.',
    categories: ['South Indian', 'Vegetarian', 'Sweets'],
    address: 'Main Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26382345',
    price_range: '$$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Sangeetha Veg Restaurant - Avadi',
    description: 'Popular vegetarian restaurant serving authentic South Indian cuisine. Known for unlimited meals and filter coffee.',
    categories: ['South Indian', 'Vegetarian', 'Pure Veg'],
    address: 'Near Avadi Bus Stand, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26387654',
    price_range: '$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Ambur Star Biryani - Avadi',
    description: 'Specialists in Ambur-style biryani with aromatic short-grain rice and tender meat. A must-try for biryani lovers.',
    categories: ['Biryani', 'Non-Veg', 'South Indian'],
    address: 'HVF Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26551234',
    price_range: '$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Madras Masala - Avadi',
    description: 'Local eatery serving Chennai-style street food, dosas, and quick bites at affordable prices.',
    categories: ['Street Food', 'South Indian', 'Snacks'],
    address: 'New Military Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26559876',
    price_range: '$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Maplai Biryani House - Avadi',
    description: 'Specializing in Muslim-style Maplai biryani and non-veg dishes. Known for generous portions and authentic flavors.',
    categories: ['Biryani', 'Non-Veg', 'Mughlai'],
    address: 'Avadi Tank Road, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26554321',
    price_range: '$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Hot Chips - Avadi',
    description: 'Fast food chain popular for burgers, pizzas, fried chicken, and quick snacks at student-friendly prices.',
    categories: ['Fast Food', 'Burgers', 'Snacks'],
    address: 'CTH Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26558765',
    price_range: '$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Cream Centre - Avadi',
    description: 'Multi-cuisine vegetarian restaurant known for innovative dishes, chaats, and fusion food.',
    categories: ['Multi-Cuisine', 'Vegetarian', 'Chinese'],
    address: 'Kamaraj Nagar, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26385432',
    price_range: '$$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Sree Krishna Sweets - Avadi',
    description: 'Popular sweet shop and restaurant serving South Indian snacks, meals, and fresh sweets daily.',
    categories: ['Sweets', 'South Indian', 'Vegetarian'],
    address: 'Main Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26381098',
    price_range: '$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Barbeque Nation - Avadi',
    description: 'Live grill-on-your-table concept with unlimited starters, main course, and desserts buffet style.',
    categories: ['Barbeque', 'Buffet', 'Multi-Cuisine'],
    address: 'Near Avadi Junction, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26559999',
    price_range: '$$$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Chicking - Avadi',
    description: 'Popular fried chicken chain offering crispy chicken, burgers, and quick meals with Middle Eastern flavors.',
    categories: ['Fast Food', 'Fried Chicken', 'Burgers'],
    address: 'CTH Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26552222',
    price_range: '$',
    is_verified: true,
    images: [],
  },
  {
    name: 'Palmshore Restaurant - Avadi',
    description: 'Family restaurant serving Kerala and South Indian cuisine. Known for fish curry, appam, and seafood dishes.',
    categories: ['Kerala', 'Seafood', 'South Indian'],
    address: 'HVF Tank Road, Avadi, Chennai',
    city: 'Chennai',
    pincode: '600054',
    phone: '044-26557777',
    price_range: '$$',
    is_verified: true,
    images: [],
  },
];

// POST /api/admin/seed-restaurants - Seed Avadi restaurants
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    // Allow admin or use a secret key for seeding
    const authHeader = req.headers.get('authorization');
    const seedKey = process.env.SEED_SECRET_KEY || 'rusinotes-seed-2024';

    const isAdmin = (user?.publicMetadata as any)?.role === 'admin';
    const hasValidKey = authHeader === `Bearer ${seedKey}`;

    // Also allow seeding with query param for initial setup
    const url = new URL(req.url);
    const queryKey = url.searchParams.get('key');
    const hasQueryKey = queryKey === seedKey;

    if (!userId && !hasValidKey && !hasQueryKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isAdmin && !hasValidKey && !hasQueryKey) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const supabase = await createClient();

    const results = {
      added: [] as string[],
      skipped: [] as string[],
      errors: [] as { name: string; error: string }[],
    };

    for (const restaurant of avadiRestaurants) {
      try {
        // Check if restaurant already exists
        const { data: existing } = await supabase
          .from('restaurants')
          .select('id')
          .eq('name', restaurant.name)
          .maybeSingle();

        if (existing) {
          results.skipped.push(restaurant.name);
          continue;
        }

        // Insert restaurant
        const { error } = await supabase
          .from('restaurants')
          .insert(restaurant);

        if (error) {
          results.errors.push({ name: restaurant.name, error: error.message });
        } else {
          results.added.push(restaurant.name);
        }
      } catch (err: any) {
        results.errors.push({ name: restaurant.name, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: avadiRestaurants.length,
        added: results.added.length,
        skipped: results.skipped.length,
        errors: results.errors.length,
      },
      details: results,
    });
  } catch (error: any) {
    console.error('Error seeding restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to seed restaurants', details: error.message },
      { status: 500 }
    );
  }
}

// GET - List restaurants to be seeded
export async function GET() {
  return NextResponse.json({
    count: avadiRestaurants.length,
    restaurants: avadiRestaurants.map(r => ({
      name: r.name,
      categories: r.categories,
      address: r.address,
      price_range: r.price_range,
    })),
  });
}
