import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// Helper to get database user ID from Clerk user
async function getDbUserId(supabase: any, email: string) {
  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  return dbUser?.id;
}

// GET /api/notifications - Get user's notifications
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    const searchParams = req.nextUrl.searchParams;
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = await createClient();
    const dbUserId = await getDbUserId(supabase, email || '');

    if (!dbUserId) {
      // Return empty array if user not in database yet
      return NextResponse.json([]);
    }

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', dbUserId)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filter by unread if requested
    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data: notifications, error } = await query;

    if (error) throw error;

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create notification
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { user_id, type, title, message, link, metadata } = body;

    // Validate required fields
    if (!user_id || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, type, title, message' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create notification
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id,
        type,
        title,
        message,
        link: link || null,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications/read-all - Mark all as read
export async function PUT(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
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
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', dbUserId)
      .eq('is_read', false);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking all as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark all as read' },
      { status: 500 }
    );
  }
}
