import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/users/search - Search for users by name or email
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
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

    // Search users by name or email
    const { data: users, error } = await supabase
      .from('users')
      .select('id, full_name, email, avatar_url, role')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .neq('id', session.user.id) // Exclude current user
      .eq('role', 'user') // Only search for regular users, not business/admin
      .limit(limit);

    if (error) throw error;

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}
