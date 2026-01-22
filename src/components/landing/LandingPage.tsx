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
  X
} from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const testimonials = [
    {
      name: 'Thala Fan',
      role: 'Foodie',
      image: '🦁',
      content: 'Vera Level! Best biryani tracker.',
      rating: 5,
    },
    {
      name: 'Meme Lord',
      role: 'Creator',
      image: '😎',
      content: 'Semma app! All friends reviews one place.',
      rating: 5,
    },
    {
      name: 'Foodie Akka',
      role: 'Owner',
      image: '👩‍🍳',
      content: 'Business ku super useful!',
      rating: 5,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = '/signup';
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
              <div className="w-10 h-10 bg-[#00B14F] rounded-xl flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <span className="text-xl font-bold text-[#111111]">Rusi Notes</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[#666666] hover:text-[#111111] transition-colors font-medium text-sm">Features</a>
              <a href="#reviews" className="text-[#666666] hover:text-[#111111] transition-colors font-medium text-sm">Reviews</a>
              <Link href="/login" className="text-[#666666] hover:text-[#111111] transition-colors font-medium text-sm">Sign In</Link>
              <Link href="/signup">
                <button className="px-6 h-11 bg-[#00B14F] text-white rounded-full font-medium text-sm hover:bg-[#009944] transition-all">
                  Sign Up
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
                <a href="#reviews" className="text-[#666666] hover:text-[#111111] transition-colors font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
                <Link href="/login" className="text-[#666666] hover:text-[#111111] transition-colors font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-6 h-11 bg-[#00B14F] text-white rounded-full font-medium text-sm">
                    Sign Up
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5F5F5] rounded-full mb-8">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-medium text-[#666666]">Chennai's #1 Food App</span>
            </div>

            {/* Headline - Minimalistic */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-[#111111]">
              Track every dish.<br />
              <span className="text-[#00B14F]">Share with nanbas.</span>
            </h1>

            {/* Subheadline - Minimal */}
            <p className="text-lg md:text-xl text-[#666666] mb-10 leading-relaxed max-w-2xl mx-auto">
              Remember that mass biryani? Rate it. Share it. Find more. 🍛
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/signup">
                <button className="px-8 h-14 bg-[#00B14F] text-white rounded-full font-semibold text-base hover:bg-[#009944] transition-all shadow-lg">
                  Get Started
                </button>
              </Link>
              <Link href="#features">
                <button className="px-8 h-14 bg-white border-2 border-[#E5E5E5] text-[#111111] rounded-full font-semibold text-base hover:border-[#00B14F] transition-all">
                  Learn More
                </button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[#666666]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🦁</span>
                <span className="font-medium">10K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🍛</span>
                <span className="font-medium">50K+ Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🏪</span>
                <span className="font-medium">1K+ Restaurants</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#F9F9F9]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#111111]">
              Why Rusi Notes?
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Track. Rate. Share. Simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-[#E5E5E5] hover:border-[#00B14F] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#00B14F]/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                🍛
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">
                Dish Reviews
              </h3>
              <p className="text-[#666666] leading-relaxed text-sm">
                Rate every dish separately. Remember the best ones.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-[#E5E5E5] hover:border-[#00B14F] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#00B14F]/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                👥
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">
                Friends Network
              </h3>
              <p className="text-[#666666] leading-relaxed text-sm">
                See what your nanbas are eating. Trust their reviews.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-[#E5E5E5] hover:border-[#00B14F] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#00B14F]/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                📍
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">
                Chennai Focused
              </h3>
              <p className="text-[#666666] leading-relaxed text-sm">
                T. Nagar to OMR. All your favorite spots covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#111111]">
              What Users Say
            </h2>
            <p className="text-lg text-[#666666]">
              Vera Level Reviews 🔥
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-[#F9F9F9] p-8 md:p-12 rounded-3xl border border-[#E5E5E5]">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{testimonials[currentTestimonial].image}</div>
                <div>
                  <h4 className="font-bold text-lg text-[#111111]">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-sm text-[#666666]">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#00B14F] text-[#00B14F]" />
                ))}
              </div>
              <p className="text-[#111111] text-lg leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </p>

              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 bg-white border border-[#E5E5E5] rounded-full flex items-center justify-center hover:border-[#00B14F] transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-[#111111]" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial ? 'bg-[#00B14F] w-6' : 'bg-[#E5E5E5]'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 bg-white border border-[#E5E5E5] rounded-full flex items-center justify-center hover:border-[#00B14F] transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-[#111111]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#00B14F]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Start tracking today
            </h2>
            <p className="text-lg text-white/80 mb-10">
              Join thousands of foodies in Chennai 🦁
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 px-6 h-14 bg-white text-[#111111] rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-[#999999]"
                    required
                  />
                  <button
                    type="submit"
                    className="px-8 h-14 bg-[#111111] text-white rounded-full font-semibold hover:bg-[#222222] transition-all"
                  >
                    Get Started
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 py-4">
                <Check className="w-6 h-6 text-white" />
                <span className="text-white font-medium">Redirecting...</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-[#E5E5E5]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00B14F] rounded-lg flex items-center justify-center">
                  <span className="text-xl">🍽️</span>
                </div>
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
              © 2026 Rusi Notes. Built for Chennai foodies 🦁
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
