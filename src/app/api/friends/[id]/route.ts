import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { createNotification } from '@/lib/utils/notifications';

// Helper to get database user ID from Clerk user
async function getDbUserId(supabase: any, user: any): Promise<string | null> {
  const email = user?.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  return dbUser?.id || null;
}

// PUT /api/friends/[id] - Accept or reject friend request
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const body = await req.json();
    const { status } = body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "accepted" or "rejected"' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user's database ID
    const dbUserId = await getDbUserId(supabase, user);
    if (!dbUserId) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 400 }
      );
    }

    // Check if user is the recipient of this friend request
    const { data: friendship } = await supabase
      .from('friendships')
      .select('requester_id, recipient_id, status')
      .eq('id', resolvedParams.id)
      .single();

    if (!friendship) {
      return NextResponse.json(
        { error: 'Friend request not found' },
        { status: 404 }
      );
    }

    // Only the recipient can accept/reject
    if (friendship.recipient_id !== dbUserId) {
      return NextResponse.json(
        { error: 'You can only respond to friend requests sent to you' },
        { status: 403 }
      );
    }

    // Can only accept/reject pending requests
    if (friendship.status !== 'pending') {
      return NextResponse.json(
        { error: 'This friend request has already been responded to' },
        { status: 400 }
      );
    }

    // Update friendship status
    const { data: updated, error } = await supabase
      .from('friendships')
      .update({ status })
      .eq('id', resolvedParams.id)
      .select(`
        id,
        status,
        created_at,
        requester:users!friendships_requester_id_fkey(id, full_name, avatar_url),
        recipient:users!friendships_recipient_id_fkey(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    // Create notification for requester if accepted
    if (status === 'accepted') {
      await createNotification({
        user_id: friendship.requester_id,
        type: 'friend_accepted',
        title: 'Friend Request Accepted',
        message: `${user?.fullName || 'Someone'} accepted your friend request`,
        link: '/friends',
        metadata: {
          accepter_id: dbUserId,
          accepter_name: user?.fullName,
          friendship_id: updated.id,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating friend request:', error);
    return NextResponse.json(
      { error: 'Failed to update friend request' },
      { status: 500 }
    );
  }
}

// DELETE /api/friends/[id] - Remove friend or cancel request
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const supabase = await createClient();

    // Get current user's database ID
    const dbUserId = await getDbUserId(supabase, user);
    if (!dbUserId) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 400 }
      );
    }

    // Check if user is part of this friendship
    const { data: friendship } = await supabase
      .from('friendships')
      .select('requester_id, recipient_id')
      .eq('id', resolvedParams.id)
      .single();

    if (!friendship) {
      return NextResponse.json(
        { error: 'Friendship not found' },
        { status: 404 }
      );
    }

    // Only the people involved can delete the friendship
    if (
      friendship.requester_id !== dbUserId &&
      friendship.recipient_id !== dbUserId
    ) {
      return NextResponse.json(
        { error: 'You can only remove your own friendships' },
        { status: 403 }
      );
    }

    // Delete friendship
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', resolvedParams.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting friendship:', error);
    return NextResponse.json(
      { error: 'Failed to delete friendship' },
      { status: 500 }
    );
  }
}
