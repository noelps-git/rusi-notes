import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-[#00B14F] hover:bg-[#009944]',
            card: 'shadow-xl',
          },
        }}
        routing="path"
        path="/sign-in"
      />
    </div>
  );
}
