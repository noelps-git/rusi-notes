'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Building2,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
} from 'lucide-react';

interface Analytics {
  overview: {
    totalUsers: number;
    totalBusinesses: number;
    totalRestaurants: number;
    verifiedRestaurants: number;
    totalNotes: number;
    totalGroups: number;
    totalFriendships: number;
    recentUsers: number;
    pendingVerifications: number;
  };
  recentRestaurants: any[];
  topContributors: any[];
  userGrowth: Array<{ month: string; count: number }>;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAnalytics();
    }
  }, [status]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) throw new Error('Failed to fetch analytics');

      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const { overview } = analytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Platform overview and management tools
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <span className="text-xs text-green-600 font-medium">
                +{overview.recentUsers} this month
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {overview.totalUsers}
            </p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>

          {/* Total Businesses */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {overview.totalBusinesses}
            </p>
            <p className="text-sm text-gray-600">Business Accounts</p>
          </div>

          {/* Total Restaurants */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-orange-600" />
              </div>
              <span className="text-xs text-blue-600 font-medium">
                {overview.verifiedRestaurants} verified
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {overview.totalRestaurants}
            </p>
            <p className="text-sm text-gray-600">Total Restaurants</p>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {overview.pendingVerifications}
            </p>
            <p className="text-sm text-gray-600">Pending Verification</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all"
          >
            <Users size={32} className="text-indigo-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Manage Users
            </h3>
            <p className="text-sm text-gray-600">
              View, search, and manage all platform users
            </p>
          </Link>

          <Link
            href="/admin/verify"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all"
          >
            <CheckCircle size={32} className="text-green-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Verify Restaurants
            </h3>
            <p className="text-sm text-gray-600">
              Review and approve restaurant registrations
            </p>
          </Link>

          <Link
            href="/admin/reports"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all"
          >
            <FileText size={32} className="text-red-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              View Reports
            </h3>
            <p className="text-sm text-gray-600">
              Review user reports and moderation queue
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
