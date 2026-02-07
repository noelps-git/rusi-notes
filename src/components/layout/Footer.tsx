import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[#E5E5E5] bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="Rusi Notes" className="w-8 h-8" />
              <h3 className="text-lg font-semibold text-[#111111]">Rusi Notes</h3>
            </div>
            <p className="text-sm text-[#666666]">
              Chennai&apos;s premier food discovery platform. Connect, explore, and share your culinary experiences.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111111] mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/restaurants" className="text-sm text-[#666666] hover:text-[#e52020] transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/notes" className="text-sm text-[#666666] hover:text-[#e52020] transition-colors">
                  Tasting Notes
                </Link>
              </li>
              <li>
                <Link href="/groups" className="text-sm text-[#666666] hover:text-[#e52020] transition-colors">
                  Groups
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111111] mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-[#666666] hover:text-[#e52020] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[#666666] hover:text-[#e52020] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111111] mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-[#666666] hover:text-[#e52020] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-[#666666] hover:text-[#e52020] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#E5E5E5] text-center">
          <p className="text-sm text-[#666666]">
            © {new Date().getFullYear()} Rusi Notes. All rights reserved. Made with ❤️ in Chennai
          </p>
        </div>
      </div>
    </footer>
  );
}
