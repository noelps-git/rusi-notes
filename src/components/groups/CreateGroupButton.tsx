'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Lock, Globe } from 'lucide-react';

export default function CreateGroupButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Group name is required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          is_private: isPrivate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create group');
      }

      // Redirect to the new group's chat page
      router.push(`/groups/${data.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Create Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-[#e52020] text-white rounded-[100px] hover:opacity-90 transition-all shadow-[0_16px_64px_rgba(0,9,255,0.3)]"
      >
        <Plus size={20} />
        <span className="font-medium">Create Gang 🦁</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] border border-[#333333] rounded-2xl shadow-[0_16px_64px_rgba(0,9,255,0.3)] max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Create New Gang 🎉
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[#333333] rounded-lg transition-colors"
              >
                <X size={20} className="text-[#999999] hover:text-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Gang Name <span className="text-[#e52020]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Chennai Foodies Gang 🍛"
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#e52020] transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description <span className="text-[#666666]">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this gang about? 🤔"
                  rows={3}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#e52020] transition-all resize-none"
                />
              </div>

              {/* Privacy */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Privacy 🔒
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsPrivate(true)}
                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                      isPrivate
                        ? 'border-[#e52020] bg-[#e52020]/10'
                        : 'border-[#333333] hover:border-[#666666]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isPrivate ? 'bg-[#e52020]/20' : 'bg-[#333333]'
                      }`}
                    >
                      <Lock
                        size={20}
                        className={isPrivate ? 'text-[#e52020]' : 'text-[#666666]'}
                      />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-white">Private</div>
                      <div className="text-sm text-[#999999]">
                        Only invited nanbas can join
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPrivate(false)}
                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                      !isPrivate
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-[#333333] hover:border-[#666666]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        !isPrivate ? 'bg-green-500/20' : 'bg-[#333333]'
                      }`}
                    >
                      <Globe
                        size={20}
                        className={!isPrivate ? 'text-green-400' : 'text-[#666666]'}
                      />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-white">Public</div>
                      <div className="text-sm text-[#999999]">
                        Anyone can discover and join
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-6 py-3 border border-[#333333] text-white rounded-[100px] hover:bg-[#333333] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[#e52020] text-white rounded-[100px] hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Gang 🚀'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
