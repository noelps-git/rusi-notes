# ✅ Rusi Notes - Deployment Checklist

Quick reference checklist for deploying to production.

---

## 📦 Pre-Deployment

- [ ] All features tested locally
- [ ] Code committed to Git
- [ ] `.env.local` is gitignored (not pushed)
- [ ] Build runs successfully: `npm run build`
- [ ] No TypeScript errors
- [ ] No ESLint errors

---

## 🗄️ Database Setup

- [ ] Supabase production project created
- [ ] Migration 001: Initial schema run
- [ ] Migration 002: GST number run
- [ ] Migration 003: Notifications run
- [ ] Migration 004: Dishes and feedback run
- [ ] Storage bucket `taste-uploads` created
- [ ] Storage policies configured
- [ ] Connection string saved

---

## 🔑 Environment Variables Collected

- [ ] `NEXTAUTH_URL` - Your production URL
- [ ] `NEXTAUTH_SECRET` - Generated secret
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - From Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - From Supabase
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXT_PUBLIC_STORAGE_BUCKET` - `taste-uploads`

---

## 🐙 GitHub Setup

- [ ] GitHub repository created
- [ ] Code pushed to `main` branch
- [ ] Repository linked to Vercel

---

## ⚡ Vercel Deployment

- [ ] Vercel project created
- [ ] GitHub repository imported
- [ ] All environment variables added
- [ ] First deployment successful
- [ ] Deployment URL obtained
- [ ] `NEXTAUTH_URL` updated with real URL
- [ ] Redeployed after URL update

---

## 🔐 OAuth Configuration (if using)

- [ ] Google OAuth redirect URI updated
- [ ] Google OAuth tested in production
- [ ] Supabase auth URLs configured

---

## ✅ Post-Deployment Verification

### Core Features
- [ ] Landing page loads correctly
- [ ] Dark theme (#111111) displays
- [ ] Tamil meme content shows
- [ ] Navigation works

### Authentication
- [ ] Email signup works
- [ ] Email login works
- [ ] Google OAuth works (if configured)
- [ ] Session persistence works
- [ ] Logout works

### User Features
- [ ] Dashboard loads
- [ ] Welcome modal appears for new users
- [ ] Create note works
- [ ] Upload image works
- [ ] View notes works

### Social Features
- [ ] Friends page loads
- [ ] Search users works
- [ ] Send friend request works
- [ ] Accept/reject requests work
- [ ] Groups page loads
- [ ] Create group works
- [ ] Group chat works
- [ ] Chat polling works (5 seconds)
- [ ] Emoji picker works
- [ ] Profile pages load

### Database
- [ ] New users appear in database
- [ ] Notes are saved
- [ ] Images stored in bucket
- [ ] Friend requests tracked

---

## 📊 Monitoring Setup (Optional)

- [ ] Vercel Analytics enabled
- [ ] Error tracking configured
- [ ] Supabase monitoring reviewed
- [ ] Custom domain configured (if applicable)

---

## 🎯 Final Checks

- [ ] Test with multiple users
- [ ] Check mobile responsiveness
- [ ] Verify image uploads < 5MB work
- [ ] Test all API endpoints
- [ ] Check logs for errors
- [ ] Performance is acceptable
- [ ] SEO meta tags present

---

## 📝 Documentation

- [ ] README updated with prod URL
- [ ] Team notified of deployment
- [ ] Admin credentials documented (securely)
- [ ] Environment variables backed up (securely)

---

## 🚀 Ready to Launch!

Once all checkboxes are ticked, your Rusi Notes app is ready for Chennai foodies! 🦁🍛

**Production URL**: ___________________________

**Deployed on**: ___________________________

**Deployed by**: ___________________________

---

## 🆘 Rollback Plan

If something goes wrong:

1. **Vercel**: Redeploy previous version
   - Go to Deployments → Select previous → Redeploy

2. **Database**: Have migration rollback ready
   - Keep backup of database before migrations

3. **DNS**: Revert to previous domain config

---

**Last Updated**: {{ DATE }}
