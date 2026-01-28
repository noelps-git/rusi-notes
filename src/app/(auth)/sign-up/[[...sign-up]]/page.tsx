import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111]">
      <SignUp afterSignUpUrl="/dashboard" />
    </div>
  );
}
