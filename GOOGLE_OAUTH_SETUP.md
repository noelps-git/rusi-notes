# Google OAuth Setup Guide

Follow these steps to enable "Sign in with Google" functionality in your Taste app.

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**:
   - Click the project dropdown at the top
   - Click "NEW PROJECT"
   - Project name: `Taste Chennai`
   - Click "CREATE"

3. **Wait for project creation** (takes ~30 seconds)

## Step 2: Enable Google+ API

1. In your new project, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and click **ENABLE**

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**

2. **Choose User Type**:
   - Select **External** (for public users)
   - Click **CREATE**

3. **Fill in App Information**:
   - **App name**: `Taste - Chennai Food Discovery`
   - **User support email**: Your email
   - **App logo**: (Optional - upload later)
   - **App domain**: Leave blank for now (add when deployed)
   - **Developer contact email**: Your email
   - Click **SAVE AND CONTINUE**

4. **Scopes**:
   - Click **ADD OR REMOVE SCOPES**
   - Select these scopes:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Click **UPDATE**
   - Click **SAVE AND CONTINUE**

5. **Test users** (for development):
   - Click **ADD USERS**
   - Add your Gmail address
   - Click **ADD**
   - Click **SAVE AND CONTINUE**

6. **Summary**:
   - Review and click **BACK TO DASHBOARD**

## Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**

2. Click **CREATE CREDENTIALS** → **OAuth client ID**

3. **Configure**:
   - **Application type**: Web application
   - **Name**: `Taste Web Client`

4. **Authorized JavaScript origins**:
   - Click **ADD URI**
   - Add: `http://localhost:3001`
   - (Later add your production domain)

5. **Authorized redirect URIs**:
   - Click **ADD URI**
   - Add: `http://localhost:3001/api/auth/callback/google`
   - (Later add your production callback URL)

6. Click **CREATE**

7. **Copy Your Credentials**:
   - You'll see a modal with:
     - **Client ID** (looks like: `123456789-abc...xyz.apps.googleusercontent.com`)
     - **Client secret** (looks like: `GOCSPX-abc123...`)
   - **IMPORTANT**: Copy these now!

## Step 5: Add Credentials to Your App

1. **Open `.env.local` file** in your project

2. **Update these lines**:
   ```bash
   GOOGLE_CLIENT_ID=paste-your-client-id-here
   GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
   ```

3. **Save the file**

## Step 6: Restart Your Dev Server

1. Stop the current dev server (Ctrl+C)
2. Restart: `npm run dev`
3. The server should start without errors

## Step 7: Test Google Sign-In

1. **Go to**: http://localhost:3001/signup

2. **Click "Continue with Google"**

3. **You should see**:
   - Google account selection screen
   - Permission request (email, profile)
   - After accepting, redirected to dashboard

4. **Verify**:
   - Check if you're logged in
   - Your Google profile picture should appear
   - Dashboard should load correctly

## Troubleshooting

### Error: "Access blocked: This app's request is invalid"
**Solution**: Make sure you added `http://localhost:3001` to **Authorized JavaScript origins**

### Error: "redirect_uri_mismatch"
**Solution**: Double-check the redirect URI is exactly:
```
http://localhost:3001/api/auth/callback/google
```

### Error: "Admin policy enforced"
**Solution**:
- Go back to OAuth consent screen
- Make sure your test user (your Gmail) is added under "Test users"
- Or publish the app (takes a few days for Google review)

### Google button doesn't work
**Solutions**:
1. Check `.env.local` has both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Make sure there are no extra spaces or quotes
3. Restart the dev server after adding credentials

### User created but no role assigned
- OAuth users are automatically assigned "user" role
- Businesses should sign up with email/password for verification

## For Production Deployment

When deploying to Vercel or another host:

1. **Update OAuth consent screen**:
   - Add your production domain (e.g., `taste.vercel.app`)

2. **Update OAuth credentials**:
   - Add production origin: `https://taste.vercel.app`
   - Add production callback: `https://taste.vercel.app/api/auth/callback/google`

3. **Update Vercel environment variables**:
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - Update `NEXTAUTH_URL` to your production URL

## Security Notes

1. **Never commit** `.env.local` to Git (it's already in `.gitignore`)
2. **Keep** your client secret private
3. **Regenerate** credentials if accidentally exposed
4. **Use** environment variables in Vercel for production

## Optional: Verify Everything Works

Test these flows:

1. ✅ Sign up with Google → Creates user account
2. ✅ Sign in with Google → Logs in existing user
3. ✅ Sign up with email → Works normally
4. ✅ Sign in with email → Works normally
5. ✅ Mix: Sign up with email, then sign in with Google (same email) → Should link accounts

---

Need help? Check:
- [NextAuth Google Provider Docs](https://next-auth.js.org/providers/google)
- [Google OAuth Setup Guide](https://support.google.com/cloud/answer/6158849)
