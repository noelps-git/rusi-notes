import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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

        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-[#CCCCCC]">
          <p className="text-lg">
            At Rusi Notes, we take your privacy seriously. This policy explains how we
            collect, use, and protect your information.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8">Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information (name, email, profile photo)</li>
            <li>Content you create (reviews, photos, comments)</li>
            <li>Usage data (pages visited, features used)</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and improve our services</li>
            <li>To personalize your experience</li>
            <li>To communicate with you about updates</li>
            <li>To ensure platform safety and security</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8">Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share data with service
            providers who help us operate the platform (e.g., hosting, authentication).
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8">Your Rights</h2>
          <p>
            You can request access to, correction of, or deletion of your personal data
            by contacting us. You can also delete your account at any time.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8">Contact Us</h2>
          <p>
            Questions about privacy? Reach out at{' '}
            <a href="mailto:privacy@rusinotes.com" className="text-[#e52020] hover:underline">
              privacy@rusinotes.com
            </a>
          </p>

          <p className="text-sm text-[#666666] mt-12">
            Last updated: February 2026
          </p>
        </div>
      </div>
    </div>
  );
}
