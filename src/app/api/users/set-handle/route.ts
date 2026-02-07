import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
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
    return NextResponse.json({ error: 'Invalid handle format' }, { status: 400 });
  }

  // Get user info from Clerk
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: 'No email found' }, { status: 400 });
  }

  const supabase = await createClient();

  // Check if handle is already taken
  const { data: handleTaken } = await supabase
    .from('users')
    .select('id')
    .eq('handle', handle)
    .maybeSingle();

  if (handleTaken) {
    return NextResponse.json({ error: 'Handle already taken' }, { status: 400 });
  }

  // Check if user exists by email
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, clerk_id')
    .eq('email', email)
    .maybeSingle();

  let error;

  if (existingUser) {
    // Update existing user's handle and clerk_id
    const result = await supabase
      .from('users')
      .update({
        handle,
        clerk_id: userId,
        full_name: user?.fullName || user?.firstName || 'User',
      })
      .eq('id', existingUser.id);
    error = result.error;
  } else {
    // Create new user with handle and clerk_id
    const result = await supabase
      .from('users')
      .insert({
        email,
        handle,
        clerk_id: userId,
        full_name: user?.fullName || user?.firstName || 'User',
        password_hash: 'clerk_managed', // Placeholder - auth is managed by Clerk
        role: 'user',
      });
    error = result.error;
  }

  if (error) {
    console.error('Error setting handle:', error);
    return NextResponse.json({ error: `Failed to save: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
