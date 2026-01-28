'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  Star,
  MessageSquare,
  BarChart3,
  Tag,
  Clock,
} from 'lucide-react';

interface Insights {
  totalDishes: number;
  availableDishes: number;
  totalFeedback: number;
  averageRating: number;
  topRatedDishes: Array<{ name: string; rating: number; feedbackCount: number }>;
  lowRatedDishes: Array<{ name: string; rating: number; feedbackCount: number }>;
  categoryBreakdown: Record<string, number>;
  recentFeedback: Array<{
    dishName: string;
    rating: number;
    feedback: string;
    tags: string[];
    created_at: string;
  }>;
  popularTags: Record<string, number>;
}

export default function BusinessInsightsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [insights, setInsights] = useState<Insights | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    } else if (isSignedIn && (user?.publicMetadata as any)?.role !== 'business') {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, user, router]);

  useEffect(() => {
    if (isSignedIn) {
      fetchInsights();
    }
  }, [isSignedIn]);

  const fetchInsights = async () => {
    try {
      const res = await fetch('/api/business/insights');
      if (!res.ok) throw new Error('Failed to fetch insights');

      const data = await res.json();
      setRestaurant(data.restaurant);
      setInsights(data.insights);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return then.toLocaleDateString();
  };

  if (loading || !insights) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Calculate category chart data
  const totalDishesInCategories = Object.values(insights.categoryBreakdown).reduce(
    (sum, count) => sum + count,
    0
  );

  // Top tags sorted by count
  const topTags = Object.entries(insights.popularTags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Business Insights
          </h1>
          {restaurant && (
            <p className="text-gray-600">
              Analytics and feedback for <strong>{restaurant.name}</strong>
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Dishes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BarChart3 size={24} className="text-indigo-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {insights.totalDishes}
            </p>
            <p className="text-sm text-gray-600">Total Dishes</p>
            <p className="text-xs text-gray-500 mt-1">
              {insights.availableDishes} available
            </p>
          </div>

          {/* Total Feedback */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare size={24} className="text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {insights.totalFeedback}
            </p>
            <p className="text-sm text-gray-600">Customer Reviews</p>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star size={24} className="text-yellow-600 fill-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {insights.averageRating.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Average Rating</p>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <= Math.round(insights.averageRating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
          </div>

          {/* Top Tags */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Tag size={24} className="text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {topTags.length}
            </p>
            <p className="text-sm text-gray-600">Popular Tags</p>
            {topTags.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Most common: #{topTags[0][0]}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Rated Dishes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={24} className="text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Top Rated Dishes
              </h2>
            </div>
            {insights.topRatedDishes.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No dishes with enough feedback yet
              </p>
            ) : (
              <div className="space-y-3">
                {insights.topRatedDishes.map((dish, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{dish.name}</p>
                      <p className="text-xs text-gray-600">
                        {dish.feedbackCount} reviews
                      </p>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      <span className="font-bold text-gray-900">
                        {dish.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Rated Dishes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={24} className="text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Needs Improvement
              </h2>
            </div>
            {insights.lowRatedDishes.length === 0 ? (
              <p className="text-green-600 text-sm">
                ✅ All dishes are rated well!
              </p>
            ) : (
              <div className="space-y-3">
                {insights.lowRatedDishes.map((dish, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{dish.name}</p>
                      <p className="text-xs text-gray-600">
                        {dish.feedbackCount} reviews
                      </p>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full">
                      <Star size={16} className="text-gray-400" />
                      <span className="font-bold text-gray-900">
                        {dish.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Dishes by Category
          </h2>
          {Object.keys(insights.categoryBreakdown).length === 0 ? (
            <p className="text-gray-500 text-sm">No categories yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(insights.categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => {
                  const percentage =
                    totalDishesInCategories > 0
                      ? (count / totalDishesInCategories) * 100
                      : 0;
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {category}
                        </span>
                        <span className="text-sm text-gray-600">
                          {count} dishes ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Popular Tags Cloud */}
        {topTags.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Popular Customer Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {topTags.map(([tag, count]) => {
                const maxCount = topTags[0][1];
                const size = Math.max(12, Math.min(24, 12 + (count / maxCount) * 12));
                return (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full font-medium"
                    style={{ fontSize: `${size}px` }}
                  >
                    #{tag} ({count})
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Feedback */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={24} className="text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Recent Feedback</h2>
          </div>
          {insights.recentFeedback.length === 0 ? (
            <p className="text-gray-500 text-sm">No feedback yet</p>
          ) : (
            <div className="space-y-4">
              {insights.recentFeedback.map((feedback, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {feedback.dishName}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= feedback.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {getRelativeTime(feedback.created_at)}
                    </span>
                  </div>
                  {feedback.feedback && (
                    <p className="text-sm text-gray-700 mb-2">
                      "{feedback.feedback}"
                    </p>
                  )}
                  {feedback.tags && feedback.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {feedback.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
