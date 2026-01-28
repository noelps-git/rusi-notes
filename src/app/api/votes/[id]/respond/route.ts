import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/votes/[id]/respond - Submit or change vote response
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
    const { option_id } = body;

    if (!option_id) {
      return NextResponse.json(
        { error: 'Option ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get vote details
    const { data: vote } = await supabase
      .from('votes')
      .select(`
        id,
        options,
        expires_at,
        message:messages(
          group_id,
          group:groups(id)
        )
      `)
      .eq('id', resolvedParams.id)
      .single();

    if (!vote) {
      return NextResponse.json(
        { error: 'Vote not found' },
        { status: 404 }
      );
    }

    // Check if vote has expired
    if (vote.expires_at && new Date(vote.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This vote has expired' },
        { status: 400 }
      );
    }

    // Verify option exists
    const options = vote.options as any[];
    const optionExists = options.some((opt: any) => opt.id === option_id);
    if (!optionExists) {
      return NextResponse.json(
        { error: 'Invalid option ID' },
        { status: 400 }
      );
    }

    // Check if user already voted
    const { data: existingResponse } = await supabase
      .from('vote_responses')
      .select('id, option_id')
      .eq('vote_id', resolvedParams.id)
      .eq('user_id', session.user.id)
      .single();

    if (existingResponse) {
      // Update existing response
      const { error: updateError } = await supabase
        .from('vote_responses')
        .update({ option_id })
        .eq('id', existingResponse.id);

      if (updateError) throw updateError;

      return NextResponse.json({
        message: 'Vote updated',
        previous_option: existingResponse.option_id,
        new_option: option_id,
      });
    } else {
      // Create new response
      const { error: insertError } = await supabase
        .from('vote_responses')
        .insert({
          vote_id: resolvedParams.id,
          user_id: session.user.id,
          option_id,
        });

      if (insertError) throw insertError;

      return NextResponse.json({
        message: 'Vote submitted',
        option_id,
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    );
  }
}

// GET /api/votes/[id]/respond - Get vote results
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
    const supabase = await createClient();

    // Get vote details
    const { data: vote } = await supabase
      .from('votes')
      .select('id, question, options, expires_at, created_at')
      .eq('id', resolvedParams.id)
      .single();

    if (!vote) {
      return NextResponse.json(
        { error: 'Vote not found' },
        { status: 404 }
      );
    }

    // Get all responses
    const { data: responses } = await supabase
      .from('vote_responses')
      .select('option_id, user_id')
      .eq('vote_id', resolvedParams.id);

    // Count votes for each option
    const options = vote.options as any[];
    const results = options.map((option: any) => ({
      ...option,
      votes: responses?.filter((r: any) => r.option_id === option.id).length || 0,
    }));

    const totalVotes = responses?.length || 0;

    return NextResponse.json({
      ...vote,
      results,
      total_votes: totalVotes,
    });
  } catch (error) {
    console.error('Error fetching vote results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vote results' },
      { status: 500 }
    );
  }
}
