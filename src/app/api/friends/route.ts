import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { createNotification } from '@/lib/utils/notifications';

// GET /api/friends - Get all friends and requests
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status'); // 'pending', 'accepted', 'rejected'
    const type = searchParams.get('type'); // 'sent', 'received'

    const supabase = await createClient();

    // Get current user's database ID by email
    const email = user?.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json([]);
    }

    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!dbUser) {
      return NextResponse.json([]);
    }

    const dbUserId = dbUser.id;

    let query = supabase
      .from('friendships')
      .select(`
        id,
        status,
        created_at,
        requester:users!friendships_requester_id_fkey(id, full_name, avatar_url, email),
        recipient:users!friendships_recipient_id_fkey(id, full_name, avatar_url, email)
      `);

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by type (sent or received)
    if (type === 'sent') {
      query = query.eq('requester_id', dbUserId);
    } else if (type === 'received') {
      query = query.eq('recipient_id', dbUserId);
    } else {
      // Get all friendships where user is either requester or recipient
      query = query.or(`requester_id.eq.${dbUserId},recipient_id.eq.${dbUserId}`);
    }

    query = query.order('created_at', { ascending: false });

    const { data: friendships, error } = await query;

    if (error) throw error;

    return NextResponse.json(friendships || []);
  } catch (error) {
    console.error('Error fetching friendships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friendships' },
      { status: 500 }
    );
  }
}

// POST /api/friends - Send friend request
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { recipient_id } = body;

    if (!recipient_id) {
      return NextResponse.json(
        { error: 'Recipient ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user's database ID by email
    const email = user?.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User profile not found. Please complete onboarding.' },
        { status: 400 }
      );
    }

    const requesterId = dbUser.id;

    // Can't send friend request to yourself
    if (recipient_id === requesterId) {
      return NextResponse.json(
        { error: 'You cannot send a friend request to yourself' },
        { status: 400 }
      );
    }

    // Check if friendship already exists
    const { data: existing } = await supabase
      .from('friendships')
      .select('id, status')
      .or(`and(requester_id.eq.${requesterId},recipient_id.eq.${recipient_id}),and(requester_id.eq.${recipient_id},recipient_id.eq.${requesterId})`)
      .maybeSingle();

    if (existing) {
      if (existing.status === 'pending') {
        return NextResponse.json(
          { error: 'Friend request already sent' },
          { status: 400 }
        );
      } else if (existing.status === 'accepted') {
        return NextResponse.json(
          { error: 'You are already friends' },
          { status: 400 }
        );
      }
    }

    // Create friend request
    const { data: friendship, error } = await supabase
      .from('friendships')
      .insert({
        requester_id: requesterId,
        recipient_id: recipient_id,
        status: 'pending',
      })
      .select(`
        id,
        status,
        created_at,
        requester:users!friendships_requester_id_fkey(id, full_name, avatar_url),
        recipient:users!friendships_recipient_id_fkey(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    // Create notification for recipient
    await createNotification({
      user_id: recipient_id,
      type: 'friend_request',
      title: 'New Friend Request',
      message: `${user?.fullName || 'Someone'} sent you a friend request`,
      link: '/friends',
      metadata: {
        requester_id: requesterId,
        requester_name: user?.fullName,
        friendship_id: friendship.id,
      },
    });

    return NextResponse.json(friendship, { status: 201 });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json(
      { error: 'Failed to send friend request' },
      { status: 500 }
    );
  }
}
