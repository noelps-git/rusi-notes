import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getStripe, PLANS } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { priceId, plan } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const stripe = getStripe();

    // Get or create Stripe customer
    const supabase = await createClient();
    const { data: dbUser } = await supabase
      .from('users')
      .select('id, stripe_customer_id')
      .eq('email', email)
      .maybeSingle();

    let customerId = dbUser?.stripe_customer_id;

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: email,
        name: user.fullName || undefined,
        metadata: {
          clerk_user_id: userId,
          db_user_id: dbUser?.id || '',
        },
      });
      customerId = customer.id;

      // Save customer ID to database
      if (dbUser?.id) {
        await supabase
          .from('users')
          .update({ stripe_customer_id: customerId })
          .eq('id', dbUser.id);
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.nextUrl.origin}/dashboard?payment=success&plan=${plan}`,
      cancel_url: `${req.nextUrl.origin}/pricing?payment=cancelled`,
      metadata: {
        clerk_user_id: userId,
        db_user_id: dbUser?.id || '',
        plan: plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
