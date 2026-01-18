import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createClient } from '@/lib/supabase/server';

// GET /api/admin/users - Get all users with filters
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const role = searchParams.get('role'); // 'user', 'business', 'admin'
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = await createClient();

    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filter by role
    if (role && ['user', 'business', 'admin'].includes(role)) {
      query = query.eq('role', role);
    }

    // Search by name or email
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, error } = await query;

    if (error) throw error;

    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      (users || []).map(async (user) => {
        if (user.role === 'user') {
          const { count: notesCount } = await supabase
            .from('tasting_notes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

          return { ...user, stats: { notes: notesCount || 0 } };
        } else if (user.role === 'business') {
          const { count: restaurantsCount } = await supabase
            .from('restaurants')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', user.id);

          return { ...user, stats: { restaurants: restaurantsCount || 0 } };
        }
        return { ...user, stats: {} };
      })
    );

    return NextResponse.json(usersWithStats);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
