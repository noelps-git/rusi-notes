import { auth } from '@/lib/auth/auth';

export default auth((req) => {
  // Middleware logic is handled by authConfig.authorized callback
  // This is just a wrapper to enable the middleware
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
