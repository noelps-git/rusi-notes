import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 text-8xl">🍛</div>
        <div className="absolute top-40 right-20 text-7xl">🍜</div>
        <div className="absolute bottom-32 left-1/4 text-9xl">🍚</div>
        <div className="absolute top-1/3 right-1/3 text-6xl">🌶️</div>
        <div className="absolute bottom-20 right-10 text-8xl">☕</div>
        <div className="absolute top-1/2 left-20 text-7xl">🥘</div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e52020]/20 via-transparent to-[#e52020]/10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
