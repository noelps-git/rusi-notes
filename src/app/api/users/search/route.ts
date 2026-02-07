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
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user's email to exclude them from search
    const user = await currentUser();
    const currentUserEmail = user?.emailAddresses[0]?.emailAddress;

    // Search users by name, email, or handle
    let queryBuilder = supabase
      .from('users')
      .select('id, full_name, email, avatar_url, role, handle')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,handle.ilike.%${query}%`)
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
