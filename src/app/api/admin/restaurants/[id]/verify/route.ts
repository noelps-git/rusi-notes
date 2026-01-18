import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createClient } from '@/lib/supabase/server';
import { createNotification } from '@/lib/utils/notifications';

// PUT /api/admin/restaurants/[id]/verify - Verify or reject restaurant
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const body = await req.json();
    const { is_verified } = body;

    if (typeof is_verified !== 'boolean') {
      return NextResponse.json(
        { error: 'is_verified must be a boolean' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get restaurant with owner info
    const { data: restaurant, error: fetchError } = await supabase
      .from('restaurants')
      .select('id, name, owner_id, is_verified')
      .eq('id', resolvedParams.id)
      .single();

    if (fetchError || !restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Update verification status
    const { data: updated, error } = await supabase
      .from('restaurants')
      .update({ is_verified })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) throw error;

    // Send notification to business owner
    await createNotification({
      user_id: restaurant.owner_id,
      type: is_verified ? 'restaurant_verified' : 'restaurant_rejected',
      title: is_verified ? 'Restaurant Verified!' : 'Restaurant Review Update',
      message: is_verified
        ? `Your restaurant "${restaurant.name}" has been verified and is now visible to customers.`
        : `Your restaurant "${restaurant.name}" requires additional review. Please check your details.`,
      link: '/business/dashboard',
      metadata: {
        restaurant_id: restaurant.id,
        restaurant_name: restaurant.name,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error verifying restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to verify restaurant' },
      { status: 500 }
    );
  }
}
