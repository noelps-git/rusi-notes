import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createClient } from '@/lib/supabase/server';

// GET /api/groups/[id]/messages - Get messages for group (with polling support)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const searchParams = req.nextUrl.searchParams;
    const after = searchParams.get('after'); // Timestamp for polling
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = await createClient();

    // Check if user is a member
    const { data: membership } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', resolvedParams.id)
      .eq('user_id', session.user.id)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this group' },
        { status: 403 }
      );
    }

    // Build query
    let query = supabase
      .from('messages')
      .select(`
        id,
        content,
        message_type,
        metadata,
        created_at,
        sender:users!messages_sender_id_fkey(id, full_name, avatar_url)
      `)
      .eq('group_id', resolvedParams.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    // For polling: only get messages after a certain timestamp
    if (after) {
      query = query.gt('created_at', after);
    }

    const { data: messages, error } = await query;

    if (error) throw error;

    // Return in chronological order (oldest first)
    return NextResponse.json(messages?.reverse() || []);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/groups/[id]/messages - Send message to group
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const body = await req.json();
    const { content, message_type, metadata } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if user is a member
    const { data: membership } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', resolvedParams.id)
      .eq('user_id', session.user.id)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this group' },
        { status: 403 }
      );
    }

    // Create message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        group_id: resolvedParams.id,
        sender_id: session.user.id,
        content: content.trim(),
        message_type: message_type || 'text',
        metadata: metadata || null,
      })
      .select(`
        id,
        content,
        message_type,
        metadata,
        created_at,
        sender:users!messages_sender_id_fkey(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    // TODO: Create notifications for other group members

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
