'use client';

import { SignUp } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function SignUpPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#00B14F] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111]">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md',
            card: 'bg-white shadow-xl',
          }
        }}
      />
    </div>
  );
}
