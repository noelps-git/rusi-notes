import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// Helper to get database user ID from Clerk user
async function getDbUserId(supabase: any, email: string): Promise<string | null> {
  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  return dbUser?.id || null;
}

// GET /api/bucket-list - Get user's bucket list
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    const supabase = await createClient();
    const dbUserId = await getDbUserId(supabase, email || '');

    if (!dbUserId) {
      return NextResponse.json([]);
    }

    const { data: bucketList, error } = await supabase
      .from('bucket_list')
      .select(`
        id,
        note,
        is_visited,
        created_at,
        added_from_friend_id,
        restaurant:restaurants(id, name, categories, address, image_url),
        added_from_friend:users!bucket_list_added_from_friend_id_fkey(id, full_name, avatar_url)
      `)
      .eq('user_id', dbUserId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(bucketList || []);
  } catch (error) {
    console.error('Error fetching bucket list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bucket list' },
      { status: 500 }
    );
  }
}

// POST /api/bucket-list - Add restaurant to bucket list
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    const body = await req.json();
    const { restaurant_id, note, added_from_friend_id } = body;

    if (!restaurant_id) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const dbUserId = await getDbUserId(supabase, email || '');

    if (!dbUserId) {
      return NextResponse.json(
        { error: 'Please complete your profile setup first' },
        { status: 400 }
      );
    }

    // Check if already in bucket list
    const { data: existing } = await supabase
      .from('bucket_list')
      .select('id')
      .eq('user_id', dbUserId)
      .eq('restaurant_id', restaurant_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'Restaurant already in your bucket list' },
        { status: 400 }
      );
    }

    // Add to bucket list
    const { data: bucketItem, error } = await supabase
      .from('bucket_list')
      .insert({
        user_id: dbUserId,
        restaurant_id,
        note: note || null,
        added_from_friend_id: added_from_friend_id || null,
        is_visited: false,
      })
      .select(`
        id,
        note,
        is_visited,
        created_at,
        restaurant:restaurants(id, name, categories, address, image_url),
        added_from_friend:users!bucket_list_added_from_friend_id_fkey(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(bucketItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to bucket list:', error);
    return NextResponse.json(
      { error: 'Failed to add to bucket list' },
      { status: 500 }
    );
  }
}
