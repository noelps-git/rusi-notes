'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Star, MapPin, Calendar, Heart, Bookmark, Plus } from 'lucide-react';
import Link from 'next/link';

type Note = {
  id: string;
  title: string;
  content: string;
  rating: number;
  images: string[];
  tags: string[];
  created_at: string;
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  restaurant?: {
    id: string;
    name: string;
    categories: string[];
  };
  likes_count: number;
};

export default function NotesPage() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'my-notes'>('all');

  useEffect(() => {
    fetchNotes();
  }, [filter, user]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === 'my-notes' && user?.id) {
        params.append('userId', user.id);
      }

      const res = await fetch(`/api/notes?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Header */}
      <div className="bg-[#1E1E1E] border-b border-[#333333] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Tasting Notes 🍛
              </h1>
              <p className="text-[#999999] mt-1">
                Discover food experiences from the community
              </p>
            </div>

            {isSignedIn && (
              <Link
                href="/notes/create"
                className="flex items-center gap-2 px-6 py-3 bg-[#00B14F] text-white rounded-[100px] hover:opacity-90 transition-all"
              >
                <Plus size={20} />
                Create Note
              </Link>
            )}
          </div>

          {/* Filter Tabs */}
          {isSignedIn && (
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-[100px] font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-[#00B14F] text-white'
                    : 'text-[#999999] bg-[#2A2A2A] border border-[#333333] hover:border-[#00B14F]'
                }`}
              >
                All Notes
              </button>
              <button
                onClick={() => setFilter('my-notes')}
                className={`px-4 py-2 rounded-[100px] font-medium transition-all ${
                  filter === 'my-notes'
                    ? 'bg-[#00B14F] text-white'
                    : 'text-[#999999] bg-[#2A2A2A] border border-[#333333] hover:border-[#00B14F]'
                }`}
              >
                My Notes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          // Loading Skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-[#1E1E1E] rounded-2xl border border-[#333333] overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-[#2A2A2A]"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-[#2A2A2A] rounded w-3/4"></div>
                  <div className="h-3 bg-[#2A2A2A] rounded w-full"></div>
                  <div className="h-3 bg-[#2A2A2A] rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00B14F]/20 mb-4">
              <Star size={32} className="text-[#00B14F]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {filter === 'my-notes'
                ? 'No notes yet'
                : 'No tasting notes found'}
            </h2>
            <p className="text-[#999999] mb-6">
              {filter === 'my-notes'
                ? 'Start sharing your food experiences'
                : 'Be the first to share a tasting note'}
            </p>
            {isSignedIn && (
              <Link
                href="/notes/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00B14F] text-white rounded-[100px] hover:opacity-90 transition-all"
              >
                <Plus size={20} />
                Create Your First Note
              </Link>
            )}
          </div>
        ) : (
          // Notes Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="group bg-[#1E1E1E] rounded-2xl border border-[#333333] overflow-hidden hover:border-[#00B14F] transition-all"
              >
                {/* Image */}
                {note.images && note.images.length > 0 ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={note.images[0]}
                      alt={note.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#00B14F]/20 to-[#00B14F]/10 flex items-center justify-center">
                    <span className="text-6xl">🍽️</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${
                          star <= note.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-[#333333]'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-[#999999]">
                      {note.rating}.0
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#00B14F] transition-colors">
                    {note.title}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-[#999999] text-sm mb-4 line-clamp-2">
                    {note.content}
                  </p>

                  {/* Restaurant */}
                  {note.restaurant && (
                    <div className="flex items-center gap-2 text-sm text-[#666666] mb-3">
                      <MapPin size={14} className="text-[#00B14F]" />
                      <span className="line-clamp-1">
                        {note.restaurant.name}
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-[#00B14F]/20 text-[#00B14F] text-xs rounded-full border border-[#00B14F]/30"
                        >
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="px-2 py-1 bg-[#2A2A2A] text-[#666666] text-xs rounded-full">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#333333]">
                    {/* Author */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#00B14F] flex items-center justify-center text-white text-sm font-medium">
                        {note.user.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {note.user.full_name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-[#666666]">
                          <Calendar size={12} />
                          {formatDate(note.created_at)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="flex items-center gap-1 text-[#666666] hover:text-red-500 transition-colors"
                      >
                        <Heart size={16} />
                        <span className="text-xs">
                          {note.likes_count || 0}
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="text-[#666666] hover:text-[#00B14F] transition-colors"
                      >
                        <Bookmark size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      {isSignedIn && (
        <Link
          href="/notes/create"
          className="fixed bottom-6 right-6 md:hidden flex items-center justify-center w-14 h-14 bg-[#00B14F] text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-20"
        >
          <Plus size={24} />
        </Link>
      )}
    </div>
  );
}
