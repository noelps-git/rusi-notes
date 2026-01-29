import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { handle } = body;

  if (!handle) {
    return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
  }

  // Validate handle format
  const handleRegex = /^[a-z0-9_.-]{3,20}$/;
  if (!handleRegex.test(handle)) {
    return NextResponse.json({ error: 'Invalid handle format. Use only lowercase letters, numbers, dots, underscores, and hyphens.' }, { status: 400 });
  }

  const supabase = await createClient();

  // Check if handle is already taken
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('handle', handle)
    .neq('id', userId)
    .maybeSingle();

  if (existingUser) {
    return NextResponse.json({ error: 'This handle is already taken' }, { status: 400 });
  }

  // Update user's handle in Supabase
  const { data, error } = await supabase
    .from('users')
    .update({ handle })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error setting handle:', error);
    return NextResponse.json({ error: 'Failed to set handle' }, { status: 500 });
  }

  // Update Clerk user metadata with handle for middleware checks
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        handle,
        hasHandle: true,
      },
    });
  } catch (clerkError) {
    console.error('Error updating Clerk metadata:', clerkError);
    // Don't fail the request if Clerk update fails - handle is saved in DB
  }

  return NextResponse.json({ success: true, user: data });
}
