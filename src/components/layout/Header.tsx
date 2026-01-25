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
      <header className="sticky top-0 z-40 w-full border-b border-[#E5E5E5] bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="Rusi Notes Logo" className="w-10 h-10" />
              <span className="text-xl font-bold text-[#111111]">Rusi Notes</span>
            </Link>

            {session && (
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-[#666666] hover:text-[#00B14F] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/restaurants"
                  className="text-sm font-medium text-[#666666] hover:text-[#00B14F] transition-colors"
                >
                  Restaurants
                </Link>
                <Link
                  href="/notes"
                  className="text-sm font-medium text-[#666666] hover:text-[#00B14F] transition-colors"
                >
                  Notes
                </Link>
                {session.user.role === 'user' && (
                  <>
                    <Link
                      href="/groups"
                      className="text-sm font-medium text-[#666666] hover:text-[#00B14F] transition-colors"
                    >
                      Groups
                    </Link>
                    <Link
                      href="/friends"
                      className="text-sm font-medium text-[#666666] hover:text-[#00B14F] transition-colors"
                    >
                      Friends
                    </Link>
                    <Link
                      href="/bookmarks"
                      className="text-sm font-medium text-[#666666] hover:text-[#00B14F] transition-colors"
                    >
                      Bookmarks
                    </Link>
                  </>
                )}
                {session.user.role === 'business' && (
                  <Link
                    href="/business/dashboard"
                    className="text-sm font-medium text-[#666666] hover:text-[#00B14F] transition-colors"
                  >
                    Business
                  </Link>
                )}
                {session.user.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="text-sm font-medium text-[#666666] hover:text-[#00B14F] transition-colors"
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
                  className="flex items-center gap-2 rounded-lg p-2 hover:bg-[#F9F9F9] transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-[#00B14F] flex items-center justify-center text-white font-medium text-sm">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-[#111111]">
                    {session.user.name}
                  </span>
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link href="/login">
                  <button className="px-4 py-2 text-sm font-medium text-[#666666] hover:text-[#00B14F] transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-6 h-11 text-sm font-medium text-white bg-[#00B14F] rounded-full hover:bg-[#009944] transition-all">
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
