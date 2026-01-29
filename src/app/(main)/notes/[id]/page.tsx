'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  Star,
  MapPin,
  Calendar,
  Heart,
  Bookmark,
  Edit,
  Trash2,
  Share2,
  Tag as TagIcon,
} from 'lucide-react';
import Link from 'next/link';

type Note = {
  id: string;
  title: string;
  content: string;
  rating: number;
  images: string[];
  tags: string[];
  created_at: string;
  user_id: string;
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  restaurant?: {
    id: string;
    name: string;
    categories: string[];
    address: string;
  };
  dish?: {
    id: string;
    name: string;
  };
  likes_count: number;
};

export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const resolvedParams = use(params);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchNote();
    checkBookmark();
  }, [resolvedParams.id]);

  const fetchNote = async () => {
    try {
      const res = await fetch(`/api/notes/${resolvedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        setNote(data);
        setLikesCount(data.likes_count || 0);
      } else {
        router.push('/notes');
      }
    } catch (err) {
      console.error('Error fetching note:', err);
      router.push('/notes');
    } finally {
      setLoading(false);
    }
  };

  const checkBookmark = async () => {
    if (!isSignedIn) return;

    try {
      const res = await fetch(`/api/bookmarks/check?note_id=${resolvedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.bookmarked);
        setBookmarkId(data.bookmark_id);
      }
    } catch (err) {
      console.error('Error checking bookmark:', err);
    }
  };

  const handleLike = async () => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    try {
      const res = await fetch(`/api/notes/${resolvedParams.id}/like`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.liked);
        setLikesCount((prev) => (data.liked ? prev + 1 : prev - 1));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleBookmark = async () => {
    if (!isSignedIn) {
      router.push('/');
      return;
    }

    try {
      if (isBookmarked && bookmarkId) {
        // Remove bookmark
        const res = await fetch(`/api/bookmarks/${bookmarkId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setIsBookmarked(false);
          setBookmarkId(null);
        }
      } else {
        // Add bookmark
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note_id: resolvedParams.id }),
        });
        if (res.ok) {
          const data = await res.json();
          setIsBookmarked(true);
          setBookmarkId(data.id);
        }
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const res = await fetch(`/api/notes/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/notes');
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: note?.title,
        text: note?.content,
        url: window.location.href,
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#00B14F] border-t-transparent"></div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  const isOwner = user?.id === note.user_id;

  return (
    <div className="min-h-screen bg-[#111111] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-[#999999] hover:text-white transition-colors"
        >
          ← Back to Notes
        </button>

        {/* Main Card */}
        <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] overflow-hidden">
          {/* Images Gallery */}
          {note.images && note.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
              {note.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${note.title} - Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`${
                        star <= note.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-[#333333]'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-medium text-[#999999]">
                    {note.rating}.0
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-2">
                  {note.title}
                </h1>

                {/* Author & Date */}
                <div className="flex items-center gap-4 text-sm text-[#999999]">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#00B14F] flex items-center justify-center text-white font-medium">
                      {note.user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-white">{note.user.full_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {formatDate(note.created_at)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {isOwner && (
                  <>
                    <Link
                      href={`/notes/${note.id}/edit`}
                      className="p-2 text-[#666666] hover:text-[#00B14F] hover:bg-[#00B14F]/10 rounded-lg transition-colors"
                    >
                      <Edit size={20} />
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="p-2 text-[#666666] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
                <button
                  onClick={handleShare}
                  className="p-2 text-[#666666] hover:text-[#00B14F] hover:bg-[#00B14F]/10 rounded-lg transition-colors"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Restaurant & Dish Info */}
            {(note.restaurant || note.dish) && (
              <div className="bg-[#2A2A2A] rounded-lg p-4 mb-6 border border-[#333333]">
                {note.restaurant && (
                  <Link
                    href={`/restaurants/${note.restaurant.id}`}
                    className="flex items-start gap-3 hover:bg-[#333333] p-2 rounded-lg transition-colors"
                  >
                    <MapPin size={20} className="text-[#00B14F] mt-1" />
                    <div>
                      <h3 className="font-semibold text-white">
                        {note.restaurant.name}
                      </h3>
                      <p className="text-sm text-[#999999]">
                        {note.restaurant.address}
                      </p>
                      <div className="flex gap-2 mt-1">
                        {note.restaurant.categories.slice(0, 3).map((cat) => (
                          <span
                            key={cat}
                            className="text-xs px-2 py-1 bg-[#1E1E1E] rounded-full text-[#999999] border border-[#333333]"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                )}
                {note.dish && (
                  <div className="flex items-center gap-2 text-[#999999] mt-2 ml-2">
                    <span className="text-lg">🍽️</span>
                    <span className="font-medium text-white">{note.dish.name}</span>
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none mb-6">
              <p className="text-[#CCCCCC] text-lg leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#00B14F]/20 text-[#00B14F] rounded-full text-sm border border-[#00B14F]/30"
                  >
                    <TagIcon size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center gap-4 pt-6 border-t border-[#333333]">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isLiked
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-[#2A2A2A] text-[#999999] hover:bg-red-500/20 hover:text-red-400'
                }`}
              >
                <Heart
                  size={20}
                  className={isLiked ? 'fill-current' : ''}
                />
                <span className="font-medium">{likesCount}</span>
                <span className="text-sm">Likes</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isBookmarked
                    ? 'bg-[#00B14F]/20 text-[#00B14F]'
                    : 'bg-[#2A2A2A] text-[#999999] hover:bg-[#00B14F]/20 hover:text-[#00B14F]'
                }`}
              >
                <Bookmark
                  size={20}
                  className={isBookmarked ? 'fill-current' : ''}
                />
                <span className="text-sm">
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentsSection noteId={note.id} />
      </div>
    </div>
  );
}

// Comments Section Component
function CommentsSection({ noteId }: { noteId: string }) {
  const { user, isSignedIn } = useUser();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [noteId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/notes/${noteId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();

    if (!isSignedIn) {
      alert('Please sign in to comment');
      return;
    }

    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/notes/${noteId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentText,
          parent_id: parentId,
        }),
      });

      if (res.ok) {
        setCommentText('');
        setReplyingTo(null);
        await fetchComments();
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchComments();
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  // Organize comments into threads
  const topLevelComments = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  return (
    <div className="mt-8 bg-[#1E1E1E] rounded-2xl border border-[#333333] p-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {isSignedIn ? (
        <form onSubmit={(e) => handleSubmitComment(e)} className="mb-8">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#00B14F] transition-all resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="px-6 py-2 bg-[#00B14F] text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-[#2A2A2A] rounded-lg text-center border border-[#333333]">
          <p className="text-[#999999]">Please sign in to comment</p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[#2A2A2A] rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#2A2A2A] rounded w-1/4"></div>
                  <div className="h-3 bg-[#2A2A2A] rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-[#666666]">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={getReplies(comment.id)}
              user={user}
              onDelete={handleDeleteComment}
              onReply={(id) => setReplyingTo(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Individual Comment Component
function CommentItem({
  comment,
  replies,
  user,
  onDelete,
  onReply,
}: {
  comment: any;
  replies: any[];
  user: any;
  onDelete: (id: string) => void;
  onReply: (id: string) => void;
}) {
  const isOwner = user?.id === comment.user.id;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#00B14F] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
        {comment.user.full_name.charAt(0).toUpperCase()}
      </div>

      {/* Comment Content */}
      <div className="flex-1">
        <div className="bg-[#2A2A2A] rounded-lg p-4 border border-[#333333]">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="font-semibold text-white">
                {comment.user.full_name}
              </span>
              <span className="text-sm text-[#666666] ml-2">
                {formatDate(comment.created_at)}
              </span>
            </div>
            {isOwner && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-[#666666] hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <p className="text-[#CCCCCC] whitespace-pre-wrap">{comment.content}</p>
        </div>

        {/* Reply button */}
        {user && (
          <button
            onClick={() => onReply(comment.id)}
            className="text-sm text-[#00B14F] hover:text-[#00B14F]/80 mt-2"
          >
            Reply
          </button>
        )}

        {/* Replies */}
        {replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                replies={[]}
                user={user}
                onDelete={onDelete}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
