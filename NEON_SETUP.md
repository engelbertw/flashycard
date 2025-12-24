# 🚀 Neon Database Setup Guide

This guide will help you set up your FlashyCards app with Neon PostgreSQL database for production deployment.

## 📋 Prerequisites

- A Neon account (sign up at https://neon.tech - free tier available)
- Your FlashyCards project ready for deployment

## 🔧 Step 1: Create a Neon Project

1. **Sign up/Login to Neon**
   - Go to https://neon.tech
   - Sign up with GitHub, Google, or email
   - Free tier includes: 0.5 GB storage, 1 project

2. **Create a New Project**
   - Click "New Project"
   - Choose a project name (e.g., "flashycards")
   - Select a region (choose closest to your users)
   - Click "Create Project"

3. **Get Your Connection String**
   - After project creation, you'll see a connection string
   - It looks like: `postgresql://user:password@host.neon.tech/database?sslmode=require`
   - **Copy this connection string** - you'll need it!

## 🔐 Step 2: Configure Environment Variables

### For Local Development

Create or update your `.env.local` file:

```bash
# Neon Database Connection
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require

# Clerk Authentication (you should already have these)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Cptain AI (if using cloud AI)
CPTAIN_AUTH_URL=https://auth.cptain.nl
CPTAIN_API_URL=https://api.cptain.nl/api/v0
CPTAIN_CLIENT_ID=your_client_id
CPTAIN_CLIENT_SECRET=your_client_secret
CPTAIN_REALM=pink-roccade-pz
```

### For Production (Vercel/Railway/etc.)

Add the `DATABASE_URL` environment variable in your hosting platform's settings:

**Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add `DATABASE_URL` with your Neon connection string
3. Make sure to select all environments (Production, Preview, Development)

**Railway:**
1. Go to your project → Variables
2. Add `DATABASE_URL` with your Neon connection string

**Render:**
1. Go to your service → Environment
2. Add `DATABASE_URL` with your Neon connection string

## 🗄️ Step 3: Run Database Migrations

Your database schema needs to be created in Neon. You have two options:

### Option A: Using Drizzle Push (Recommended for Quick Setup)

```bash
# Make sure DATABASE_URL is set in .env.local
npm run db:push
```

This will create all tables in your Neon database.

### Option B: Using Drizzle Migrate (Recommended for Production)

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

## ✅ Step 4: Verify Connection

Test your database connection:

```bash
# Start your dev server
npm run dev

# Try creating a deck in the app
# If it works, your database is connected!
```

Or use Drizzle Studio to view your database:

```bash
npm run db:studio
```

This opens a web interface at http://localhost:4983 where you can:
- View all tables
- Browse data
- Edit records
- Run queries

## 🔍 Step 5: Verify Database Schema

Your Neon database should have these tables:

- ✅ `decks` - User flashcard decks
- ✅ `cards` - Individual flashcards
- ✅ `study_sessions` - Study session records
- ✅ `study_results` - Individual card results
- ✅ `challenges` - User challenges

## 🚨 Troubleshooting

### Connection Error: "Connection refused"

**Solution:** 
- Check that your `DATABASE_URL` includes `?sslmode=require`
- Verify the connection string is correct
- Make sure your Neon project is active (not paused)

### Error: "relation does not exist"

**Solution:**
- Run `npm run db:push` to create tables
- Or run migrations: `npm run db:generate && npm run db:migrate`

### Error: "password authentication failed"

**Solution:**
- Get a fresh connection string from Neon dashboard
- Make sure you're using the correct project's connection string
- Check for extra spaces or quotes in your `.env.local`

### Database is Slow

**Solution:**
- Check your Neon project region (should be close to your app)
- Consider upgrading Neon plan if you have many users
- Check Neon dashboard for connection limits

## 📊 Neon Dashboard Features

The Neon dashboard provides:

- **Connection String Management** - Get connection strings for different environments
- **Database Metrics** - Monitor storage, connections, queries
- **Branching** - Create database branches for testing (Pro plan)
- **Backups** - Automatic backups (varies by plan)
- **Query Performance** - View slow queries and optimize

## 🔄 Updating Schema

When you update `db/schema.ts`:

1. **Generate migration:**
   ```bash
   npm run db:generate
   ```

2. **Review the migration files** in `./drizzle/` folder

3. **Apply to Neon:**
   ```bash
   npm run db:push
   ```
   Or use migrations:
   ```bash
   npm run db:migrate
   ```

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use different databases** for development and production
3. **Rotate connection strings** if compromised
4. **Use SSL** - Always include `?sslmode=require` in connection string
5. **Limit access** - Only give connection strings to trusted team members

## 📈 Neon Free Tier Limits

- **Storage:** 0.5 GB
- **Projects:** 1
- **Compute Time:** 100 hours/month
- **Branches:** 0 (Pro plan required)

For production with many users, consider upgrading to Pro plan ($19/month).

## 🎯 Next Steps

After setting up Neon:

1. ✅ Database is connected
2. ✅ Tables are created
3. ✅ Test creating a deck
4. ✅ Deploy to Vercel/Railway/etc.
5. ✅ Add `DATABASE_URL` to production environment variables
6. ✅ Run migrations in production

## 📚 Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Neon Dashboard](https://console.neon.tech)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [PostgreSQL SSL Connection](https://neon.tech/docs/connect/connect-from-any-app)

## 💡 Tips

- **Use connection pooling** - Neon automatically handles this
- **Monitor usage** - Check Neon dashboard regularly
- **Set up alerts** - Configure alerts for storage/connection limits
- **Backup regularly** - Neon has automatic backups, but export important data
- **Use branches** - For testing schema changes (Pro plan)

---

**Need Help?** Check the Neon documentation or create an issue in the repository.

