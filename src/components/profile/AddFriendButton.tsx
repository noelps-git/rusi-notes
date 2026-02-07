'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { UserPlus, Loader2 } from 'lucide-react';

interface AddFriendButtonProps {
  userId: string;
}

export function AddFriendButton({ userId }: AddFriendButtonProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  const handleAddFriend = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient_id: userId }),
      });

      if (res.ok) {
        setSent(true);
        showToast('Friend request sent!', 'success');
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to send request', 'error');
      }
    } catch (err) {
      showToast('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <span className="px-6 py-2 bg-yellow-500/20 text-yellow-400 rounded-[100px] border border-yellow-500/30">
        Request Sent
      </span>
    );
  }

  return (
    <button
      onClick={handleAddFriend}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-2 bg-[#e52020] text-white rounded-[100px] hover:opacity-90 transition-all disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <UserPlus size={18} />
      )}
      {loading ? 'Sending...' : 'Add Friend'}
    </button>
  );
}
