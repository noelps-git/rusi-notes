import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-10 text-8xl">🍛</div>
        <div className="absolute top-40 left-20 text-7xl">🍜</div>
        <div className="absolute bottom-32 right-1/4 text-9xl">🍚</div>
        <div className="absolute top-1/3 left-1/3 text-6xl">🌶️</div>
        <div className="absolute bottom-20 left-10 text-8xl">☕</div>
        <div className="absolute top-1/2 right-20 text-7xl">🥘</div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00B14F]/10 via-transparent to-[#00B14F]/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo.svg" alt="Rusi Notes" className="w-12 h-12" />
            <span className="text-2xl font-bold text-white">Rusi Notes</span>
          </div>
          <p className="text-[#999999] text-sm">Join the foodie community!</p>
        </div>

        {/* Clerk Sign Up */}
        <SignUp
          afterSignUpUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-[#00B14F] hover:bg-[#009944]',
              card: 'bg-[#1E1E1E] border border-[#333333]',
              headerTitle: 'text-white',
              headerSubtitle: 'text-[#999999]',
              socialButtonsBlockButton: 'bg-[#2A2A2A] border-[#333333] text-white hover:bg-[#333333]',
              formFieldLabel: 'text-[#999999]',
              formFieldInput: 'bg-[#2A2A2A] border-[#333333] text-white',
              footerActionLink: 'text-[#00B14F] hover:text-[#00D65F]',
              dividerLine: 'bg-[#333333]',
              dividerText: 'text-[#666666]',
            },
          }}
        />
      </div>
    </div>
  );
}
