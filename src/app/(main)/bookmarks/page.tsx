import { auth } from '@/lib/auth/auth';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Bookmark, Star, MapPin, Calendar } from 'lucide-react';

export default async function BookmarksPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Fetch all bookmarks with note details
  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select(`
      id,
      created_at,
      note:tasting_notes(
        id,
        title,
        content,
        rating,
        images,
        tags,
        created_at,
        likes_count,
        user:users(id, full_name, avatar_url),
        restaurant:restaurants(id, name, categories)
      )
    `)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  const notes = bookmarks?.map((b: any) => b.note).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark size={32} className="text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              My Bookmarks
            </h1>
          </div>
          <p className="text-gray-600">
            Your saved tasting notes for later reference
          </p>
        </div>

        {/* Bookmarks Grid */}
        {notes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark size={40} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Bookmarks Yet
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start bookmarking your favorite tasting notes to easily find them
              later!
            </p>
            <Link
              href="/notes"
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Explore Notes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note: any) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                {/* Image */}
                {note.images && note.images.length > 0 ? (
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={note.images[0]}
                      alt={note.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1 shadow-lg">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      <span className="font-bold text-gray-900">
                        {note.rating}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <Bookmark size={48} className="text-indigo-300" />
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  {/* Restaurant */}
                  {note.restaurant && (
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-red-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {note.restaurant.name}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {note.title}
                  </h3>

                  {/* Content Preview */}
                  {note.content && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {note.content}
                    </p>
                  )}

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {note.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {/* Author */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium">
                        {note.user?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-xs text-gray-600">
                        {note.user?.full_name || 'Unknown'}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Stats */}
        {notes.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white text-center">
            <p className="text-4xl font-bold mb-2">{notes.length}</p>
            <p className="text-white/90">
              Saved {notes.length === 1 ? 'Note' : 'Notes'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
