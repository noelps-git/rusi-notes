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
      role: 'IT Professional & Foodie',
      image: '🦁',
      content: 'Vera Level! Just like Thala\'s 183*, this app hits different da. I can finally remember which biryani made me say "Naan Oru Thadava Sonna..." Never miss a mass dish again!',
      rating: 5,
    },
    {
      name: 'Meme Lord',
      role: 'Content Creator',
      image: '😎',
      content: 'Semma Mass! Found my comfort food faster than Vadivelu finds comedy. "Ennada Ippadi Panringa" moment when I saw all my friends\' reviews in one place! Chennai foodies ku must-use! 💯',
      rating: 5,
    },
    {
      name: 'Foodie Akka',
      role: 'Restaurant Owner',
      image: '👩‍🍳',
      content: 'Konjam Konjama customers ippo romba reviews kudukuranga! Business ku Rusi Notes is like "Kannu Kalasalada" - always watching what works! Viral-ah trending agudhu! 📈',
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
    <div className="bg-[#111111] text-white font-['Inter',sans-serif]">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/95 backdrop-blur-md border-b border-[#333333]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0009FF] rounded-lg flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <span className="text-xl font-bold text-white">Rusi Notes</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[#999999] hover:text-white transition-colors font-medium">Features</a>
              <a href="#testimonials" className="text-[#999999] hover:text-white transition-colors font-medium">Reviews</a>
              <Link href="/login" className="text-[#999999] hover:text-white transition-colors font-medium">Sign In</Link>
              <Link href="/signup">
                <button className="px-8 h-12 bg-[#0009FF] text-white rounded-[100px] font-medium hover:opacity-90 transition-all">
                  Sign Up Free
                </button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-[#333333]">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-[#999999] hover:text-white transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#testimonials" className="text-[#999999] hover:text-white transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
                <Link href="/login" className="text-[#999999] hover:text-white transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-8 h-12 bg-[#0009FF] text-white rounded-[100px] font-medium">
                    Sign Up Free
                  </button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16 bg-[#111111]">
        {/* Animated background with blur effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-[#0009FF] rounded-full opacity-10 blur-[64px] -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-[700px] h-[700px] bg-[#0009FF] rounded-full opacity-5 blur-[64px] top-1/2 -right-48 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute w-[500px] h-[500px] bg-[#0009FF] rounded-full opacity-10 blur-[64px] -bottom-48 left-1/2 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1E1E] border border-[#333333] rounded-[100px] mb-10">
              <span className="text-2xl">🔥</span>
              <span className="text-sm font-medium text-[#999999]">Semma Rusi, Vera Level Reviews!</span>
            </div>

            {/* Headline - Tamil Meme Style */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight">
              <span className="block mb-4 text-white">Saapadu Review</span>
              <span className="block mb-4 text-white">Podalam! 🍛</span>
              <span className="block text-[#0009FF]">
                Vera Level Insights
              </span>
            </h1>

            {/* Subheadline - Tamil Meme Content */}
            <p className="text-lg md:text-xl text-[#999999] mb-12 leading-relaxed max-w-3xl mx-auto font-normal">
              <span className="text-[#0009FF] font-semibold">"Naan Oru Thadava Sonna..."</span> that biryani was mass?
              <span className="block mt-2">Track it with Rusi Notes! 🎯 Chennai-la best dishes-ah kandu pudichitu share pannunga!</span>
              <span className="block mt-2 text-base">😋 Vadivelu-style comedy illa, serious reviews mattum! 💯</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/signup">
                <button className="px-8 h-12 bg-[#0009FF] text-white rounded-[100px] font-medium text-lg hover:opacity-90 transition-all shadow-[0_16px_64px_rgba(0,9,255,0.3)]">
                  Free-ah Start Pannu! 🚀
                </button>
              </Link>
              <Link href="#features">
                <button className="px-8 h-12 bg-transparent border-2 border-[#333333] text-white rounded-[100px] font-medium text-lg hover:border-white/80 transition-all">
                  Epdi Work Agudhu? 🤔
                </button>
              </Link>
            </div>

            {/* Social Proof - Tamil Style */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[#999999]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🦁</span>
                <span className="font-medium">10,000+ Thala Fans</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🍛</span>
                <span className="font-medium">50,000+ Mass Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🏪</span>
                <span className="font-medium">1,000+ Hotels</span>
              </div>
            </div>

            {/* Trust Badges - Tamil Theme */}
            <div className="mt-16 flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-[#1E1E1E] border border-[#333333] rounded-2xl">
                <span className="text-sm font-medium text-[#999999]">💯 Vadivelu Approved</span>
              </div>
              <div className="px-6 py-3 bg-[#1E1E1E] border border-[#333333] rounded-2xl">
                <span className="text-sm font-medium text-[#999999]">🎬 Mass Cinema Level</span>
              </div>
              <div className="px-6 py-3 bg-[#1E1E1E] border border-[#333333] rounded-2xl">
                <span className="text-sm font-medium text-[#999999]">🔥 Trending in TN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#0E0E0E]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
              <span className="block mb-2">🎭 Yen da Ipdi Panringa? 🎭</span>
              Foodies Choose
              <span className="block text-[#0009FF]">
                Rusi Notes
              </span>
            </h2>
            <p className="text-xl text-[#999999] max-w-2xl mx-auto font-normal">
              <span className="text-white">Mass-ah</span> saapadu track pannu,
              <span className="text-[#0009FF]"> Thala-style</span> share pannu! 🔥
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 - Tamil Meme Theme */}
            <div className="group relative bg-[#1E1E1E] p-8 rounded-2xl border border-[#333333] hover:border-[#0009FF] transition-all shadow-[0_16px_64px_rgba(0,0,0,0.5)]">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#0009FF]/20 rounded-2xl flex items-center justify-center mb-6 text-4xl">
                  🍛
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Dish-by-Dish Reviews
                </h3>
                <p className="text-[#999999] leading-relaxed font-normal">
                  <span className="font-semibold text-white">"Innum konjam masala bro!"</span> - Every dish-ku separate review!
                  Just hotels-ah illa, each item-ku ratings. <span className="text-[#0009FF]">Vera level precision! 🎯</span>
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-2xl">🌶️</span>
                  <span className="text-2xl">💯</span>
                </div>
              </div>
            </div>

            {/* Feature 2 - Tamil Meme Theme */}
            <div className="group relative bg-[#1E1E1E] p-8 rounded-2xl border border-[#333333] hover:border-[#0009FF] transition-all shadow-[0_16px_64px_rgba(0,0,0,0.5)]">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#0009FF]/20 rounded-2xl flex items-center justify-center mb-6 text-4xl">
                  👥
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Nanba Gang Connect
                </h3>
                <p className="text-[#999999] leading-relaxed font-normal">
                  <span className="font-semibold text-white">"Machan, anga poi try pannu!"</span> - Your friends' reviews matter!
                  Follow nanbas, share finds, group-la discuss! <span className="text-[#0009FF]">Mass collaboration! 🤝</span>
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="text-2xl">🦁</span>
                  <span className="text-2xl">🤜</span>
                  <span className="text-2xl">🤛</span>
                </div>
              </div>
            </div>

            {/* Feature 3 - Tamil Meme Theme */}
            <div className="group relative bg-[#1E1E1E] p-8 rounded-2xl border border-[#333333] hover:border-[#0009FF] transition-all shadow-[0_16px_64px_rgba(0,0,0,0.5)]">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#0009FF]/20 rounded-2xl flex items-center justify-center mb-6 text-4xl">
                  📱
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Viral-ah Share Pannu
                </h3>
                <p className="text-[#999999] leading-relaxed font-normal">
                  <span className="font-semibold text-white">"Status-la poda perfect!"</span> - Collections create pannu,
                  Instagram-style share! Chennai hidden gems ellam kandu pudichiru! <span className="text-[#0009FF]">Mass reach! 📢</span>
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="text-2xl">🔥</span>
                  <span className="text-2xl">💪</span>
                  <span className="text-2xl">🎬</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features - Tamil Theme */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="flex items-start gap-4 p-6 bg-[#1E1E1E] rounded-2xl border border-[#333333] hover:border-[#0009FF] transition-all">
              <span className="text-3xl flex-shrink-0">🍕</span>
              <div>
                <h4 className="font-bold mb-1 text-white">Nanba Gang Voting 🗳️</h4>
                <p className="text-sm text-[#999999] font-normal">
                  <span className="text-[#0009FF]">"Ena saapdalaam?"</span> - Group-la vote panni decide pannu!
                  Democracy in food! 😄
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-[#1E1E1E] rounded-2xl border border-[#333333] hover:border-[#0009FF] transition-all">
              <span className="text-3xl flex-shrink-0">📈</span>
              <div>
                <h4 className="font-bold mb-1 text-white">Trending-la Iruka! 🔥</h4>
                <p className="text-sm text-[#999999] font-normal">
                  <span className="text-[#0009FF]">"Ippo enna viral?"</span> - Chennai-la trending dishes ellam one place-la!
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-[#1E1E1E] rounded-2xl border border-[#333333] hover:border-[#0009FF] transition-all">
              <span className="text-3xl flex-shrink-0">🏆</span>
              <div>
                <h4 className="font-bold mb-1 text-white">Your Food Stats 📊</h4>
                <p className="text-sm text-[#999999] font-normal">
                  <span className="text-[#0009FF]">"Enaku 183* reviews!"</span> - Thala-style statistics track pannu!
                </p>
              </div>
            </div>
          </div>

          {/* Meme Culture Section */}
          <div className="mt-24 max-w-4xl mx-auto">
            <div className="bg-[#1E1E1E] p-10 rounded-2xl border border-[#333333] shadow-[0_16px_64px_rgba(0,0,0,0.5)]">
              <div className="text-center mb-6">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  <span className="text-5xl block mb-4">🎬</span>
                  Kadavul Irukaan Kumaru!
                </h3>
                <p className="text-[#999999] text-lg font-normal">
                  Chennai-la best saapadu ellam oru app-la! <span className="text-[#0009FF] font-bold">Mass level organization!</span>
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="text-center p-4 bg-[#111111] rounded-2xl border border-[#333333]">
                  <div className="text-3xl mb-2">🦁</div>
                  <div className="text-sm text-[#999999]">Thala Style</div>
                </div>
                <div className="text-center p-4 bg-[#111111] rounded-2xl border border-[#333333]">
                  <div className="text-3xl mb-2">😂</div>
                  <div className="text-sm text-[#999999]">Vadivelu Vibes</div>
                </div>
                <div className="text-center p-4 bg-[#111111] rounded-2xl border border-[#333333]">
                  <div className="text-3xl mb-2">🎭</div>
                  <div className="text-sm text-[#999999]">Mass Moments</div>
                </div>
                <div className="text-center p-4 bg-[#111111] rounded-2xl border border-[#333333]">
                  <div className="text-3xl mb-2">💪</div>
                  <div className="text-sm text-[#999999]">Thalaivar Power</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="testimonials" className="py-24 bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
              Loved by Food Enthusiasts
            </h2>
            <p className="text-xl text-[#999999] font-normal">See what our Nanba gang is saying</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="bg-[#1E1E1E] p-8 md:p-12 rounded-2xl border border-[#333333] shadow-[0_16px_64px_rgba(0,0,0,0.5)]">
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-[#0009FF] fill-[#0009FF]" />
                ))}
              </div>

              {/* Content */}
              <p className="text-xl md:text-2xl text-white text-center mb-8 leading-relaxed font-normal">
                "{testimonials[currentTestimonial].content}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-[#0009FF] rounded-full flex items-center justify-center text-3xl">
                  {testimonials[currentTestimonial].image}
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg text-white">{testimonials[currentTestimonial].name}</div>
                  <div className="text-[#999999] text-sm font-normal">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-[#1E1E1E] border-2 border-[#333333] rounded-full flex items-center justify-center hover:border-[#0009FF] transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentTestimonial
                        ? 'bg-[#0009FF] w-8'
                        : 'bg-[#333333] w-2 hover:bg-[#0009FF]'
                    }`}
                  ></button>
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-[#1E1E1E] border-2 border-[#333333] rounded-full flex items-center justify-center hover:border-[#0009FF] transition-all"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <section className="py-24 bg-[#0E0E0E]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#1E1E1E] p-12 rounded-2xl border border-[#333333] shadow-[0_16px_64px_rgba(0,0,0,0.5)]">
              <div className="text-center mb-8">
                <div className="text-6xl mb-6">🚀</div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
                  <span className="block mb-2">Vera Level Journey-ku</span>
                  <span className="text-[#0009FF]">Ready-ah?</span>
                </h2>
                <p className="text-xl text-[#999999] font-normal">
                  <span className="text-white font-bold">10,000+ foodies</span> already joined!
                  <span className="block mt-2">
                    <span className="text-2xl">🦁</span> "Naan Oru Thadava Join Pannitten..." - then lifetime memories!
                  </span>
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email-ah poduda nanba!"
                      required
                      className="flex-1 px-6 h-12 bg-[#111111] border-2 border-[#333333] rounded-[100px] text-white placeholder-[#999999] focus:outline-none focus:border-[#0009FF] transition-all font-['Inter',sans-serif]"
                    />
                    <button
                      type="submit"
                      className="px-8 h-12 bg-[#0009FF] text-white rounded-[100px] font-medium hover:opacity-90 transition-all whitespace-nowrap"
                    >
                      Start Pannu! 🔥
                    </button>
                  </div>
                  <p className="text-sm text-[#999999] text-center font-normal">
                    💯 Free-ah start pannu • No credit card • No tension!
                  </p>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600/20 border-2 border-green-500 rounded-2xl">
                  <Check className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-medium flex items-center gap-2">
                    Mass! Redirecting... <span className="text-xl">🎉</span>
                  </span>
                </div>
              )}

              <div className="mt-10 grid grid-cols-3 gap-8 pt-8 border-t border-[#333333]">
                <div className="text-center">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="text-sm font-medium text-[#999999]">Instant Access</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="text-sm font-medium text-[#999999]">Safe & Secure</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-sm font-medium text-[#999999]">Lightning Fast</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] border-t border-[#333333]">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#0009FF] rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
                </div>
                <span className="text-xl font-bold text-white">Rusi Notes</span>
              </div>
              <p className="text-[#999999] text-sm font-normal">
                Your personal dish review companion. Remember every great meal.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2 text-sm text-[#999999] font-normal">
                <li><Link href="/features" className="hover:text-[#0009FF] transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-[#0009FF] transition-colors">Pricing</Link></li>
                <li><Link href="/restaurants" className="hover:text-[#0009FF] transition-colors">Browse Restaurants</Link></li>
                <li><Link href="/signup" className="hover:text-[#0009FF] transition-colors">Sign Up</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-sm text-[#999999] font-normal">
                <li><Link href="/about" className="hover:text-[#0009FF] transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-[#0009FF] transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-[#0009FF] transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-[#0009FF] transition-colors">Careers</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2 text-sm text-[#999999] font-normal">
                <li><Link href="/privacy" className="hover:text-[#0009FF] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#0009FF] transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-[#0009FF] transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#333333] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#999999] font-normal">
              © 2024 Rusi Notes. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-[#999999] hover:text-[#0009FF] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-[#999999] hover:text-[#0009FF] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-[#999999] hover:text-[#0009FF] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
