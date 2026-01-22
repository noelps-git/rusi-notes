'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Briefcase, AlertCircle } from 'lucide-react';
import type { UserRole } from '@/types/auth';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'user' as UserRole,
    businessName: '',
    canPostReviews: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: any = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        canPostReviews: formData.canPostReviews,
      };

      if (formData.role === 'business') {
        if (!formData.businessName) {
          setError('Business name is required');
          setLoading(false);
          return;
        }
        payload.businessData = {
          businessName: formData.businessName,
        };
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      router.push('/login?signup=success');
    } catch (error) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#111111] mb-2">Create Account</h1>
        <p className="text-[#666666]">Join Chennai foodies 🍛</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-[#E5E5E5] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-full text-[#111111] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#00B14F] focus:border-transparent"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-full text-[#111111] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#00B14F] focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-full text-[#111111] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#00B14F] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'user' })}
                className={`py-3 px-4 rounded-full font-medium transition-all ${
                  formData.role === 'user'
                    ? 'bg-[#00B14F] text-white'
                    : 'bg-[#F5F5F5] text-[#666666] hover:bg-[#E5E5E5]'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'business' })}
                className={`py-3 px-4 rounded-full font-medium transition-all ${
                  formData.role === 'business'
                    ? 'bg-[#00B14F] text-white'
                    : 'bg-[#F5F5F5] text-[#666666] hover:bg-[#E5E5E5]'
                }`}
              >
                Business
              </button>
            </div>
          </div>

          {formData.role === 'business' && (
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-2">
                Business Name
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required={formData.role === 'business'}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-full text-[#111111] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#00B14F] focus:border-transparent"
                  placeholder="Your restaurant name"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-[#F9F9F9] rounded-2xl">
            <input
              type="checkbox"
              id="canPostReviews"
              checked={formData.canPostReviews}
              onChange={(e) => setFormData({ ...formData, canPostReviews: e.target.checked })}
              className="w-5 h-5 text-[#00B14F] border-[#E5E5E5] rounded focus:ring-[#00B14F] focus:ring-2"
            />
            <label htmlFor="canPostReviews" className="text-sm text-[#111111] cursor-pointer">
              Allow me to post reviews and share with the community
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00B14F] text-white rounded-full font-semibold hover:bg-[#009944] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating account...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#666666]">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#00B14F] hover:text-[#009944] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
