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
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('handle', handle)
    .maybeSingle();

  if (error) {
    console.error('Error checking handle:', error);
    return NextResponse.json({ error: 'Failed to check handle' }, { status: 500 });
  }

  return NextResponse.json({ available: !data });
}
