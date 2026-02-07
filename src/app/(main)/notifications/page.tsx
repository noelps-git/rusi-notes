'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft, Bell, Check, CheckCheck, Trash2, MapPin, Loader2 } from 'lucide-react';

type NotificationMetadata = {
  reviewer_id?: string;
  reviewer_name?: string;
  reviewer_avatar?: string;
  note_id?: string;
  note_title?: string;
  note_rating?: number;
  restaurant_id?: string;
  restaurant_name?: string;
  [key: string]: any;
};

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
  metadata?: NotificationMetadata;
};

export default function NotificationsPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToBucket, setAddingToBucket] = useState<string | null>(null);
  const [addedToBucket, setAddedToBucket] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
      return;
    }
    if (isSignedIn) {
      fetchNotifications();
    }
  }, [isLoaded, isSignedIn, router]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?limit=100');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PUT' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const addToBucketList = async (notification: Notification) => {
    if (!notification.metadata?.restaurant_id) return;

    setAddingToBucket(notification.id);
    try {
      const res = await fetch('/api/bucket-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: notification.metadata.restaurant_id,
          note: `Recommended by ${notification.metadata.reviewer_name || 'a friend'}`,
          added_from_friend_id: notification.metadata.reviewer_id,
        }),
      });

      if (res.ok) {
        setAddedToBucket((prev) => new Set([...prev, notification.id]));
      } else {
        const data = await res.json();
        if (data.error?.includes('already')) {
          setAddedToBucket((prev) => new Set([...prev, notification.id]));
        }
      }
    } catch (err) {
      console.error('Error adding to bucket list:', err);
    } finally {
      setAddingToBucket(null);
    }
  };

  const getIcon = (type: string) => {
    const icons: Record<string, string> = {
      friend_request: '👋',
      friend_accepted: '🤝',
      friend_review: '🍽️',
      comment: '💬',
      like: '❤️',
      group_invite: '👥',
      group_message: '💬',
      note_shared: '📝',
    };
    return icons[type] || '🔔';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#111111] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#999999] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
            <p className="text-[#999999] mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-[#e52020] hover:bg-[#e52020]/10 rounded-lg transition-all"
            >
              <CheckCheck size={18} />
              Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#1E1E1E] rounded-xl p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#2A2A2A] rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#2A2A2A] rounded w-3/4" />
                    <div className="h-3 bg-[#2A2A2A] rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] p-12 text-center">
            <Bell size={48} className="mx-auto mb-4 text-[#333333]" />
            <h2 className="text-xl font-semibold text-white mb-2">No notifications yet</h2>
            <p className="text-[#999999]">
              When someone interacts with you, you'll see it here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-[#1E1E1E] rounded-xl border transition-all ${
                  notification.is_read
                    ? 'border-[#333333]'
                    : 'border-[#e52020]/30 bg-[#e52020]/5'
                }`}
              >
                <div className="p-4">
                  <div className="flex gap-4">
                    <div className="text-3xl flex-shrink-0">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div
                        onClick={() => {
                          if (!notification.is_read) markAsRead(notification.id);
                          if (notification.link) router.push(notification.link);
                        }}
                        className={`cursor-pointer ${notification.link ? 'hover:opacity-80' : ''}`}
                      >
                        <h3 className={`text-white ${!notification.is_read ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h3>
                        <p className="text-[#999999] text-sm mt-1">{notification.message}</p>
                        <p className="text-[#666666] text-xs mt-2">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-3">
                        {/* Add to Bucket List button for friend reviews */}
                        {notification.type === 'friend_review' && notification.metadata?.restaurant_id && (
                          addedToBucket.has(notification.id) ? (
                            <span className="flex items-center gap-1 text-xs text-green-500">
                              <Check size={14} />
                              Added to bucket list
                            </span>
                          ) : (
                            <button
                              onClick={() => addToBucketList(notification)}
                              disabled={addingToBucket === notification.id}
                              className="flex items-center gap-1 text-xs text-[#e52020] hover:opacity-80 bg-[#e52020]/10 px-2 py-1 rounded-full transition-all"
                            >
                              {addingToBucket === notification.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <MapPin size={14} />
                              )}
                              Add to Bucket List
                            </button>
                          )
                        )}
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex items-center gap-1 text-xs text-[#e52020] hover:opacity-80"
                          >
                            <Check size={14} />
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="flex items-center gap-1 text-xs text-red-400 hover:opacity-80"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
