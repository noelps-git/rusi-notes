import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/restaurants - List all restaurants with optional filters
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const area = searchParams.get('area');
    const search = searchParams.get('search');
    const dietary = searchParams.get('dietary');
    const includeAll = searchParams.get('includeAll') === 'true'; // Include unverified for review form

    const supabase = await createClient();
    let query = supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false });

    // By default, only show verified restaurants unless includeAll is true
    if (!includeAll) {
      query = query.eq('is_verified', true);
    }

    // Apply filters
    if (category) {
      query = query.contains('categories', [category]);
    }

    if (area) {
      query = query.ilike('address', `%${area}%`);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: restaurants, error } = await query;

    if (error) throw error;

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}

// POST /api/restaurants - Create new restaurant (business users only)
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || (user?.publicMetadata as any)?.role !== 'business') {
      return NextResponse.json(
        { error: 'Unauthorized. Business account required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      description,
      categories,
      address,
      city,
      pincode,
      phone,
      email,
      website_url,
      website,
      price_range,
      opening_hours,
      gst_number,
    } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Restaurant name is required' },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one category' },
        { status: 400 }
      );
    }

    if (!address || !address.trim()) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!gst_number || !gst_number.trim()) {
      return NextResponse.json(
        { error: 'GST number is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create restaurant
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .insert({
        owner_id: userId,
        name,
        description,
        categories,
        address,
        city: city || 'Chennai',
        pincode,
        phone,
        email,
        website_url: website_url || website,
        price_range,
        opening_hours,
        gst_number,
        is_verified: false, // Needs admin approval
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    );
  }
}
