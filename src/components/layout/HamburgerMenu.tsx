'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isSignedIn) return null;

  const handleSignOut = () => {
    signOut({ redirectUrl: '/' });
  };

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/restaurants', label: 'Restaurants', icon: '🍽️' },
    { href: '/notes', label: 'Tasting Notes', icon: '📝' },
    { href: '/friends', label: 'Friends', icon: '👥' },
    { href: '/groups', label: 'Groups', icon: '👨‍👩‍👧‍👦' },
    { href: '/bookmarks', label: 'Bookmarks', icon: '🔖' },
    { href: '/notifications', label: 'Notifications', icon: '🔔' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ];

  if ((user?.publicMetadata as any)?.role === 'business') {
    menuItems.push(
      { href: '/business/dashboard', label: 'Business Dashboard', icon: '🏪' },
      { href: '/business/insights', label: 'Insights', icon: '📈' },
      { href: '/business/ads', label: 'Advertising', icon: '📢' }
    );
  }

  if ((user?.publicMetadata as any)?.role === 'admin') {
    menuItems.push(
      { href: '/admin/dashboard', label: 'Admin Dashboard', icon: '⚙️' },
      { href: '/admin/users', label: 'User Management', icon: '👥' },
      { href: '/admin/businesses', label: 'Business Verification', icon: '✅' }
    );
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#111111]">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 text-[#666666] hover:text-[#111111] rounded-lg hover:bg-[#F9F9F9] transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#F9F9F9] rounded-lg">
              <div className="h-12 w-12 rounded-full bg-[#00B14F] flex items-center justify-center text-white font-medium">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-[#111111]">{user?.fullName}</div>
                <div className="text-sm text-[#666666]">{user?.emailAddresses[0]?.emailAddress}</div>
                <div className="text-xs text-[#00B14F] font-medium capitalize mt-1">
                  {(user?.publicMetadata as any)?.role}
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-[#666666] hover:bg-[#00B14F]/10 hover:text-[#00B14F] rounded-lg transition-colors"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
              <div className="space-y-1">
                <Link
                  href="/about"
                  onClick={onClose}
                  className="block px-4 py-2 text-sm text-[#666666] hover:text-[#111111] transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/privacy"
                  onClick={onClose}
                  className="block px-4 py-2 text-sm text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  onClick={onClose}
                  className="block px-4 py-2 text-sm text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="block px-4 py-2 text-sm text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-[#E5E5E5]">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <span className="text-xl">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
