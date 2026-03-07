import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return stripeInstance;
}

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Up to 10 reviews per month',
      'Basic restaurant search',
      'Add up to 5 friends',
    ],
  },
  pro: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    price: 499, // in cents ($4.99)
    features: [
      'Unlimited reviews',
      'Priority restaurant search',
      'Unlimited friends',
      'Bucket list feature',
      'Group chat access',
      'Early access to new features',
    ],
  },
  premium: {
    name: 'Premium',
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    price: 999, // in cents ($9.99)
    features: [
      'Everything in Pro',
      'AI-powered recommendations',
      'Export reviews to PDF',
      'Custom profile badge',
      'Priority support',
      'No ads',
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;
