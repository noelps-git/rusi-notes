'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Star, MapPin, Calendar, Heart, Bookmark, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
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
  const { showToast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'my-notes'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  const isAdmin = (user?.publicMetadata as any)?.role === 'admin';

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

  const handleDelete = async (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this note?')) return;

    setDeleting(noteId);
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        showToast('Note deleted successfully', 'success');
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to delete note', 'error');
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      showToast('Failed to delete note', 'error');
    } finally {
      setDeleting(null);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                Tasting Notes 🍛
              </h1>
              <p className="text-xs sm:text-sm text-[#999999] mt-0.5 sm:mt-1">
                Discover food experiences from the community
              </p>
            </div>

            {isSignedIn && (
              <Link
                href="/notes/create"
                className="hidden sm:flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#e52020] text-white rounded-[100px] hover:opacity-90 transition-all text-sm sm:text-base"
              >
                <Plus size={18} />
                <span className="hidden md:inline">Create Note</span>
                <span className="md:hidden">Create</span>
              </Link>
            )}
          </div>

          {/* Filter Tabs */}
          {isSignedIn && (
            <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[100px] font-medium transition-all text-sm ${
                  filter === 'all'
                    ? 'bg-[#e52020] text-white'
                    : 'text-[#999999] bg-[#2A2A2A] border border-[#333333] hover:border-[#e52020]'
                }`}
              >
                All Notes
              </button>
              <button
                onClick={() => setFilter('my-notes')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[100px] font-medium transition-all text-sm ${
                  filter === 'my-notes'
                    ? 'bg-[#e52020] text-white'
                    : 'text-[#999999] bg-[#2A2A2A] border border-[#333333] hover:border-[#e52020]'
                }`}
              >
                My Notes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {loading ? (
          // Loading Skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-[#1E1E1E] rounded-2xl border border-[#333333] overflow-hidden animate-pulse"
              >
                <div className="h-36 sm:h-40 md:h-48 bg-[#2A2A2A]"></div>
                <div className="p-4 sm:p-6 space-y-3">
                  <div className="h-4 bg-[#2A2A2A] rounded w-3/4"></div>
                  <div className="h-3 bg-[#2A2A2A] rounded w-full"></div>
                  <div className="h-3 bg-[#2A2A2A] rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          // Empty State
          <div className="text-center py-8 sm:py-12 md:py-16 px-4">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#e52020]/20 mb-4">
              <Star size={28} className="text-[#e52020] sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {filter === 'my-notes'
                ? 'No notes yet'
                : 'No tasting notes found'}
            </h2>
            <p className="text-sm sm:text-base text-[#999999] mb-6">
              {filter === 'my-notes'
                ? 'Start sharing your food experiences'
                : 'Be the first to share a tasting note'}
            </p>
            {isSignedIn && (
              <Link
                href="/notes/create"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#e52020] text-white rounded-[100px] hover:opacity-90 transition-all text-sm sm:text-base"
              >
                <Plus size={18} />
                Create Your First Note
              </Link>
            )}
          </div>
        ) : (
          // Notes Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="group bg-[#1E1E1E] rounded-xl sm:rounded-2xl border border-[#333333] overflow-hidden hover:border-[#e52020] transition-all"
              >
                {/* Image */}
                {note.images && note.images.length > 0 ? (
                  <div className="h-36 sm:h-40 md:h-48 overflow-hidden">
                    <img
                      src={note.images[0]}
                      alt={note.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-36 sm:h-40 md:h-48 bg-gradient-to-br from-[#e52020]/20 to-[#e52020]/10 flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl md:text-6xl">🍽️</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-4 sm:p-5 md:p-6">
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
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#e52020] transition-colors">
                    {note.title}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-[#999999] text-sm mb-4 line-clamp-2">
                    {note.content}
                  </p>

                  {/* Restaurant */}
                  {note.restaurant && (
                    <div className="flex items-center gap-2 text-sm text-[#666666] mb-3">
                      <MapPin size={14} className="text-[#e52020]" />
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
                          className="px-2 py-1 bg-[#e52020]/20 text-[#e52020] text-xs rounded-full border border-[#e52020]/30"
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
                      <div className="w-8 h-8 rounded-full bg-[#e52020] flex items-center justify-center text-white text-sm font-medium">
                        {note.user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {note.user?.full_name || 'Unknown User'}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-[#666666]">
                          <Calendar size={12} />
                          {formatDate(note.created_at)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[#666666]">
                        <Heart size={16} />
                        <span className="text-xs">
                          {note.likes_count || 0}
                        </span>
                      </div>
                      {(filter === 'my-notes' || isAdmin) && (
                        <button
                          onClick={(e) => handleDelete(e, note.id)}
                          disabled={deleting === note.id}
                          className="p-1.5 text-[#666666] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete note"
                        >
                          <Trash2 size={16} className={deleting === note.id ? 'animate-pulse' : ''} />
                        </button>
                      )}
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
          className="fixed bottom-20 right-4 sm:hidden flex items-center justify-center w-14 h-14 bg-[#e52020] text-white rounded-full shadow-[0_4px_20px_rgba(229,32,32,0.4)] active:scale-95 transition-transform z-20"
        >
          <Plus size={24} />
        </Link>
      )}
    </div>
  );
}
