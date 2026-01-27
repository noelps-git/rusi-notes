'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { HamburgerMenu } from './HamburgerMenu';
import NotificationBell from '@/components/notifications/NotificationBell';

export function Header() {
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

            <SignedIn>
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
              </nav>
            </SignedIn>
          </div>

          <div className="flex items-center gap-4">
            <SignedIn>
              <div className="hidden md:block">
                <NotificationBell />
              </div>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                    userButtonTrigger: 'hover:opacity-80',
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <div className="flex gap-3">
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-[#666666] hover:text-[#00B14F] transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-6 h-11 text-sm font-medium text-white bg-[#00B14F] rounded-full hover:bg-[#009944] transition-all">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </header>

      <SignedIn>
        <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </SignedIn>
    </>
  );
}
