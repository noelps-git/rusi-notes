'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusSquare, Users, User } from 'lucide-react';
import { SignedIn } from '@clerk/nextjs';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/restaurants', label: 'Explore', icon: Search },
    { href: '/notes/create', label: 'Create', icon: PlusSquare, isCreate: true },
    { href: '/friends', label: 'Nanbas', icon: Users },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <SignedIn>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E5E5] sm:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            if (item.isCreate) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center -mt-4"
                >
                  <div className="w-12 h-12 bg-[#e52020] rounded-full flex items-center justify-center shadow-lg">
                    <Icon size={24} className="text-white" />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-2 ${
                  active ? 'text-[#e52020]' : 'text-[#999999]'
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </SignedIn>
  );
}
