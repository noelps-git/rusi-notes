# Fix Google OAuth - Step by Step

## The Problem
You're getting "Error 400: invalid_request" because Google OAuth credentials are not configured.

## Quick Fix (5 minutes)

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### Step 2: Create a New Project (or use existing)
1. Click the project dropdown at the top
2. Click "NEW PROJECT"
3. Name it: **Taste Food App**
4. Click "CREATE"
5. Wait for it to create, then select the project

### Step 3: Enable Google+ API
1. In the left sidebar, click **APIs & Services** → **Library**
2. Search for: **Google+ API**
3. Click on it
4. Click **ENABLE**

### Step 4: Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** at the top
3. Select **OAuth client ID**
4. If prompted to configure consent screen:
   - Click **CONFIGURE CONSENT SCREEN**
   - Choose **External**
   - Click **CREATE**
   - Fill in:
     - App name: **Taste**
     - User support email: **your-email@gmail.com**
     - Developer contact: **your-email@gmail.com**
   - Click **SAVE AND CONTINUE**
   - Skip "Scopes" (click **SAVE AND CONTINUE**)
   - Skip "Test users" (click **SAVE AND CONTINUE**)
   - Click **BACK TO DASHBOARD**

5. Go back to **Credentials** → **+ CREATE CREDENTIALS** → **OAuth client ID**
6. Application type: **Web application**
7. Name: **Taste Web Client**
8. **Authorized JavaScript origins**:
   - Click **+ ADD URI**
   - Add: `http://localhost:3001`
9. **Authorized redirect URIs**:
   - Click **+ ADD URI**
   - Add: `http://localhost:3001/api/auth/callback/google`
10. Click **CREATE**

### Step 5: Copy Your Credentials
You'll see a popup with:
- **Your Client ID** (looks like: 123456789-abc123.apps.googleusercontent.com)
- **Your Client Secret** (looks like: GOCSPX-abc123xyz)

**Copy both of these!**

### Step 6: Add to Your .env.local File
Open `/Users/noelps/taste/.env.local` and replace the empty values:

```bash
# Google OAuth (Optional - See GOOGLE_OAUTH_SETUP.md for instructions)
GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
```

### Step 7: Restart Your Dev Server
1. Stop the server (Ctrl+C in terminal)
2. Start it again: `npm run dev`

### Step 8: Test Google Sign In
1. Go to: http://localhost:3001/signup
2. Click **Continue with Google**
3. Choose your Google account
4. Should work! ✅

---

## Important URLs to Configure

For **local development**:
- JavaScript origins: `http://localhost:3001`
- Redirect URI: `http://localhost:3001/api/auth/callback/google`

When you **deploy to production** (later):
- JavaScript origins: `https://your-domain.com`
- Redirect URI: `https://your-domain.com/api/auth/callback/google`

---

## Common Issues

### "Error 400: redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches:
  `http://localhost:3001/api/auth/callback/google`
- No trailing slash
- Check the port number (3001 not 3000)

### "Error 401: invalid_client"
- Your Client ID or Secret is wrong
- Copy them again from Google Console
- Make sure no extra spaces in .env.local

### "Error 403: access_denied"
- The OAuth consent screen is not configured
- Go back to Step 4 and configure it

---

## Visual Guide

```
Google Cloud Console
├── Select Project (or Create New)
├── APIs & Services
│   ├── Library → Enable Google+ API
│   ├── OAuth consent screen → Configure
│   └── Credentials → Create OAuth Client ID
│       ├── JavaScript origins: http://localhost:3001
│       └── Redirect URIs: http://localhost:3001/api/auth/callback/google
└── Copy Client ID and Secret to .env.local
```

---

## Need Help?

If you're still stuck:
1. Make sure you selected the right project in Google Cloud Console
2. Check that Google+ API is enabled
3. Verify the redirect URI has no typos
4. Restart your dev server after changing .env.local

The error should be gone after these steps! 🎉
