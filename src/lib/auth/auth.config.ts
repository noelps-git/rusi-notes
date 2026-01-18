import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import type { UserRole } from '@/types/auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup');
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnBusiness = nextUrl.pathname.startsWith('/business');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      // If on auth pages and logged in, redirect to appropriate dashboard
      if (isOnAuth && isLoggedIn) {
        const role = auth.user.role as UserRole;
        if (role === 'admin') {
          return Response.redirect(new URL('/admin/dashboard', nextUrl));
        } else if (role === 'business') {
          return Response.redirect(new URL('/business/dashboard', nextUrl));
        }
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // Redirect logic based on role for protected routes
      if (isOnBusiness && auth?.user?.role !== 'business') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      if (isOnAdmin && auth?.user?.role !== 'admin') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // Require login for dashboard pages
      if (isOnDashboard || isOnBusiness || isOnAdmin) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      // Add role and user info to JWT token
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user'; // Default to user role for OAuth
        token.email = user.email;
        token.name = user.name;

        // For OAuth users, create user in database if doesn't exist
        if (account?.provider === 'google') {
          const supabase = await createClient();
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

          if (!existingUser) {
            // Create new user with OAuth
            await supabase.from('users').insert({
              email: user.email,
              full_name: user.name || '',
              avatar_url: user.image,
              role: 'user', // Default role for OAuth users
              password_hash: '', // No password for OAuth users
              email_verified: true,
            });
          } else {
            token.role = existingUser.role;
            token.id = existingUser.id;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add role and user info to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const supabase = await createClient();

        // Query user from Supabase
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (error || !user) {
          return null;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );

        if (!isValidPassword) {
          return null;
        }

        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.full_name,
          role: user.role,
          image: user.avatar_url,
        };
      },
    }),
  ],
};
