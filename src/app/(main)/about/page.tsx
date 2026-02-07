import Link from 'next/link';
import { ArrowLeft, Star, Users, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#111111] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#999999] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4">About Rusi Notes</h1>
        <p className="text-xl text-[#e52020] mb-8">Saapadu Review Podalam!</p>

        <div className="prose prose-invert max-w-none space-y-6 text-[#CCCCCC]">
          <p className="text-lg">
            Rusi Notes is Chennai's favorite food review platform - built by foodies,
            for foodies. We believe that the best restaurant recommendations come from
            your friends (friends), not random strangers on the internet.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#333333] text-center">
              <div className="w-12 h-12 bg-[#e52020]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-[#e52020]" size={24} />
              </div>
              <h3 className="text-white font-semibold mb-2">Dish-Level Reviews</h3>
              <p className="text-sm text-[#999999]">Rate individual dishes, not just restaurants</p>
            </div>
            <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#333333] text-center">
              <div className="w-12 h-12 bg-[#e52020]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-[#e52020]" size={24} />
              </div>
              <h3 className="text-white font-semibold mb-2">Friend Network</h3>
              <p className="text-sm text-[#999999]">See what your friends are eating</p>
            </div>
            <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#333333] text-center">
              <div className="w-12 h-12 bg-[#e52020]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-[#e52020]" size={24} />
              </div>
              <h3 className="text-white font-semibold mb-2">Chennai Focus</h3>
              <p className="text-sm text-[#999999]">From T. Nagar to OMR, we've got you covered</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mt-8">Our Mission</h2>
          <p>
            We're on a mission to help every foodie in Chennai discover their next
            favorite dish. No more scrolling through fake reviews - just genuine
            recommendations from people you trust.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8">Join the Community</h2>
          <p>
            Whether you're a biryani buff, filter coffee connoisseur, or street food
            explorer, there's a place for you here. Start sharing your food stories today!
          </p>

          <div className="mt-8">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#e52020] text-white rounded-full font-medium hover:opacity-90 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
