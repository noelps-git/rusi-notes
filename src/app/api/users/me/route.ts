import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  if (!email) {
    return NextResponse.json({ hasHandle: false, user: null });
  }

  const supabase = await createClient();

  const { data: dbUser } = await supabase
    .from('users')
    .select('id, handle, email')
    .eq('email', email)
    .maybeSingle();

  return NextResponse.json({
    hasHandle: !!dbUser?.handle,
    user: dbUser,
  });
}
