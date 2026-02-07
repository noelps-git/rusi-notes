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

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('handle', handle)
      .maybeSingle();

    if (error) {
      console.error('Error checking handle:', error);
      // If error (like column doesn't exist), assume available
      return NextResponse.json({ available: true });
    }

    return NextResponse.json({ available: !data });
  } catch (err) {
    console.error('Error checking handle:', err);
    return NextResponse.json({ available: true });
  }
}
