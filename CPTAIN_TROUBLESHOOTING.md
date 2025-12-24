# Cptain API Troubleshooting Guide

## 🔍 What Changed

The integration now has **extensive debugging** and **automatic fallback** to help identify issues:

### ✅ Improvements Made:

1. **Multiple Authentication Endpoints** - Automatically tries:
   - `https://auth.cptain.nl/token` (POST)
   - `https://auth.cptain.nl/auth` (POST)
   - `https://auth.cptain.nl/login` (POST)
   - `https://auth.cptain.nl` (POST - base URL)

2. **Multiple Authentication Formats** - Tries different JSON field names:
   - `{ "apiKey": "..." }`
   - `{ "api_key": "..." }`
   - `{ "key": "..." }`

3. **Multiple API Endpoints** - Automatically tries:
   - `https://api.cptain.nl/api/generate-flashcards`
   - `https://api.cptain.nl/api/flashcards`
   - `https://api.cptain.nl/api/generate`
   - `https://api.cptain.nl/api` (base URL)

4. **Detailed Console Logging** - Every step is logged with `[Cptain Auth]` or `[Cptain]` prefix

5. **Flexible Response Parsing** - Handles multiple response formats automatically

## 🐛 Current Issue: Authentication Failure

If you're seeing **"Failed to authenticate with Cptain API"**, follow these steps:

### Step 1: Check Environment Variables

Make sure your `.env` file has exactly these variables (no typos, no extra quotes):

```bash
CPTAIN_AUTH_URL=https://auth.cptain.nl
CPTAIN_API_URL=https://api.cptain.nl/api
CPTAIN_API_KEY=your_actual_api_key_here
```

**Common mistakes:**
- ❌ `CPTAIN_API_KEY="your_key"` (don't use quotes in .env)
- ❌ `CPTAIN_API_KEY=your_key ` (no trailing spaces)
- ❌ Wrong variable names (must be exactly as shown)

### Step 2: Restart Dev Server

After changing `.env`, you **MUST** restart:

```bash
# Press Ctrl+C to stop
npm run dev
```

### Step 3: Open Browser Console

1. Open your app in the browser
2. Press F12 to open Developer Tools
3. Click on "Console" tab
4. Try generating cards with Cptain AI

### Step 4: Read the Debug Logs

Look for logs starting with `[Cptain Auth]`. You should see:

**✅ Good (working):**
```
[Cptain Auth] Starting authentication...
[Cptain Auth] Auth URL configured: true
[Cptain Auth] API Key configured: true
[Cptain Auth] Auth URL: https://auth.cptain.nl
[Cptain Auth] API Key (first 10 chars): abcd1234...
[Cptain Auth] Trying POST https://auth.cptain.nl/token...
[Cptain Auth] Response status: 200
[Cptain Auth] Response data keys: ['token']
[Cptain Auth] ✓ Authentication successful!
```

**❌ Bad (not working):**
```
[Cptain Auth] Starting authentication...
[Cptain Auth] Auth URL configured: false  ← Problem: URL not loaded
[Cptain Auth] API Key configured: false   ← Problem: Key not loaded
```

OR:

```
[Cptain Auth] Starting authentication...
[Cptain Auth] Auth URL configured: true
[Cptain Auth] API Key configured: true
[Cptain Auth] Trying POST https://auth.cptain.nl/token...
[Cptain Auth] Response status: 401        ← Problem: Unauthorized (wrong key)
[Cptain Auth] Response body: {"error": "Invalid API key"}
```

### Step 5: Common Issues & Solutions

#### Issue: "Auth URL configured: false" or "API Key configured: false"

**Solution:**
1. Make sure `.env` file is in the root directory (same level as `package.json`)
2. Variable names must be **exactly** as shown (case-sensitive)
3. Restart the dev server after changing `.env`
4. Try adding `NEXT_PUBLIC_` prefix: `NEXT_PUBLIC_CPTAIN_API_KEY=...` (only if needed)

#### Issue: "Response status: 401" or "Response status: 403"

**Solution:**
- Your API key is wrong or expired
- Check with Cptain support for the correct API key
- Make sure there are no extra spaces or characters in the `.env` file

#### Issue: "Response status: 404"

**Solution:**
- The authentication endpoint doesn't exist
- Ask Cptain support for the correct authentication URL
- The integration tries multiple endpoints, so check which one returned 404

#### Issue: "fetch failed" or "ECONNREFUSED"

**Solution:**
- Check your internet connection
- The Cptain API server might be down
- Try accessing the API URL in your browser: `https://auth.cptain.nl`

## 📋 Information Needed for Support

If you need help debugging, please provide:

1. **Environment Check:**
   ```bash
   # In your .env file, what are the values?
   CPTAIN_AUTH_URL=?
   CPTAIN_API_URL=?
   CPTAIN_API_KEY=? (only first 10 characters)
   ```

2. **Console Logs:**
   - Copy ALL logs starting with `[Cptain Auth]`
   - Copy ALL logs starting with `[Cptain]`

3. **API Documentation:**
   - What is the correct authentication endpoint?
   - What is the expected request format?
   - What does a successful response look like?

## 🔧 Manual Testing

You can test the API manually using curl:

```bash
# Test authentication
curl -X POST https://auth.cptain.nl/token \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your_api_key_here"}'

# If that doesn't work, try:
curl -X POST https://auth.cptain.nl \
  -H "Content-Type: application/json" \
  -d '{"api_key": "your_api_key_here"}'
```

This will show you exactly what the API returns!

## 🎯 Next Steps

Once you see the authentication logs in the console:

1. Share the `[Cptain Auth]` logs with me
2. I can adjust the authentication method based on what the API actually expects
3. The integration is flexible and can be adapted to any API format!

The code now tries multiple approaches automatically, so it should work with most API configurations. If it still doesn't work, the detailed logs will tell us exactly what we need to adjust!

