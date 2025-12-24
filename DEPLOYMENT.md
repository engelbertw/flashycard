# 🚀 Deployment Guide for FlashyCards

This guide will help you deploy your FlashyCards app to production so everyone can use it!

## 🎯 Recommended: Vercel (Easiest for Next.js)

Vercel is built by the creators of Next.js and offers the best experience for Next.js apps.

### Step 1: Prepare Your Code

1. **Make sure your code is in Git:**
   ```bash
   git init  # if not already initialized
   git add .
   git commit -m "Ready for deployment"
   ```

2. **Push to GitHub/GitLab/Bitbucket:**
   - Create a repository on GitHub
   - Push your code:
     ```bash
     git remote add origin https://github.com/yourusername/flashycards.git
     git push -u origin main
     ```

### Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel:**
   - Go to https://vercel.com
   - Sign up with GitHub (recommended)

2. **Import Your Project:**
   - Click "Add New Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Project Settings:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Add Environment Variables:**
   
   Click "Environment Variables" and add these:

   **Required:**
   ```
   DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   ```

   **Optional (if using Cptain AI):**
   ```
   CPTAIN_AUTH_URL=https://auth.cptain.nl
   CPTAIN_API_URL=https://api.cptain.nl/api/v0
   CPTAIN_CLIENT_ID=your_client_id
   CPTAIN_CLIENT_SECRET=your_client_secret
   CPTAIN_REALM=pink-roccade-pz
   ```

   **Important:**
   - Use **production** Clerk keys (`pk_live_...` and `sk_live_...`)
   - Use your **production** Neon connection string
   - Select all environments (Production, Preview, Development)

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `your-app.vercel.app`

### Step 3: Configure Clerk for Production

1. **Add Your Domain to Clerk:**
   - Go to https://dashboard.clerk.com
   - Select your application
   - Go to **Settings → Domains**
   - Add your Vercel domain: `your-app.vercel.app`
   - (Optional) Add custom domain if you have one

2. **Update Clerk Environment Variables:**
   - Make sure you're using production keys in Vercel
   - Get them from Clerk Dashboard → API Keys

### Step 4: Run Database Migrations

After first deployment, you need to create tables in Neon:

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Pull environment variables
vercel env pull .env.local

# Run migrations
npm run db:push
```

**Option B: Using Neon Console**
1. Go to https://console.neon.tech
2. Open your project
3. Go to SQL Editor
4. Run the SQL from your migration files (in `./drizzle/` folder)

### Step 5: Test Your Deployment

1. Visit your app: `https://your-app.vercel.app`
2. Test sign up/sign in
3. Create a deck
4. Test AI generation (if configured)
5. Test premium subscription flow

---

## 🔄 Alternative Deployment Options

### Option 2: Railway

1. **Sign up:** https://railway.app
2. **New Project → Deploy from GitHub**
3. **Add PostgreSQL Service** (or connect your Neon database)
4. **Add Environment Variables:**
   - Same as Vercel above
5. **Deploy:** Railway auto-deploys on push

**Railway Benefits:**
- Simple deployment
- Built-in PostgreSQL option
- Automatic HTTPS
- Free tier available

### Option 3: Render

1. **Sign up:** https://render.com
2. **New Web Service → Connect GitHub**
3. **Configure:**
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. **Add Environment Variables**
5. **Add PostgreSQL Database** (or use Neon)
6. **Deploy**

**Render Benefits:**
- Free tier available
- Automatic SSL
- Easy database setup

### Option 4: DigitalOcean App Platform

1. **Sign up:** https://cloud.digitalocean.com
2. **Create App → GitHub**
3. **Configure build settings**
4. **Add managed PostgreSQL** (or use Neon)
5. **Add environment variables**
6. **Deploy**

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Code is pushed to Git repository
- [ ] `.env.local` is NOT committed (it's in `.gitignore`)
- [ ] Production build works: `npm run build`
- [ ] Neon database is set up and accessible
- [ ] Clerk production keys are ready
- [ ] All environment variables are documented
- [ ] Database migrations are ready to run

---

## 🔧 Post-Deployment Steps

1. **Run Database Migrations:**
   ```bash
   npm run db:push
   ```

2. **Verify Environment Variables:**
   - Check all variables are set in hosting platform
   - Verify production keys are used (not test keys)

3. **Test Authentication:**
   - Sign up a test user
   - Sign in/out
   - Verify user data is saved

4. **Test Core Features:**
   - Create a deck
   - Add cards
   - Study session
   - Premium subscription (if applicable)

5. **Monitor:**
   - Check Vercel/Railway/Render logs
   - Monitor Neon database usage
   - Check Clerk dashboard for errors

---

## 🌐 Custom Domain Setup

### With Vercel:

1. **Add Domain in Vercel:**
   - Go to Project → Settings → Domains
   - Add your domain (e.g., `flashycards.com`)

2. **Configure DNS:**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or A record as instructed by Vercel

3. **Update Clerk:**
   - Add custom domain in Clerk Dashboard
   - Update environment variables if needed

4. **Wait for DNS Propagation:**
   - Can take up to 48 hours
   - Usually works within minutes

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Module not found"**
- Check all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: "Environment variable missing"**
- Verify all required env vars are set in hosting platform
- Check variable names match exactly

**Error: "TypeScript errors"**
- Fix TypeScript errors locally first
- Run `npm run build` locally to test

### Runtime Errors

**Error: "Database connection failed"**
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check Neon project is active (not paused)
- Verify connection string is correct

**Error: "Clerk authentication failed"**
- Verify production keys are used (`pk_live_...`, `sk_live_...`)
- Check domain is added in Clerk Dashboard
- Verify environment variables are set correctly

**Error: "Function timeout"**
- Check Vercel function logs
- Optimize slow queries
- Consider upgrading plan

---

## 💰 Cost Estimate

### Free Tier (Small Scale):
- **Vercel:** Free (Hobby plan)
- **Neon:** Free (0.5 GB storage)
- **Clerk:** Free (10,000 MAU)
- **Total:** $0/month

### Production Scale:
- **Vercel Pro:** $20/month
- **Neon Pro:** $19/month
- **Clerk:** Based on usage
- **Total:** ~$40-50/month

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Clerk Deployment Guide](https://clerk.com/docs/deployments/overview)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🎉 You're Done!

Once deployed, your app will be accessible to everyone at your deployment URL!

**Next Steps:**
1. Share your app URL
2. Monitor usage and performance
3. Set up custom domain (optional)
4. Configure backups and monitoring

