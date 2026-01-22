import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header - Match Landing Page */}
      <header className="border-b border-[#E5E5E5] bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00B14F] rounded-xl flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <span className="text-xl font-bold text-[#111111]">Rusi Notes</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
