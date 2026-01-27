import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-[#00B14F] hover:bg-[#009944]',
            card: 'shadow-xl',
          },
        }}
        routing="path"
        path="/sign-up"
      />
    </div>
  );
}
