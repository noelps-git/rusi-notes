'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  FileText,
  BarChart3,
  Users,
  Share2,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface WelcomeDashboardProps {
  userName: string;
  userEmail: string;
}

export default function WelcomeDashboard({ userName, userEmail }: WelcomeDashboardProps) {
  const router = useRouter();
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [hasNotes, setHasNotes] = useState<boolean | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkForNotes();
  }, []);

  const checkForNotes = async () => {
    try {
      const res = await fetch('/api/notes?limit=1');
      if (res.ok) {
        const data = await res.json();
        const userHasNotes = data.notes && data.notes.length > 0;
        setHasNotes(userHasNotes);

        // Show modal if user has no notes
        if (!userHasNotes) {
          setTimeout(() => setShowCreateNoteModal(true), 500);
        }
      }
    } catch (error) {
      console.error('Error checking notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const link = window.location.origin;
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleCreateNote = () => {
    setShowCreateNoteModal(false);
    router.push('/notes/create');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#0009FF] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white font-['Inter',sans-serif]">
      {/* Create Note Modal */}
      {showCreateNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] p-8 max-w-lg w-full shadow-[0_16px_64px_rgba(0,9,255,0.3)] relative">
            <button
              onClick={() => setShowCreateNoteModal(false)}
              className="absolute top-4 right-4 text-[#999999] hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[#0009FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-[#0009FF]" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome to Rusi Notes! 🎉
              </h2>
              <p className="text-[#999999] font-normal">
                Start your food journey by creating your first Rusi Note!
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-[#111111] rounded-xl border border-[#333333]">
                <span className="text-2xl">🍛</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Review Dishes</h3>
                  <p className="text-sm text-[#999999] font-normal">
                    Rate specific dishes, not just restaurants
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-[#111111] rounded-xl border border-[#333333]">
                <span className="text-2xl">📸</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Add Photos</h3>
                  <p className="text-sm text-[#999999] font-normal">
                    Capture your food moments visually
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-[#111111] rounded-xl border border-[#333333]">
                <span className="text-2xl">👥</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Share with Friends</h3>
                  <p className="text-sm text-[#999999] font-normal">
                    Let your Nanba gang know what's mass!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateNote}
              className="w-full px-8 h-12 bg-[#0009FF] text-white rounded-[100px] font-medium hover:opacity-90 transition-all"
            >
              Create Your First Note 🚀
            </button>
            <button
              onClick={() => setShowCreateNoteModal(false)}
              className="w-full mt-3 px-8 h-12 bg-transparent border-2 border-[#333333] text-white rounded-[100px] font-medium hover:border-white/80 transition-all"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1E1E] border border-[#333333] rounded-[100px] mb-6">
            <span className="text-2xl">👋</span>
            <span className="text-sm font-medium text-[#999999]">Welcome Aboard!</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Vanakkam, <span className="text-[#0009FF]">{userName}!</span>
          </h1>
          <p className="text-xl text-[#999999] font-normal max-w-2xl mx-auto">
            We're glad you're here! 🎉 Ready to start your <span className="text-white font-semibold">Vera Level</span> food journey?
          </p>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            What You Can Do <span className="text-[#0009FF]">Right Now</span> 🔥
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Create Note */}
            <Link
              href="/notes/create"
              className="group bg-[#1E1E1E] p-8 rounded-2xl border border-[#333333] hover:border-[#0009FF] transition-all shadow-[0_16px_64px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_64px_rgba(0,9,255,0.3)]"
            >
              <div className="w-16 h-16 bg-[#0009FF]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-[#0009FF]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                Create Rusi Note 📝
              </h3>
              <p className="text-[#999999] font-normal mb-4">
                Review a dish you tried. <span className="text-[#0009FF]">"Innum konjam masala bro!"</span>
              </p>
              <div className="flex items-center gap-2 text-[#0009FF] font-medium">
                <span>Get Started</span>
                <ChevronRight size={16} />
              </div>
            </Link>

            {/* View Friends Feed */}
            <Link
              href="/friends"
              className="group bg-[#1E1E1E] p-8 rounded-2xl border border-[#333333] hover:border-[#0009FF] transition-all shadow-[0_16px_64px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_64px_rgba(0,9,255,0.3)]"
            >
              <div className="w-16 h-16 bg-[#0009FF]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-[#0009FF]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                Friends Feed 👥
              </h3>
              <p className="text-[#999999] font-normal mb-4">
                Connect with nanbas. See what's <span className="text-[#0009FF]">trending!</span>
              </p>
              <div className="flex items-center gap-2 text-[#0009FF] font-medium">
                <span>Explore Now</span>
                <ChevronRight size={16} />
              </div>
            </Link>

            {/* View Analytics */}
            <Link
              href="/notes"
              className="group bg-[#1E1E1E] p-8 rounded-2xl border border-[#333333] hover:border-[#0009FF] transition-all shadow-[0_16px_64px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_64px_rgba(0,9,255,0.3)]"
            >
              <div className="w-16 h-16 bg-[#0009FF]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-[#0009FF]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                View Analytics 📊
              </h3>
              <p className="text-[#999999] font-normal mb-4">
                Track your reviews. <span className="text-[#0009FF]">Thala-style stats!</span>
              </p>
              <div className="flex items-center gap-2 text-[#0009FF] font-medium">
                <span>View Stats</span>
                <ChevronRight size={16} />
              </div>
            </Link>
          </div>
        </div>

        {/* Share Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1E1E1E] p-8 md:p-10 rounded-2xl border border-[#333333] shadow-[0_16px_64px_rgba(0,0,0,0.5)] text-center">
            <div className="w-16 h-16 bg-[#0009FF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Share2 className="w-8 h-8 text-[#0009FF]" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Share <span className="text-[#0009FF]">Rusi Notes</span> with Friends! 📢
            </h2>
            <p className="text-[#999999] font-normal mb-6">
              Invite your Nanba gang to join the food revolution! <span className="text-white">"Viral-ah paravalam!"</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <div className="flex-1 w-full sm:max-w-md px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl text-[#999999] font-mono text-sm overflow-hidden">
                {window.location.origin}
              </div>
              <button
                onClick={handleCopyLink}
                className="px-6 h-12 bg-[#0009FF] text-white rounded-[100px] font-medium hover:opacity-90 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                {linkCopied ? (
                  <>
                    <Check size={20} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-[#999999]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🦁</span>
                <span>Share with Thala Fans</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">😂</span>
                <span>Spread the Mass</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">💯</span>
                <span>Grow the Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
