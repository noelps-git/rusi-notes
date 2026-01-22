'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials or not an admin account');
        setLoading(false);
        return;
      }

      // Verify admin role by fetching session
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();

      if (session?.user?.role !== 'admin') {
        setError('Access denied. This page is for administrators only.');
        await signIn('credentials', { redirect: false }); // Sign out
        setLoading(false);
        return;
      }

      // Redirect to admin dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00B14F]/10 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-[#00B14F]" />
        </div>
        <h1 className="text-3xl font-bold text-[#111111] mb-2">Admin Access</h1>
        <p className="text-[#666666]">Authorized personnel only</p>
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
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-full text-[#111111] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#00B14F] focus:border-transparent"
                placeholder="admin@rusinotes.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-full text-[#111111] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#00B14F] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00B14F] text-white rounded-full font-semibold hover:bg-[#009944] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </span>
            ) : (
              'Access Admin Panel'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-[#00B14F] hover:text-[#009944] transition-colors">
            ← Back to User Login
          </Link>
        </div>
      </div>

      <div className="mt-6 p-4 bg-[#FFF9E6] border border-[#FFE4A3] rounded-2xl">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#D4A017] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[#111111] font-medium mb-1">Security Notice</p>
            <p className="text-xs text-[#666666]">
              All login attempts are monitored. Unauthorized access will be reported.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
