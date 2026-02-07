import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 pb-16 sm:pb-0">{children}</main>
      <div className="hidden sm:block">
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
}
