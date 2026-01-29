import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/business(.*)',
  '/admin(.*)',
  '/notes(.*)',
  '/groups(.*)',
  '/bookmarks(.*)',
  '/friends(.*)',
  '/onboarding(.*)',
  '/profile(.*)',
]);

// Routes that require handle to be set (excludes onboarding itself)
const requiresHandle = createRouteMatcher([
  '/dashboard(.*)',
  '/business(.*)',
  '/admin(.*)',
  '/notes(.*)',
  '/groups(.*)',
  '/bookmarks(.*)',
  '/friends(.*)',
  '/profile(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Check if user needs to complete onboarding (set their handle)
  const authResult = await auth();
  const { userId, sessionClaims } = authResult;

  if (userId && requiresHandle(req)) {
    // Check publicMetadata from session claims
    // In Clerk, publicMetadata can be accessed via sessionClaims.public_metadata or sessionClaims.metadata
    const publicMetadata = (sessionClaims as any)?.public_metadata ||
                           (sessionClaims as any)?.publicMetadata ||
                           (sessionClaims as any)?.metadata;

    const hasHandle = publicMetadata?.hasHandle === true;

    // If user doesn't have a handle, redirect to onboarding
    if (!hasHandle) {
      const onboardingUrl = new URL('/onboarding', req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
