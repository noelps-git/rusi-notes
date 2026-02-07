import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rusi Notes - Your Personal Food Journal",
  description: "Track your favorite dishes, share reviews with friends, and discover amazing restaurants. Join thousands of food lovers on their culinary journey.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#e52020',
          colorTextOnPrimaryBackground: '#ffffff',
        },
        elements: {
          formButtonPrimary: 'bg-[#e52020] hover:bg-[#c41a1a]',
          footerActionLink: 'text-[#e52020] hover:text-[#c41a1a]',
        },
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} font-sans antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
