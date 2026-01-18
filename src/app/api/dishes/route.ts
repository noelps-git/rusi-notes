import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createClient } from '@/lib/supabase/server';

// GET /api/dishes - Get dishes for a restaurant
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const restaurantId = searchParams.get('restaurant_id');

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: dishes, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dishes' },
      { status: 500 }
    );
  }
}

// POST /api/dishes - Create new dish (business users only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'business') {
      return NextResponse.json(
        { error: 'Unauthorized. Business account required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      restaurant_id,
      name,
      description,
      price,
      category,
      is_vegetarian,
      is_vegan,
      is_gluten_free,
      is_halal,
      is_jain,
      allergens,
      is_available,
      image_url,
    } = body;

    // Validate required fields
    if (!restaurant_id || !name) {
      return NextResponse.json(
        { error: 'Restaurant ID and name are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify restaurant ownership
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id')
      .eq('id', restaurant_id)
      .eq('owner_id', session.user.id)
      .single();

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found or unauthorized' },
        { status: 404 }
      );
    }

    // Create dish
    const { data: dish, error } = await supabase
      .from('dishes')
      .insert({
        restaurant_id,
        name,
        description: description || null,
        price: price || null,
        category: category || null,
        is_vegetarian: is_vegetarian || false,
        is_vegan: is_vegan || false,
        is_gluten_free: is_gluten_free || false,
        is_halal: is_halal || false,
        is_jain: is_jain || false,
        allergens: allergens || [],
        is_available: is_available !== undefined ? is_available : true,
        image_url: image_url || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error('Error creating dish:', error);
    return NextResponse.json(
      { error: 'Failed to create dish' },
      { status: 500 }
    );
  }
}
