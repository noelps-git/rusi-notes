'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Check,
  Trash2,
  ChevronRight,
  User,
  Star,
  Loader2,
  Plus,
} from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  categories?: string[];
  address?: string;
  image_url?: string;
}

interface Friend {
  id: string;
  full_name: string;
  avatar_url?: string;
}

interface BucketItem {
  id: string;
  note?: string;
  is_visited: boolean;
  created_at: string;
  restaurant: Restaurant;
  added_from_friend?: Friend;
}

export default function BucketList() {
  const [bucketList, setBucketList] = useState<BucketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBucketList();
  }, []);

  const fetchBucketList = async () => {
    try {
      const res = await fetch('/api/bucket-list');
      if (res.ok) {
        const data = await res.json();
        setBucketList(data);
      }
    } catch (error) {
      console.error('Error fetching bucket list:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisited = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bucket-list/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visited: !currentStatus }),
      });

      if (res.ok) {
        setBucketList((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, is_visited: !currentStatus } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating bucket list item:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (id: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bucket-list/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setBucketList((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error removing bucket list item:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingItems = bucketList.filter((item) => !item.is_visited);
  const visitedItems = bucketList.filter((item) => item.is_visited);

  if (loading) {
    return (
      <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#e52020] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#333333]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#e52020]/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#e52020]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Bucket List
              </h2>
              <p className="text-xs sm:text-sm text-[#999999]">
                {pendingItems.length} places to visit
              </p>
            </div>
          </div>
          <Link
            href="/restaurants"
            className="flex items-center gap-1 text-[#e52020] text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {bucketList.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-[#666666]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Your bucket list is empty
            </h3>
            <p className="text-sm text-[#999999] mb-4">
              Discover restaurants from friend reviews and add them here!
            </p>
            <Link
              href="/restaurants"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#e52020] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Explore Restaurants
              <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Items */}
            {pendingItems.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-[#999999] mb-3 flex items-center gap-2">
                  <span>To Visit</span>
                  <span className="px-2 py-0.5 bg-[#e52020]/20 text-[#e52020] rounded-full text-xs">
                    {pendingItems.length}
                  </span>
                </h3>
                <div className="space-y-3">
                  {pendingItems.slice(0, 5).map((item) => (
                    <BucketListItem
                      key={item.id}
                      item={item}
                      onToggleVisited={toggleVisited}
                      onRemove={removeItem}
                      isUpdating={updatingId === item.id}
                    />
                  ))}
                  {pendingItems.length > 5 && (
                    <Link
                      href="/bucket-list"
                      className="block text-center py-2 text-sm text-[#e52020] hover:underline"
                    >
                      View all {pendingItems.length} places
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Visited Items */}
            {visitedItems.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-[#999999] mb-3 flex items-center gap-2">
                  <span>Visited</span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full text-xs">
                    {visitedItems.length}
                  </span>
                </h3>
                <div className="space-y-3">
                  {visitedItems.slice(0, 3).map((item) => (
                    <BucketListItem
                      key={item.id}
                      item={item}
                      onToggleVisited={toggleVisited}
                      onRemove={removeItem}
                      isUpdating={updatingId === item.id}
                    />
                  ))}
                  {visitedItems.length > 3 && (
                    <Link
                      href="/bucket-list"
                      className="block text-center py-2 text-sm text-[#999999] hover:text-white"
                    >
                      +{visitedItems.length - 3} more visited
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BucketListItem({
  item,
  onToggleVisited,
  onRemove,
  isUpdating,
}: {
  item: BucketItem;
  onToggleVisited: (id: string, currentStatus: boolean) => void;
  onRemove: (id: string) => void;
  isUpdating: boolean;
}) {
  return (
    <div
      className={`group flex items-start gap-3 p-3 rounded-xl border transition-all ${
        item.is_visited
          ? 'bg-[#111111]/50 border-[#333333] opacity-70'
          : 'bg-[#111111] border-[#333333] hover:border-[#e52020]/50'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggleVisited(item.id, item.is_visited)}
        disabled={isUpdating}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          item.is_visited
            ? 'bg-green-500 border-green-500'
            : 'border-[#555555] hover:border-[#e52020]'
        } ${isUpdating ? 'opacity-50' : ''}`}
      >
        {isUpdating ? (
          <Loader2 className="w-3 h-3 text-white animate-spin" />
        ) : item.is_visited ? (
          <Check className="w-3 h-3 text-white" />
        ) : null}
      </button>

      {/* Restaurant Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/restaurants/${item.restaurant.id}`}
          className={`font-medium hover:text-[#e52020] transition-colors ${
            item.is_visited ? 'line-through text-[#999999]' : 'text-white'
          }`}
        >
          {item.restaurant.name}
        </Link>

        {item.restaurant.categories && item.restaurant.categories.length > 0 && (
          <p className="text-xs text-[#666666] mt-0.5">
            {item.restaurant.categories.slice(0, 2).join(' • ')}
          </p>
        )}

        {item.added_from_friend && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="w-4 h-4 rounded-full bg-[#333333] flex items-center justify-center overflow-hidden">
              {item.added_from_friend.avatar_url ? (
                <img
                  src={item.added_from_friend.avatar_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-2.5 h-2.5 text-[#666666]" />
              )}
            </div>
            <span className="text-xs text-[#666666]">
              via {item.added_from_friend.full_name}
            </span>
          </div>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        disabled={isUpdating}
        className="flex-shrink-0 p-1.5 text-[#666666] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
