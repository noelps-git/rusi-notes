import Link from 'next/link';
import { Restaurant } from '@/types/database';
import { CHENNAI_RESTAURANT_CATEGORIES } from '@/lib/constants/chennai';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const getCategoryIcon = (categoryId: string) => {
    const category = CHENNAI_RESTAURANT_CATEGORIES.find(c => c.id === categoryId);
    return category?.icon || '🍽️';
  };

  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className="group bg-[#1E1E1E] rounded-2xl border border-[#333333] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#00B14F] hover:shadow-[0_0_20px_rgba(0,177,79,0.2)]">
        {/* Restaurant Image or Placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-[#00B14F]/20 to-[#00B14F]/10 overflow-hidden">
          {restaurant.cover_image_url ? (
            <img
              src={restaurant.cover_image_url}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-6xl">
              {getCategoryIcon(restaurant.categories[0])}
            </div>
          )}

          {/* Verified Badge */}
          {restaurant.is_verified && (
            <div className="absolute top-3 right-3 bg-[#00B14F] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </div>
          )}

          {/* Rating */}
          {restaurant.average_rating > 0 && (
            <div className="absolute bottom-3 left-3 bg-[#1E1E1E]/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 border border-[#333333]">
              <span className="text-yellow-500">⭐</span>
              <span className="font-semibold text-white">
                {restaurant.average_rating.toFixed(1)}
              </span>
              <span className="text-[#999999] text-sm">
                ({restaurant.total_reviews})
              </span>
            </div>
          )}
        </div>

        {/* Restaurant Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-white mb-1 group-hover:text-[#00B14F] transition-colors">
            {restaurant.name}
          </h3>

          {/* Categories */}
          <div className="flex flex-wrap gap-1 mb-2">
            {restaurant.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="text-xs bg-[#2A2A2A] text-[#999999] px-2 py-1 rounded-full capitalize"
              >
                {getCategoryIcon(cat)} {cat.replace('_', ' ')}
              </span>
            ))}
            {restaurant.categories.length > 3 && (
              <span className="text-xs bg-[#2A2A2A] text-[#999999] px-2 py-1 rounded-full">
                +{restaurant.categories.length - 3}
              </span>
            )}
          </div>

          {/* Description */}
          {restaurant.description && (
            <p className="text-sm text-[#999999] mb-3 line-clamp-2">
              {restaurant.description}
            </p>
          )}

          {/* Location & Price */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-[#666666]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{restaurant.city}</span>
            </div>
            {restaurant.price_range && (
              <span className="font-semibold text-[#00B14F]">
                {restaurant.price_range}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
