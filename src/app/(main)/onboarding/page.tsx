'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { AtSign, Check, X, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const { showToast } = useToast();

  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // Check handle availability with debounce
  useEffect(() => {
    if (!handle || handle.length < 3) {
      setIsAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await fetch(`/api/users/check-handle?handle=${encodeURIComponent(handle)}`);
        const data = await res.json();
        setIsAvailable(data.available);
      } catch (err) {
        console.error('Error checking handle:', err);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [handle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, '');
    setHandle(value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!handle || handle.length < 3) {
      setError('Handle must be at least 3 characters');
      return;
    }

    if (handle.length > 20) {
      setError('Handle must be 20 characters or less');
      return;
    }

    if (!isAvailable) {
      setError('This handle is already taken');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/users/set-handle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to set handle');
      }

      showToast('Welcome to Rusi Notes! Your handle is set.', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#00B14F] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#00B14F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles size={40} className="text-[#00B14F]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Rusi Notes! 🍛
          </h1>
          <p className="text-[#999999]">
            Let&apos;s set up your unique foodie handle
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Handle Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Your Foodie Handle <span className="text-red-400">*</span>
              </label>
              <p className="text-[#666666] text-sm mb-3">
                This is your unique identity on Rusi Notes. Friends can find and connect with you using this handle.
              </p>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#666666]">
                  <AtSign size={20} />
                </div>
                <input
                  type="text"
                  value={handle}
                  onChange={handleInputChange}
                  placeholder="yourhandle"
                  maxLength={20}
                  className="w-full pl-12 pr-12 py-3 bg-[#2A2A2A] border border-[#333333] rounded-[100px] text-white placeholder-[#666666] focus:outline-none focus:border-[#00B14F] transition-all"
                  required
                />
                {/* Status Icon */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {checking ? (
                    <Loader2 size={20} className="text-[#666666] animate-spin" />
                  ) : isAvailable === true ? (
                    <Check size={20} className="text-[#00B14F]" />
                  ) : isAvailable === false ? (
                    <X size={20} className="text-red-400" />
                  ) : null}
                </div>
              </div>

              {/* Handle Preview */}
              {handle && (
                <p className="mt-2 text-sm">
                  <span className="text-[#666666]">Your profile: </span>
                  <span className="text-[#00B14F]">@{handle}</span>
                </p>
              )}

              {/* Availability Status */}
              {handle && handle.length >= 3 && !checking && (
                <p className={`mt-2 text-sm ${isAvailable ? 'text-[#00B14F]' : 'text-red-400'}`}>
                  {isAvailable ? '✓ This handle is available!' : '✗ This handle is already taken'}
                </p>
              )}
            </div>

            {/* Rules */}
            <div className="bg-[#2A2A2A] rounded-lg p-4 border border-[#333333]">
              <h3 className="text-sm font-medium text-white mb-2">Handle Rules:</h3>
              <ul className="text-sm text-[#999999] space-y-1">
                <li className={handle.length >= 3 ? 'text-[#00B14F]' : ''}>
                  • At least 3 characters
                </li>
                <li className={handle.length <= 20 ? 'text-[#00B14F]' : 'text-red-400'}>
                  • Maximum 20 characters
                </li>
                <li className="text-[#00B14F]">
                  • Lowercase letters, numbers, dots, underscores, hyphens
                </li>
                <li className={isAvailable === true ? 'text-[#00B14F]' : ''}>
                  • Must be unique
                </li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isAvailable || handle.length < 3}
              className="w-full px-6 py-3 bg-[#00B14F] text-white rounded-[100px] font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Claim Your Handle
                </>
              )}
            </button>
          </form>
        </div>

        {/* Skip Option */}
        <p className="text-center mt-6 text-[#666666] text-sm">
          You can change your handle later in settings
        </p>
      </div>
    </div>
  );
}
