import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { createNotification } from '@/lib/utils/notifications';

// GET /api/notes - List all tasting notes
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const restaurantId = searchParams.get('restaurantId');
    const limit = parseInt(searchParams.get('limit') || '20');

    const supabase = await createClient();
    let query = supabase
      .from('tasting_notes')
      .select(`
        *,
        user:users(id, full_name, avatar_url),
        restaurant:restaurants(id, name, categories)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId);
    }

    const { data: notes, error } = await query;

    if (error) throw error;

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasting notes' },
      { status: 500 }
    );
  }
}

// POST /api/notes - Create new tasting note
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Get user email from Clerk
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: 'No email found for user' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      restaurant_id,
      dish_id,
      title,
      content,
      rating,
      images,
      tags,
      is_public,
    } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Look up the database user by email
    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!dbUser) {
      return NextResponse.json(
        { error: 'Please complete your profile setup first' },
        { status: 400 }
      );
    }

    // Create tasting note with database user ID
    const { data: note, error } = await supabase
      .from('tasting_notes')
      .insert({
        user_id: dbUser.id,
        restaurant_id,
        dish_id,
        title,
        content,
        rating,
        images: images || [],
        tags: tags || [],
        is_public: is_public !== undefined ? is_public : true,
      })
      .select(`
        *,
        user:users(id, full_name, avatar_url),
        restaurant:restaurants(id, name, categories)
      `)
      .single();

    if (error) throw error;

    // Notify all friends about the new review (if public)
    if (is_public !== false && note.restaurant) {
      try {
        // Get all accepted friendships where user is either requester or recipient
        const { data: friendships } = await supabase
          .from('friendships')
          .select('requester_id, recipient_id')
          .eq('status', 'accepted')
          .or(`requester_id.eq.${dbUser.id},recipient_id.eq.${dbUser.id}`);

        if (friendships && friendships.length > 0) {
          // Get friend IDs (the other person in each friendship)
          const friendIds = friendships.map((f: any) =>
            f.requester_id === dbUser.id ? f.recipient_id : f.requester_id
          );

          // Create notifications for all friends
          const notificationPromises = friendIds.map((friendId: string) =>
            createNotification({
              user_id: friendId,
              type: 'friend_review',
              title: 'New Review from Friend',
              message: `${user?.fullName || 'Your friend'} reviewed ${note.restaurant?.name || 'a restaurant'}`,
              link: `/notes/${note.id}`,
              metadata: {
                reviewer_id: dbUser.id,
                reviewer_name: user?.fullName,
                reviewer_avatar: user?.imageUrl,
                note_id: note.id,
                note_title: note.title,
                note_rating: note.rating,
                restaurant_id: note.restaurant?.id,
                restaurant_name: note.restaurant?.name,
              },
            })
          );

          // Fire and forget - don't wait for notifications to complete
          Promise.all(notificationPromises).catch((err) =>
            console.error('Error sending friend notifications:', err)
          );
        }
      } catch (notifyError) {
        // Don't fail the note creation if notifications fail
        console.error('Error notifying friends:', notifyError);
      }
    }

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create tasting note' },
      { status: 500 }
    );
  }
}
