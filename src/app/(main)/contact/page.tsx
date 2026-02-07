'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to an API
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#111111] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#999999] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-[#999999] mb-8">
          Got questions, feedback, or just want to say hello? We'd love to hear from you!
        </p>

        {submitted ? (
          <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] p-8 text-center">
            <div className="w-16 h-16 bg-[#e52020]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-[#e52020]" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-[#999999]">
              Thanks for reaching out. We'll get back to you soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#e52020] transition-all"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#e52020] transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#e52020] transition-all"
                required
              >
                <option value="">Select a topic</option>
                <option value="general">General Inquiry</option>
                <option value="feedback">Feedback</option>
                <option value="bug">Report a Bug</option>
                <option value="business">Business Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#e52020] transition-all resize-none"
                placeholder="Tell us what's on your mind..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#e52020] text-white rounded-lg font-medium hover:opacity-90 transition-all"
            >
              <Send size={20} />
              Send Message
            </button>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-[#333333]">
          <h2 className="text-xl font-semibold text-white mb-4">Other Ways to Reach Us</h2>
          <div className="flex items-center gap-3 text-[#999999]">
            <Mail size={20} className="text-[#e52020]" />
            <a href="mailto:hello@rusinotes.com" className="hover:text-white transition-colors">
              hello@rusinotes.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
