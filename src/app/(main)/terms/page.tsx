import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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

        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-[#CCCCCC]">
          <p className="text-lg">
            Welcome to Rusi Notes! By using our service, you agree to these terms.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8">1. Use of Service</h2>
          <p>
            Rusi Notes is a food review platform for sharing your dining experiences.
            You must be at least 13 years old to use this service.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8">2. User Content</h2>
          <p>
            You retain ownership of the content you post. By posting reviews, photos,
            and comments, you grant us a license to display this content on our platform.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8">3. Community Guidelines</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be respectful to other users and restaurants</li>
            <li>Post honest and genuine reviews</li>
            <li>Do not post spam or misleading content</li>
            <li>Do not harass or bully other users</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8">4. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our{' '}
            <Link href="/privacy" className="text-[#e52020] hover:underline">
              Privacy Policy
            </Link>{' '}
            for information on how we collect and use your data.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8">5. Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the service
            constitutes acceptance of any changes.
          </p>

          <p className="text-sm text-[#666666] mt-12">
            Last updated: February 2026
          </p>
        </div>
      </div>
    </div>
  );
}
