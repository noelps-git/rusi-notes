'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { UserPlus, Check, X, Search, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

type User = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
};

type Friendship = {
  id: string;
  status: string;
  created_at: string;
  requester: User;
  recipient: User;
};

export default function FriendsPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [sentRequests, setSentRequests] = useState<Friendship[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Friendship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    } else if (isSignedIn) {
      fetchFriendships();
    }
  }, [isLoaded, isSignedIn, router]);

  // Auto-search with debounce when user types
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchFriendships = async () => {
    setLoading(true);
    try {
      // Get accepted friends
      const friendsRes = await fetch('/api/friends?status=accepted');
      if (friendsRes.ok) {
        const data = await friendsRes.json();
        setFriends(data);
      }

      // Get sent requests
      const sentRes = await fetch('/api/friends?status=pending&type=sent');
      if (sentRes.ok) {
        const data = await sentRes.json();
        setSentRequests(data);
      }

      // Get received requests
      const receivedRes = await fetch('/api/friends?status=pending&type=received');
      if (receivedRes.ok) {
        const data = await receivedRes.json();
        setReceivedRequests(data);
      }
    } catch (err) {
      console.error('Error fetching friendships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;

    setSearching(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    setSendingRequest(userId);
    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient_id: userId }),
      });

      if (res.ok) {
        showToast('Friend request sent!', 'success');
        await fetchFriendships();
        setSearchResults(searchResults.filter((u) => u.id !== userId));
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to send request', 'error');
      }
    } catch (err) {
      console.error('Error sending friend request:', err);
      showToast('Something went wrong', 'error');
    } finally {
      setSendingRequest(null);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const res = await fetch(`/api/friends/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });

      if (res.ok) {
        showToast('Friend request accepted!', 'success');
        await fetchFriendships();
      } else {
        showToast('Failed to accept request', 'error');
      }
    } catch (err) {
      console.error('Error accepting request:', err);
      showToast('Something went wrong', 'error');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const res = await fetch(`/api/friends/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (res.ok) {
        showToast('Friend request declined', 'info');
        await fetchFriendships();
      } else {
        showToast('Failed to decline request', 'error');
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
      showToast('Something went wrong', 'error');
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    if (!confirm('Remove this friend?')) return;

    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast('Friend removed', 'info');
        await fetchFriendships();
      } else {
        showToast('Failed to remove friend', 'error');
      }
    } catch (err) {
      console.error('Error removing friend:', err);
      showToast('Something went wrong', 'error');
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#e52020] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white font-['Inter',sans-serif] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Friends</h1>
          <p className="text-[#999999]">Connect with your foodie friends and share recommendations!</p>
        </div>

        {/* Tabs */}
        <div className="bg-[#1E1E1E] rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.5)] border border-[#333333] mb-6">
          <div className="flex border-b border-[#333333]">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'friends'
                  ? 'text-[#e52020] border-b-2 border-[#e52020]'
                  : 'text-[#999999] hover:text-white'
              }`}
            >
              <Users size={20} className="inline mr-2" />
              Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'requests'
                  ? 'text-[#e52020] border-b-2 border-[#e52020]'
                  : 'text-[#999999] hover:text-white'
              }`}
            >
              Requests
              {receivedRequests.length > 0 && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-[#e52020] text-white text-xs rounded-full flex items-center justify-center">
                  {receivedRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'search'
                  ? 'text-[#e52020] border-b-2 border-[#e52020]'
                  : 'text-[#999999] hover:text-white'
              }`}
            >
              <Search size={20} className="inline mr-2" />
              Add Friends
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#1E1E1E] rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.5)] border border-[#333333] p-6">
          {activeTab === 'friends' && (
            <div>
              {friends.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-[#333333] mb-4" />
                  <p className="text-[#999999] mb-2">No friends yet</p>
                  <p className="text-sm text-[#666666] mb-4">Start connecting with fellow food lovers!</p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="px-6 py-2 bg-[#e52020] text-white rounded-[100px] hover:opacity-90 transition-all"
                  >
                    Find Friends 🔍
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {friends.map((friendship) => {
                    const friend =
                      friendship.requester.id === user?.id
                        ? friendship.recipient
                        : friendship.requester;
                    return (
                      <div
                        key={friendship.id}
                        className="flex items-center justify-between p-4 border border-[#333333] rounded-2xl hover:border-[#e52020] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#e52020]/20 flex items-center justify-center text-[#e52020] font-bold text-xl">
                            {friend?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {friend?.full_name || 'Unknown User'}
                            </h3>
                            <p className="text-sm text-[#999999]">{friend.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFriend(friendship.id)}
                          className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-[100px] transition-all border border-[#333333] hover:border-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-6">
              {/* Received Requests */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Received ({receivedRequests.length}) 📩
                </h3>
                {receivedRequests.length === 0 ? (
                  <p className="text-[#999999] text-center py-8">No pending requests</p>
                ) : (
                  <div className="space-y-3">
                    {receivedRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 border border-[#333333] rounded-2xl hover:border-[#e52020] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#e52020]/20 flex items-center justify-center text-[#e52020] font-bold text-xl">
                            {request.requester?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {request.requester?.full_name || 'Unknown User'}
                            </h3>
                            <p className="text-sm text-[#999999]">
                              {request.requester.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all border border-green-500/30"
                            title="Accept"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all border border-red-500/30"
                            title="Reject"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sent Requests */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Sent ({sentRequests.length}) ⏳
                </h3>
                {sentRequests.length === 0 ? (
                  <p className="text-[#999999] text-center py-8">No sent requests</p>
                ) : (
                  <div className="space-y-3">
                    {sentRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 border border-[#333333] rounded-2xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#e52020]/20 flex items-center justify-center text-[#e52020] font-bold text-xl">
                            {request.recipient?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {request.recipient?.full_name || 'Unknown User'}
                            </h3>
                            <p className="text-sm text-[#999999]">Waiting for response... ⏰</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or handle..."
                    style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
                    className="w-full pl-12 pr-12 py-3 bg-[#111111] border border-[#333333] rounded-[100px] placeholder-[#666666] focus:outline-none focus:border-[#e52020] transition-all caret-white"
                    autoFocus
                  />
                  {searching && (
                    <Loader2 size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e52020] animate-spin" />
                  )}
                </div>
                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <p className="text-sm text-[#666666] mt-2 ml-4">Type at least 2 characters to search</p>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border border-[#333333] rounded-2xl hover:border-[#e52020] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#e52020]/20 flex items-center justify-center text-[#e52020] font-bold text-xl">
                          {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {user?.full_name || 'Unknown User'}
                          </h3>
                          <p className="text-sm text-[#999999]">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendRequest(user.id)}
                        disabled={sendingRequest === user.id}
                        className="flex items-center gap-2 px-4 py-2 bg-[#e52020] text-white rounded-[100px] hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {sendingRequest === user.id ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <UserPlus size={20} />
                        )}
                        {sendingRequest === user.id ? 'Sending...' : 'Add Friend'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : searchQuery.length > 0 && !searching ? (
                <div className="text-center py-12 text-[#999999]">
                  <p>No users found</p>
                </div>
              ) : (
                <div className="text-center py-12 text-[#999999]">
                  <Search size={48} className="mx-auto mb-4 text-[#333333]" />
                  <p className="mb-2">Search for friends by name or email</p>
                  <p className="text-sm text-[#666666]">Find and connect with fellow food lovers</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
