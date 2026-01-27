# Clerk Setup with Google Sign-In

## 1. Create a Clerk Account

1. Go to https://clerk.com
2. Sign up for a free account
3. Create a new application

## 2. Enable Google OAuth

1. In your Clerk Dashboard, go to **"Configure" → "SSO Connections"**
2. Click on **"Google"**
3. Toggle **"Enable Google"** to ON
4. Clerk will provide you with:
   - Redirect URI (copy this)

5. Go to **Google Cloud Console** (https://console.cloud.google.com):
   - Create a new project or select existing
   - Go to **"APIs & Services" → "Credentials"**
   - Click **"Create Credentials" → "OAuth 2.0 Client ID"**
   - Application type: **Web application**
   - Add the Clerk redirect URI to **"Authorized redirect URIs"**
   - Click **Create**
   - Copy the **Client ID** and **Client Secret**

6. Back in Clerk Dashboard:
   - Paste Google **Client ID**
   - Paste Google **Client Secret**
   - Click **Save**

## 3. Get Clerk API Keys

1. In Clerk Dashboard, go to **"Configure" → "API Keys"**
2. Copy the following keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

## 4. Update Environment Variables

Add these to your `.env.local` file:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk Sign-in/Sign-up URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 5. Deploy to Vercel

Add the same environment variables in Vercel:
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add all Clerk variables
4. Redeploy

## 6. Test Google Sign-In

1. Go to your app
2. Click "Sign In" or "Sign Up"
3. You should see Google OAuth button
4. Click it to authenticate with Google

## Changes Made

✅ Installed @clerk/nextjs
✅ Replaced NextAuth SessionProvider with ClerkProvider
✅ Created new sign-in page at /sign-in
✅ Created new sign-up page at /sign-up
✅ Updated middleware to use Clerk auth
✅ Reduced welcome popup size (max-w-md instead of max-w-lg)

## Next Steps

1. Set up Clerk account and get API keys
2. Enable Google OAuth in Clerk
3. Add environment variables
4. Update Header/navigation to use Clerk's useUser() hook
5. Remove old NextAuth files and dependencies
