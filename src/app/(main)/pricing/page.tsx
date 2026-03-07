'use client';

import { useState, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Loader2, Sparkles, Crown, Zap } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Zap,
    features: [
      'Up to 10 reviews per month',
      'Basic restaurant search',
      'Add up to 5 friends',
      'View friend reviews',
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 4.99,
    period: 'month',
    description: 'For food enthusiasts',
    icon: Sparkles,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    features: [
      'Unlimited reviews',
      'Priority restaurant search',
      'Unlimited friends',
      'Bucket list feature',
      'Group chat access',
      'Early access to new features',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    period: 'month',
    description: 'The ultimate experience',
    icon: Crown,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
    features: [
      'Everything in Pro',
      'AI-powered recommendations',
      'Export reviews to PDF',
      'Custom profile badge',
      'Priority support',
      'No ads ever',
    ],
    cta: 'Go Premium',
    popular: false,
  },
];

function PricingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const cancelled = searchParams.get('payment') === 'cancelled';

  const handleSubscribe = async (plan: typeof PLANS[0]) => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    if (plan.id === 'free' || !plan.priceId) return;

    setLoading(plan.id);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          plan: plan.id,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#999999] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        {cancelled && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-500 text-center">
            Payment was cancelled. Feel free to try again when you're ready.
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-[#e52020]">Plan</span>
          </h1>
          <p className="text-lg text-[#999999] max-w-2xl mx-auto">
            Unlock premium features and take your food journey to the next level
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = plan.id === 'free'; // TODO: Check actual user plan

            return (
              <div
                key={plan.id}
                className={`relative bg-[#1E1E1E] rounded-2xl border-2 transition-all ${
                  plan.popular
                    ? 'border-[#e52020] shadow-[0_0_40px_rgba(229,32,32,0.2)]'
                    : 'border-[#333333] hover:border-[#555555]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-[#e52020] text-white text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        plan.popular
                          ? 'bg-[#e52020]/20'
                          : 'bg-[#333333]'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          plan.popular ? 'text-[#e52020]' : 'text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-sm text-[#999999]">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-[#999999] ml-1">/{plan.period}</span>
                    )}
                    {plan.price === 0 && (
                      <span className="text-[#999999] ml-1">{plan.period}</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check
                          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            plan.popular ? 'text-[#e52020]' : 'text-green-500'
                          }`}
                        />
                        <span className="text-[#CCCCCC] text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading !== null || isCurrentPlan}
                    className={`w-full py-3 px-6 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-[#e52020] text-white hover:opacity-90'
                        : isCurrentPlan
                        ? 'bg-[#333333] text-[#999999] cursor-default'
                        : 'bg-white text-black hover:bg-[#EEEEEE]'
                    } ${loading === plan.id ? 'opacity-70' : ''}`}
                  >
                    {loading === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#666666] text-sm">
            All plans include a 7-day free trial. Cancel anytime.
          </p>
          <p className="text-[#666666] text-sm mt-2">
            Secure payments powered by{' '}
            <span className="text-[#999999]">Stripe</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111111] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#e52020]" />
        </div>
      }
    >
      <PricingPageContent />
    </Suspense>
  );
}
