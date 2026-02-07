import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Calendar, Award, Heart, MessageCircle, Users } from 'lucide-react';
import { AddFriendButton } from '@/components/profile/AddFriendButton';

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect('/');
  }

  const resolvedParams = await params;
  const supabase = await createClient();

  // Fetch user profile
  const { data: user } = await supabase
    .from('users')
    .select('id, full_name, email, bio, avatar_url, created_at, dietary_preferences')
    .eq('id', resolvedParams.id)
    .single();

  if (!user) {
    notFound();
  }

  // Check if viewing own profile
  const isOwnProfile = clerkUser.id === user.id;

  // Get user stats
  const [notesResult, friendsResult, likesResult] = await Promise.all([
    supabase
      .from('tasting_notes')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_public', true),
    supabase
      .from('friendships')
      .select('id', { count: 'exact', head: true })
      .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .eq('status', 'accepted'),
    supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ]);

  const stats = {
    notes: notesResult.count || 0,
    friends: friendsResult.count || 0,
    likes: likesResult.count || 0,
  };

  // Get recent public notes
  const { data: recentNotes } = await supabase
    .from('tasting_notes')
    .select(`
      id,
      title,
      content,
      rating,
      created_at,
      likes_count,
      comments_count,
      images
    `)
    .eq('user_id', user.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(6);

  // Check friendship status if viewing another user's profile
  let friendshipStatus = null;
  if (!isOwnProfile) {
    const { data: friendship } = await supabase
      .from('friendships')
      .select('id, status, requester_id')
      .or(`and(requester_id.eq.${clerkUser.id},recipient_id.eq.${user.id}),and(requester_id.eq.${user.id},recipient_id.eq.${clerkUser.id})`)
      .single();

    friendshipStatus = friendship;
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white font-['Inter',sans-serif] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/friends"
          className="inline-flex items-center gap-2 text-[#999999] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Nanbas</span>
        </Link>

        {/* Profile Header */}
        <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-[#e52020] flex items-center justify-center text-white text-4xl font-bold">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user?.full_name || 'Unknown User'}</h1>

              <div className="flex flex-wrap gap-4 text-sm text-[#999999] mb-4">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {user.bio && (
                <p className="text-[#999999] mb-4">{user.bio}</p>
              )}

              {user.dietary_preferences && user.dietary_preferences.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {user.dietary_preferences.map((pref: string) => (
                    <span
                      key={pref}
                      className="px-3 py-1 bg-[#e52020]/20 text-[#e52020] text-xs font-medium rounded-full border border-[#e52020]/30"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              {!isOwnProfile && (
                <div className="flex gap-3">
                  {!friendshipStatus && (
                    <AddFriendButton userId={user.id} />
                  )}
                  {friendshipStatus?.status === 'accepted' && (
                    <span className="px-6 py-2 bg-green-500/20 text-green-400 rounded-[100px] border border-green-500/30">
                      Nanbas 🦁
                    </span>
                  )}
                  {friendshipStatus?.status === 'pending' && (
                    <span className="px-6 py-2 bg-yellow-500/20 text-yellow-400 rounded-[100px] border border-yellow-500/30">
                      Request Pending ⏳
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] p-6 text-center">
            <div className="w-12 h-12 bg-[#e52020]/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-[#e52020]" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.notes}</div>
            <div className="text-sm text-[#999999]">Rusi Notes</div>
          </div>

          <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] p-6 text-center">
            <div className="w-12 h-12 bg-[#e52020]/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-[#e52020]" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.friends}</div>
            <div className="text-sm text-[#999999]">Nanbas</div>
          </div>

          <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] p-6 text-center">
            <div className="w-12 h-12 bg-[#e52020]/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-[#e52020]" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.likes}</div>
            <div className="text-sm text-[#999999]">Likes Given</div>
          </div>
        </div>

        {/* Recent Notes */}
        <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Recent Reviews 🍛
          </h2>

          {recentNotes && recentNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="bg-[#111111] border border-[#333333] rounded-xl p-4 hover:border-[#e52020] transition-all"
                >
                  <h3 className="font-semibold text-white mb-2 line-clamp-1">{note.title}</h3>
                  <p className="text-sm text-[#999999] mb-3 line-clamp-2">{note.content}</p>

                  <div className="flex items-center gap-4 text-xs text-[#666666]">
                    <div className="flex items-center gap-1">
                      <Award size={14} className="text-[#e52020]" />
                      <span>{note.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={14} />
                      <span>{note.likes_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      <span>{note.comments_count}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle size={48} className="mx-auto text-[#333333] mb-4" />
              <p className="text-[#999999]">No public notes yet 🤷</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
