'use client';

import { useState, useEffect } from 'react';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { CategoryFilter } from '@/components/restaurants/CategoryFilter';
import { Restaurant } from '@/types/database';
import { Search } from 'lucide-react';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCategory]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/restaurants?${params.toString()}`);
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRestaurants();
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#00B14F]/20 to-[#00B14F]/10 border-b border-[#333333] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Discover Chennai&apos;s Best Restaurants 🍛
          </h1>
          <p className="text-xl text-[#999999] mb-6">
            From Chettinad specialties to South Indian classics
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#666666]" size={20} />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#1E1E1E] border border-[#333333] rounded-[100px] text-white placeholder-[#666666] focus:outline-none focus:border-[#00B14F] transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#00B14F] text-white font-semibold rounded-[100px] hover:opacity-90 transition-all"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-[#999999]">
            {loading ? (
              'Loading restaurants...'
            ) : (
              <>
                Found <span className="font-semibold text-white">{restaurants.length}</span> restaurants
                {selectedCategory && (
                  <span className="ml-1">
                    in <span className="font-semibold text-[#00B14F] capitalize">{selectedCategory.replace('_', ' ')}</span>
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1E1E1E] rounded-2xl border border-[#333333] overflow-hidden animate-pulse">
                <div className="h-48 bg-[#2A2A2A]"></div>
                <div className="p-4">
                  <div className="h-6 bg-[#2A2A2A] rounded mb-2"></div>
                  <div className="h-4 bg-[#2A2A2A] rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-[#2A2A2A] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No restaurants found
            </h3>
            <p className="text-[#999999] mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                fetchRestaurants();
              }}
              className="px-6 py-3 bg-[#00B14F] text-white font-semibold rounded-[100px] hover:opacity-90 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
