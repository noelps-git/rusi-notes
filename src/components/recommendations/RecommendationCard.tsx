'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { WhyRecommended } from './WhyRecommended';

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  categories: string[];
  price_range: string | null;
  average_rating: number;
  total_reviews: number;
  logo_url: string | null;
  city: string;
}

interface RecommendationCardProps {
  restaurant: Restaurant;
  reasons: string[];
  score?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  south_indian: 'South Indian',
  north_indian: 'North Indian',
  chinese: 'Chinese',
  continental: 'Continental',
  fast_food: 'Fast Food',
  bakery: 'Bakery',
  cafe: 'Cafe',
  street_food: 'Street Food',
  biryani: 'Biryani',
  chettinad: 'Chettinad',
  seafood: 'Seafood',
  desserts: 'Desserts',
};

export function RecommendationCard({
  restaurant,
  reasons,
}: RecommendationCardProps) {
  const primaryCategory = restaurant.categories?.[0];

  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="block bg-[#1E1E1E] rounded-xl overflow-hidden border border-[#333333] hover:border-[#e52020]/50 transition-all hover:shadow-lg hover:shadow-[#e52020]/10"
    >
      <div className="relative h-32 bg-[#2A2A2A]">
        {restaurant.logo_url ? (
          <Image
            src={restaurant.logo_url}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}

        {restaurant.price_range && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded-full">
            {restaurant.price_range}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white truncate">{restaurant.name}</h3>

        <div className="flex items-center gap-2 mt-1 text-sm text-[#999999]">
          {primaryCategory && (
            <span>{CATEGORY_LABELS[primaryCategory] || primaryCategory}</span>
          )}
          {restaurant.city && (
            <>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {restaurant.city}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-white font-medium">
              {restaurant.average_rating?.toFixed(1) || 'N/A'}
            </span>
          </div>
          {restaurant.total_reviews > 0 && (
            <span className="text-xs text-[#666666]">
              ({restaurant.total_reviews} reviews)
            </span>
          )}
        </div>

        <div className="mt-3">
          <WhyRecommended reasons={reasons} />
        </div>
      </div>
    </Link>
  );
}
