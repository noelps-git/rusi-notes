import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/restaurants/suggest - User suggests a new restaurant
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json(
        { error: 'Please sign in to add a restaurant' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, address, city, categories, description } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Restaurant name is required' },
        { status: 400 }
      );
    }

    if (!address || !address.trim()) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    if (!categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'At least one category is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if restaurant already exists
    const { data: existing } = await supabase
      .from('restaurants')
      .select('id, name')
      .ilike('name', name.trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'A restaurant with this name already exists', existingId: existing.id },
        { status: 409 }
      );
    }

    // Get user's database ID
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    let dbUserId = null;

    if (userEmail) {
      const { data: dbUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userEmail)
        .maybeSingle();

      dbUserId = dbUser?.id;
    }

    // Insert new restaurant (unverified by default - user submitted)
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .insert({
        name: name.trim(),
        address: address.trim(),
        city: city?.trim() || 'Chennai',
        categories: categories,
        description: description?.trim() || `User-submitted restaurant in ${city || 'Chennai'}`,
        is_verified: false, // User-submitted restaurants are unverified
        price_range: '$$',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating restaurant:', error);
      return NextResponse.json(
        { error: 'Failed to add restaurant' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        categories: restaurant.categories,
      },
      message: 'Restaurant added successfully! It will be verified by our team.',
    });
  } catch (error: any) {
    console.error('Error in suggest restaurant:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
