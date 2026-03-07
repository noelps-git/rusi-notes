import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { generateUserTasteProfile } from '@/lib/recommendations';

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    const user = await currentUser();

    if (!clerkId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const supabase = await createClient();

    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    await generateUserTasteProfile(dbUser.id);

    await supabase
      .from('recommendation_cache')
      .delete()
      .eq('user_id', dbUser.id);

    return NextResponse.json({
      success: true,
      message: 'Taste profile updated successfully',
    });
  } catch (error) {
    console.error('Error refreshing profile:', error);
    return NextResponse.json(
      { error: 'Failed to refresh profile' },
      { status: 500 }
    );
  }
}
