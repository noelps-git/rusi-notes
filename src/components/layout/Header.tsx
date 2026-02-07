'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Menu } from 'lucide-react';
import { HamburgerMenu } from './HamburgerMenu';
import NotificationBell from '@/components/notifications/NotificationBell';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E5E5E5] bg-white">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4 md:gap-8">
            {/* Mobile Menu Button */}
            <SignedIn>
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 -ml-2 text-[#666666] hover:text-[#e52020] transition-colors"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </SignedIn>

            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <img src="/logo.svg" alt="Rusi Notes Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="text-lg sm:text-xl font-bold text-[#111111]">Rusi Notes</span>
            </Link>

            <SignedIn>
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-[#666666] hover:text-[#e52020] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/restaurants"
                  className="text-sm font-medium text-[#666666] hover:text-[#e52020] transition-colors"
                >
                  Restaurants
                </Link>
                <Link
                  href="/notes"
                  className="text-sm font-medium text-[#666666] hover:text-[#e52020] transition-colors"
                >
                  Notes
                </Link>
                <Link
                  href="/groups"
                  className="text-sm font-medium text-[#666666] hover:text-[#e52020] transition-colors"
                >
                  Groups
                </Link>
                <Link
                  href="/friends"
                  className="text-sm font-medium text-[#666666] hover:text-[#e52020] transition-colors"
                >
                  Friends
                </Link>
                <Link
                  href="/bookmarks"
                  className="text-sm font-medium text-[#666666] hover:text-[#e52020] transition-colors"
                >
                  Bookmarks
                </Link>
              </nav>
            </SignedIn>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <SignedIn>
              {/* Mobile notification bell */}
              <div className="md:hidden">
                <NotificationBell />
              </div>
              {/* Desktop notification bell */}
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
              <div className="flex gap-2 sm:gap-3">
                <SignInButton mode="modal">
                  <button className="px-3 sm:px-4 py-2 text-sm font-medium text-[#666666] hover:text-[#e52020] transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 sm:px-6 h-10 sm:h-11 text-sm font-medium text-white bg-[#e52020] rounded-full hover:bg-[#c41a1a] transition-all">
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
