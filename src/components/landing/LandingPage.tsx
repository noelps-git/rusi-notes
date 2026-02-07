'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  Users,
  TrendingUp,
  MessageCircle,
  Share2,
  Award,
  ChevronLeft,
  ChevronRight,
  Mail,
  Check,
  Menu,
  X,
  Utensils,
  BookOpen,
  MapPin
} from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const testimonials = [
    {
      name: 'Priya S.',
      role: 'Food Enthusiast',
      image: '👩‍💼',
      content: 'Finally, an app that lets me remember which biryani place had the perfect spice level. Game changer!',
      rating: 5,
    },
    {
      name: 'Rahul M.',
      role: 'Weekend Explorer',
      image: '🧑‍💻',
      content: 'I love seeing what my friends recommend. No more guessing - I trust their taste!',
      rating: 5,
    },
    {
      name: 'Deepa K.',
      role: 'Restaurant Owner',
      image: '👩‍🍳',
      content: 'Great way to connect with genuine food lovers. The feedback helps us improve.',
      rating: 5,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = '/sign-up';
      }, 2000);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-white text-[#111111] font-['Inter',sans-serif]">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Rusi Notes Logo" className="w-10 h-10" />
              <span className="text-xl font-bold text-[#111111]">Rusi Notes</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[#666666] hover:text-[#111111] transition-colors font-medium text-sm">Features</a>
              <a href="#how-it-works" className="text-[#666666] hover:text-[#111111] transition-colors font-medium text-sm">How It Works</a>
              <a href="#reviews" className="text-[#666666] hover:text-[#111111] transition-colors font-medium text-sm">Reviews</a>
              <Link href="/sign-in" className="text-[#666666] hover:text-[#111111] transition-colors font-medium text-sm">Sign In</Link>
              <Link href="/sign-up">
                <button className="px-6 h-11 bg-[#e52020] text-white rounded-full font-medium text-sm hover:bg-[#c41a1a] transition-all">
                  Get Started Free
                </button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#111111]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-[#E5E5E5]">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-[#666666] hover:text-[#111111] transition-colors font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="text-[#666666] hover:text-[#111111] transition-colors font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                <a href="#reviews" className="text-[#666666] hover:text-[#111111] transition-colors font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
                <Link href="/sign-in" className="text-[#666666] hover:text-[#111111] transition-colors font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-6 h-11 bg-[#e52020] text-white rounded-full font-medium text-sm">
                    Get Started Free
                  </button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16 bg-white">
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e52020]/10 rounded-full mb-8">
              <Utensils className="w-4 h-4 text-[#e52020]" />
              <span className="text-sm font-medium text-[#e52020]">Your Personal Food Journal</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-[#111111] px-4">
              Remember every meal.<br />
              <span className="text-[#e52020]">Share what you love.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-[#666666] mb-10 leading-relaxed max-w-2xl mx-auto px-4">
              Rate dishes, track your favorites, and discover new restaurants through trusted recommendations from friends.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-4">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 min-h-[52px] bg-[#e52020] text-white rounded-full font-semibold text-base hover:bg-[#c41a1a] transition-all shadow-lg active:scale-95">
                  Start Your Food Journal
                </button>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 min-h-[52px] bg-white border-2 border-[#E5E5E5] text-[#111111] rounded-full font-semibold text-base hover:border-[#e52020] transition-all active:scale-95">
                  See How It Works
                </button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-[#666666]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#e52020]" />
                <span className="font-semibold text-[#111111]">10K+</span>
                <span>Food Lovers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#e52020]" />
                <span className="font-semibold text-[#111111]">50K+</span>
                <span>Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#e52020]" />
                <span className="font-semibold text-[#111111]">1K+</span>
                <span>Restaurants</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#F9F9F9]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#111111]">
              Why Food Lovers Choose Us
            </h2>
            <p className="text-base sm:text-lg text-[#666666] max-w-2xl mx-auto">
              Everything you need to track, rate, and share your culinary adventures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto px-4">
            {/* Feature 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] hover:border-[#e52020] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#e52020]/10 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-[#e52020]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">
                Personal Food Diary
              </h3>
              <p className="text-[#666666] leading-relaxed text-sm">
                Rate every dish you try. Add photos, notes, and never forget that perfect meal again.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] hover:border-[#e52020] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#e52020]/10 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#e52020]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">
                Trusted Recommendations
              </h3>
              <p className="text-[#666666] leading-relaxed text-sm">
                See what your friends are eating. Real reviews from people whose taste you trust.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] hover:border-[#e52020] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#e52020]/10 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-[#e52020]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">
                Discover Local Gems
              </h3>
              <p className="text-[#666666] leading-relaxed text-sm">
                Find hidden restaurants and popular spots. Filter by cuisine, rating, or location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#111111]">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-[#666666] max-w-2xl mx-auto">
              Start your food journey in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e52020] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">Create Your Account</h3>
              <p className="text-[#666666] text-sm">Sign up in seconds. Choose a unique handle so friends can find you.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e52020] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">Rate Your Meals</h3>
              <p className="text-[#666666] text-sm">Add reviews for dishes you try. Include photos, ratings, and your thoughts.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e52020] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">Connect & Discover</h3>
              <p className="text-[#666666] text-sm">Follow friends, join food groups, and discover new favorites together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-20 bg-[#F9F9F9]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#111111]">
              Loved by Food Enthusiasts
            </h2>
            <p className="text-base sm:text-lg text-[#666666]">
              See what our community has to say.
            </p>
          </div>

          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white p-6 sm:p-8 md:p-12 rounded-3xl border border-[#E5E5E5] shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{testimonials[currentTestimonial].image}</div>
                <div>
                  <h4 className="font-bold text-lg text-[#111111]">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-sm text-[#666666]">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#fba518] text-[#fba518]" />
                ))}
              </div>
              <p className="text-[#111111] text-lg leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </p>

              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="min-w-[44px] min-h-[44px] bg-[#F9F9F9] border border-[#E5E5E5] rounded-full flex items-center justify-center hover:border-[#e52020] active:scale-95 transition-all"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5 text-[#111111]" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial ? 'bg-[#e52020] w-6' : 'bg-[#E5E5E5]'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="min-w-[44px] min-h-[44px] bg-[#F9F9F9] border border-[#E5E5E5] rounded-full flex items-center justify-center hover:border-[#e52020] active:scale-95 transition-all"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5 text-[#111111]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#e52020]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to start your food journey?
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-10">
              Join thousands of food lovers who never forget a great meal.
            </p>

            <Link href="/sign-up" className="inline-block">
              <button className="px-10 min-h-[52px] bg-white text-[#e52020] rounded-full font-semibold text-base hover:bg-[#F9F9F9] active:scale-95 transition-all shadow-lg">
                Create Free Account
              </button>
            </Link>

            <p className="mt-6 text-white/70 text-sm">
              No credit card required. Start reviewing in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-[#E5E5E5]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <img src="/logo.svg" alt="Rusi Notes" className="w-8 h-8" />
                <span className="font-bold text-[#111111]">Rusi Notes</span>
              </div>
              <div className="flex gap-8 text-sm text-[#666666]">
                <Link href="/about" className="hover:text-[#111111] transition-colors">About</Link>
                <Link href="/privacy" className="hover:text-[#111111] transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-[#111111] transition-colors">Terms</Link>
                <Link href="/contact" className="hover:text-[#111111] transition-colors">Contact</Link>
              </div>
            </div>
            <div className="text-center mt-8 text-sm text-[#999999]">
              © 2026 Rusi Notes. Made with love for food lovers everywhere.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
