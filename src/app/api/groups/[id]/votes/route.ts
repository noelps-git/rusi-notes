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

// POST /api/groups/[id]/votes - Create a vote
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const resolvedParams = await params;
    const body = await req.json();
    const { question, options, expires_in_hours } = body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: 'Question and at least 2 options are required' },
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

    // Check if user is a member
    const { data: membership } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', resolvedParams.id)
      .eq('user_id', dbUserId)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this group' },
        { status: 403 }
      );
    }

    // Create a message for the vote
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        group_id: resolvedParams.id,
        sender_id: dbUserId,
        content: `📊 Poll: ${question}`,
        message_type: 'vote',
      })
      .select()
      .single();

    if (messageError) throw messageError;

    // Calculate expiration time
    const expiresAt = expires_in_hours
      ? new Date(Date.now() + expires_in_hours * 60 * 60 * 1000).toISOString()
      : null;

    // Format options as JSONB
    const formattedOptions = options.map((opt: string, index: number) => ({
      id: `option_${index}`,
      text: opt,
      votes: 0,
    }));

    // Create vote
    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert({
        message_id: message.id,
        question,
        options: formattedOptions,
        created_by: dbUserId,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (voteError) throw voteError;

    return NextResponse.json({
      ...vote,
      message,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating vote:', error);
    return NextResponse.json(
      { error: 'Failed to create vote' },
      { status: 500 }
    );
  }
}

// GET /api/groups/[id]/votes - Get all votes for a group
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const resolvedParams = await params;
    const supabase = await createClient();
    const dbUserId = await getDbUserId(supabase, email || '');

    if (!dbUserId) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 400 }
      );
    }

    // Check if user is a member
    const { data: membership } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', resolvedParams.id)
      .eq('user_id', dbUserId)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this group' },
        { status: 403 }
      );
    }

    // Get all votes with messages
    const { data: votes, error } = await supabase
      .from('votes')
      .select(`
        id,
        question,
        options,
        expires_at,
        created_at,
        created_by,
        message:messages(
          id,
          group_id,
          sender:users(id, full_name, avatar_url)
        )
      `)
      .eq('message.group_id', resolvedParams.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get user's responses for these votes
    const voteIds = votes?.map((v: any) => v.id) || [];
    const { data: responses } = await supabase
      .from('vote_responses')
      .select('vote_id, option_id')
      .in('vote_id', voteIds)
      .eq('user_id', dbUserId);

    const votesWithUserResponse = votes?.map((vote: any) => ({
      ...vote,
      user_response: responses?.find((r: any) => r.vote_id === vote.id)?.option_id || null,
    }));

    return NextResponse.json(votesWithUserResponse);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}
