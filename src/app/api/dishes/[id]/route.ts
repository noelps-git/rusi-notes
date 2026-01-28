import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/dishes/[id] - Get single dish
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const supabase = await createClient();

    const { data: dish, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();

    if (error) throw error;

    if (!dish) {
      return NextResponse.json(
        { error: 'Dish not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(dish);
  } catch (error) {
    console.error('Error fetching dish:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dish' },
      { status: 500 }
    );
  }
}

// PUT /api/dishes/[id] - Update dish
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'business') {
      return NextResponse.json(
        { error: 'Unauthorized. Business account required.' },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const body = await req.json();
    const supabase = await createClient();

    // Verify ownership
    const { data: dish } = await supabase
      .from('dishes')
      .select('restaurant_id, restaurants!inner(owner_id)')
      .eq('id', resolvedParams.id)
      .single();

    if (!dish || (dish as any).restaurants.owner_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Dish not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update dish
    const { data: updated, error } = await supabase
      .from('dishes')
      .update({
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        is_vegetarian: body.is_vegetarian,
        is_vegan: body.is_vegan,
        is_gluten_free: body.is_gluten_free,
        is_halal: body.is_halal,
        is_jain: body.is_jain,
        allergens: body.allergens,
        is_available: body.is_available,
        image_url: body.image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating dish:', error);
    return NextResponse.json(
      { error: 'Failed to update dish' },
      { status: 500 }
    );
  }
}

// DELETE /api/dishes/[id] - Delete dish
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'business') {
      return NextResponse.json(
        { error: 'Unauthorized. Business account required.' },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const supabase = await createClient();

    // Verify ownership
    const { data: dish } = await supabase
      .from('dishes')
      .select('restaurant_id, restaurants!inner(owner_id)')
      .eq('id', resolvedParams.id)
      .single();

    if (!dish || (dish as any).restaurants.owner_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Dish not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete dish
    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', resolvedParams.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return NextResponse.json(
      { error: 'Failed to delete dish' },
      { status: 500 }
    );
  }
}
