import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');

  if (!handle) {
    return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
  }

  // Validate handle format
  const handleRegex = /^[a-z0-9_.-]{3,20}$/;
  if (!handleRegex.test(handle)) {
    return NextResponse.json({ available: false, error: 'Invalid handle format' });
  }

  const supabase = await createClient();

  // Check if handle exists
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('handle', handle)
      .maybeSingle();

    if (error) {
      // If the column doesn't exist, treat as available
      console.error('Error checking handle:', error);
      return NextResponse.json({ available: true });
    }

    return NextResponse.json({ available: !data });
  } catch (err) {
    // If there's any error (like column not existing), treat as available
    console.error('Error checking handle:', err);
    return NextResponse.json({ available: true });
  }
}
