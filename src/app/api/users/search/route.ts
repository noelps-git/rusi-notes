import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/users/search - Search for users by name, email, or handle
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q')?.trim();
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Run both queries in parallel for faster response
    const [user, supabase] = await Promise.all([
      currentUser(),
      createClient()
    ]);

    const currentUserEmail = user?.emailAddresses[0]?.emailAddress;
    const searchPattern = `%${query}%`;

    // Search users by name, email, or handle
    let queryBuilder = supabase
      .from('users')
      .select('id, full_name, email, avatar_url, handle')
      .or(`full_name.ilike.${searchPattern},email.ilike.${searchPattern},handle.ilike.${searchPattern}`)
      .limit(limit);

    // Exclude current user by email if available
    if (currentUserEmail) {
      queryBuilder = queryBuilder.neq('email', currentUserEmail);
    }

    const { data: users, error } = await queryBuilder;

    if (error) throw error;

    return NextResponse.json(users || []);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}
