import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/admin/analytics - Get platform-wide analytics
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || (user?.publicMetadata as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const supabase = await createClient();

    // Get total counts
    const [
      { count: totalUsers },
      { count: totalBusinesses },
      { count: totalRestaurants },
      { count: verifiedRestaurants },
      { count: totalNotes },
      { count: totalGroups },
      { count: totalFriendships },
    ] = await Promise.all([
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'user'),
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'business'),
      supabase.from('restaurants').select('*', { count: 'exact', head: true }),
      supabase
        .from('restaurants')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', true),
      supabase.from('tasting_notes').select('*', { count: 'exact', head: true }),
      supabase.from('groups').select('*', { count: 'exact', head: true }),
      supabase
        .from('friendships')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted'),
    ]);

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: recentUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Get pending verifications
    const { count: pendingVerifications } = await supabase
      .from('restaurants')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', false);

    // Get recent restaurants
    const { data: recentRestaurants } = await supabase
      .from('restaurants')
      .select(`
        id,
        name,
        is_verified,
        created_at,
        owner:users!restaurants_owner_id_fkey(id, full_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get top contributors (users with most notes)
    const { data: topContributors } = await supabase
      .from('users')
      .select(`
        id,
        full_name,
        email,
        avatar_url,
        created_at,
        tasting_notes(count)
      `)
      .eq('role', 'user')
      .order('created_at', { ascending: false })
      .limit(100);

    // Process top contributors
    const contributorsWithCounts = topContributors
      ?.map((user: any) => ({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        avatar_url: user.avatar_url,
        notes_count: user.tasting_notes?.[0]?.count || 0,
        created_at: user.created_at,
      }))
      .filter((u) => u.notes_count > 0)
      .sort((a, b) => b.notes_count - a.notes_count)
      .slice(0, 10);

    // Get user growth data (last 12 months)
    const userGrowth: { month: string; count: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString());

      userGrowth.push({
        month: startOfMonth.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        count: count || 0,
      });
    }

    const analytics = {
      overview: {
        totalUsers: totalUsers || 0,
        totalBusinesses: totalBusinesses || 0,
        totalRestaurants: totalRestaurants || 0,
        verifiedRestaurants: verifiedRestaurants || 0,
        totalNotes: totalNotes || 0,
        totalGroups: totalGroups || 0,
        totalFriendships: totalFriendships || 0,
        recentUsers: recentUsers || 0,
        pendingVerifications: pendingVerifications || 0,
      },
      recentRestaurants,
      topContributors: contributorsWithCounts || [],
      userGrowth,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
