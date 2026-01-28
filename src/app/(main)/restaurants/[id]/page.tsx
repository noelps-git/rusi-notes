'use client';

import { use, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Restaurant } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatters';

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, isSignedIn } = useUser();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchRestaurant();
  }, [resolvedParams.id]);

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`/api/restaurants/${resolvedParams.id}`);
      const data = await response.json();
      setRestaurant(data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    // TODO: Implement favorite functionality
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant not found</h2>
          <Link href="/restaurants">
            <Button>Back to Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-indigo-600 to-purple-600">
        {restaurant.cover_image_url ? (
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-9xl">
            🍽️
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Restaurant Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {restaurant.name}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  {restaurant.average_rating > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-semibold">{restaurant.average_rating.toFixed(1)}</span>
                      <span>({restaurant.total_reviews} reviews)</span>
                    </div>
                  )}
                  {restaurant.price_range && (
                    <span className="font-semibold">{restaurant.price_range}</span>
                  )}
                </div>
              </div>

              {isSignedIn && (
                <button
                  onClick={toggleFavorite}
                  className={`p-4 rounded-full transition-all ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                  }`}
                >
                  <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cuisines</h2>
              <div className="flex flex-wrap gap-2">
                {restaurant.categories.map((cat: string) => (
                  <span
                    key={cat}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium capitalize"
                  >
                    {cat.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            {restaurant.description && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{restaurant.description}</p>
              </div>
            )}

            {/* Menu/Dishes */}
            {restaurant.dishes && restaurant.dishes.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Menu Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {restaurant.dishes.map((dish: any) => (
                    <div key={dish.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{dish.name}</h3>
                        {dish.description && (
                          <p className="text-sm text-gray-600 mt-1">{dish.description}</p>
                        )}
                        {dish.price && (
                          <p className="text-indigo-600 font-semibold mt-2">
                            {formatCurrency(dish.price)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Write Review CTA */}
            {isSignedIn && (
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Share Your Experience</h3>
                <p className="mb-4 text-white/90">Tried this restaurant? Write a tasting note!</p>
                <Link href={`/notes/create?restaurant=${restaurant.id}`}>
                  <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
                    Write a Tasting Note
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-3">
                {restaurant.phone && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${restaurant.phone}`} className="text-gray-700 hover:text-indigo-600 transition-colors">
                      {restaurant.phone}
                    </a>
                  </div>
                )}
                {restaurant.email && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${restaurant.email}`} className="text-gray-700 hover:text-indigo-600 transition-colors">
                      {restaurant.email}
                    </a>
                  </div>
                )}
                {restaurant.address && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-700">{restaurant.address}</p>
                  </div>
                )}
                {restaurant.website_url && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <a href={restaurant.website_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 transition-colors">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Opening Hours */}
            {restaurant.opening_hours && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Opening Hours</h2>
                <div className="space-y-2 text-sm">
                  {Object.entries(restaurant.opening_hours as Record<string, string>).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{day}</span>
                      <span className="font-medium text-gray-900">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
