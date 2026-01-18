'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { HamburgerMenu } from './HamburgerMenu';
import NotificationBell from '@/components/notifications/NotificationBell';

export function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-indigo-600">Taste</span>
            </Link>

            {session && (
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/restaurants"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Restaurants
                </Link>
                <Link
                  href="/notes"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Notes
                </Link>
                {session.user.role === 'user' && (
                  <>
                    <Link
                      href="/groups"
                      className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      Groups
                    </Link>
                    <Link
                      href="/friends"
                      className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      Friends
                    </Link>
                    <Link
                      href="/bookmarks"
                      className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      Bookmarks
                    </Link>
                  </>
                )}
                {session.user.role === 'business' && (
                  <Link
                    href="/business/dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Business
                  </Link>
                )}
                {session.user.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <div className="hidden md:block">
                  <NotificationBell />
                </div>

                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {session.user.name}
                  </span>
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link href="/login">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {session && (
        <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      )}
    </>
  );
}
