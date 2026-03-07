'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { RecommendationCard } from './RecommendationCard';

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

interface Recommendation {
  restaurant_id: string;
  similarity_score: number;
  boost_score: number;
  final_score: number;
  reasons: string[];
  restaurant: Restaurant | null;
}

interface RecommendationListProps {
  limit?: number;
  showRefresh?: boolean;
  title?: string;
}

export function RecommendationList({
  limit = 6,
  showRefresh = true,
  title = 'Recommended for You',
}: RecommendationListProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`/api/recommendations?limit=${limit}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }

      setRecommendations(data.recommendations || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Unable to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch('/api/recommendations/refresh', { method: 'POST' });
      await fetchRecommendations();
    } catch (err) {
      console.error('Error refreshing:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [limit]);

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#e52020]" />
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#e52020]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#e52020]" />
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <p className="text-center text-[#999999] py-8">{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#e52020]" />
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-[#999999]">
            Start reviewing restaurants to get personalized recommendations!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#e52020]" />
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        {showRefresh && (
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg hover:bg-[#333333] transition-colors disabled:opacity-50"
            title="Refresh recommendations"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#999999] ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map(
          (rec) =>
            rec.restaurant && (
              <RecommendationCard
                key={rec.restaurant_id}
                restaurant={rec.restaurant}
                reasons={rec.reasons}
                score={rec.final_score}
              />
            )
        )}
      </div>
    </div>
  );
}
