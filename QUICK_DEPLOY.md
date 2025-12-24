# ⚡ Quick Deployment Guide

Your app is ready to deploy! Follow these steps:

## ✅ Pre-Deployment Checklist

- [x] Build passes (`npm run build` ✅)
- [x] Neon database is set up
- [ ] Code is pushed to GitHub/GitLab
- [ ] Environment variables are ready

## 🚀 Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your repository
5. **Add Environment Variables:**
   ```
   DATABASE_URL=your_neon_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   ```
6. Click "Deploy"

### Step 3: Run Database Migrations
After deployment, run:
```bash
npm i -g vercel
vercel login
vercel env pull .env.local
npm run db:push
```

### Step 4: Configure Clerk
1. Go to https://dashboard.clerk.com
2. Add your Vercel domain: `your-app.vercel.app`
3. Use production keys (`pk_live_...`, `sk_live_...`)

## 🎉 Done!

Your app is live at: `https://your-app.vercel.app`

---

**Need help?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

