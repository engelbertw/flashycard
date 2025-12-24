# Cptain AI Integration Setup Guide

## ✅ What Was Implemented

The Cptain AI integration has been successfully added to FlashyCards! You can now choose between two AI providers:

1. **Gemma3 (Local)** - Free, private, offline AI running on your computer
2. **Cptain AI (Cloud)** - Cloud-based AI with higher quality results

## 🔧 Setup Instructions

### 1. Add Environment Variables

Add these variables to your `.env` file:

```bash
# Cptain AI Configuration
CPTAIN_AUTH_URL=https://auth.cptain.nl
CPTAIN_API_URL=https://api.cptain.nl/api
CPTAIN_API_KEY=your_actual_api_key_here
```

**Replace `your_actual_api_key_here` with your real Cptain API key.**

### 2. Restart Your Development Server

After adding the environment variables:

```bash
# Stop the server (Ctrl+C)
# Then restart it
npm run dev
```

## 🎯 How to Use

1. **Create a New Deck**
   - Click the "Create Deck" button
   - Fill in the deck name and description

2. **Choose AI Provider**
   - You'll see two buttons:
     - **Gemma3 (Local)** - Best for 5-10 cards, free, private, offline
     - **Cptain AI (Cloud)** - Best for larger batches (up to 100 cards), higher quality

3. **Generate Cards**
   - Select your preferred AI provider
   - Set the number of cards you want
   - Click "Generate"
   - Review and create your deck!

## 🔍 Testing the Integration

### Quick Test:

1. Open the app at http://localhost:3000
2. Click "Create Deck"
3. Enter:
   - Name: "Test Deck"
   - Description: "basic spanish greetings with english translations"
   - Number of cards: 5
4. Select "Cptain AI (Cloud)"
5. Click "Generate"

### What to Expect:

✅ **Success:** Cards appear in the textarea in format "front | back"  
❌ **Error:** Check browser console (F12) for error messages

## 🐛 Troubleshooting

### Error: "Failed to authenticate with Cptain API"

**Solution:** Check that your `CPTAIN_API_KEY` is correct in `.env`

**Debug Steps:**
1. Open browser console (F12) and look for logs starting with `[Cptain Auth]`
2. Check if the environment variables are being loaded (should show "configured: true")
3. Look for the authentication attempt logs - it will try multiple endpoints
4. Check if the API key format is correct (no extra spaces or quotes)
5. Verify the auth URL is exactly: `https://auth.cptain.nl`

### Error: "Could not connect to Cptain API"

**Possible causes:**
1. Internet connection issue
2. Cptain API might be down
3. Wrong `CPTAIN_API_URL` in `.env`

**Debug Steps:**
1. Check browser console for `[Cptain]` logs
2. Look for "Trying endpoint:" messages - it will try multiple endpoints
3. Check the response status codes
4. Verify the API URL is exactly: `https://api.cptain.nl/api`

### Error: "No valid cards could be generated"

**Possible causes:**
1. The API response format might be different than expected
2. Check the browser console for the actual API response
3. We may need to adjust the parsing logic

## 🔧 API Response Format Adaptation

The integration is designed to handle multiple response formats:

### Format 1: Structured Cards
```json
{
  "cards": [
    { "front": "hola", "back": "hello" },
    { "front": "adiós", "back": "goodbye" }
  ]
}
```

### Format 2: Flashcards Array
```json
{
  "flashcards": [
    { "question": "hola", "answer": "hello" },
    { "term": "adiós", "definition": "goodbye" }
  ]
}
```

### Format 3: Text Response
```json
{
  "text": "hola | hello\nadiós | goodbye"
}
```

### Format 4: Direct String
```
hola | hello
adiós | goodbye
```

**If your API uses a different format, we can easily adapt the parsing logic!**

## 📊 Viewing Debug Information

The integration now has **extensive debug logging**. To see what's happening:

1. Open browser console (F12)
2. Look for these logs:
   - `[Cptain Auth]` - Authentication process logs
     - Shows if credentials are configured
     - Shows which endpoints are being tried
     - Shows response status and token extraction
   - `[Cptain]` - API call logs
     - Shows the request parameters
     - Shows which API endpoints are being tried
     - Shows the response data structure
     - Shows any errors

**Example of what you should see:**
```
[Cptain Auth] Starting authentication...
[Cptain Auth] Auth URL configured: true
[Cptain Auth] API Key configured: true
[Cptain Auth] Trying POST https://auth.cptain.nl/token...
[Cptain Auth] Response status: 200
[Cptain Auth] ✓ Authentication successful!
[Cptain] Starting card generation...
[Cptain] Calling API with: { description: "...", cardCount: 10 }
[Cptain] Trying endpoint: https://api.cptain.nl/api/generate-flashcards
[Cptain] Response status: 200
[Cptain] API response keys: ['cards', 'count']
```

## 🎨 UI Changes

The "Create Deck" dialog now includes:

- **AI Provider Selector** - Toggle between Gemma3 and Cptain AI
- **Dynamic Help Text** - Different recommendations based on selected AI
- **Updated Generate Button** - Shows which AI you're using
- **Better Error Messages** - More helpful error information

## 📝 Files Modified

1. **`actions/ai-actions.ts`**
   - Added `getCptainAuthToken()` function
   - Added `generateCardsWithCptainAI()` function

2. **`components/create-deck-dialog.tsx`**
   - Added AI provider selector UI
   - Updated generate button to use selected AI
   - Added dynamic help text

3. **`README.md`**
   - Updated with Cptain AI information
   - Added setup instructions

## 🚀 Next Steps

1. **Test the integration** with a small batch (5-10 cards)
2. **Check the console** if there are any errors
3. **Let me know** if the API response format needs adjustment
4. **Enjoy** generating high-quality flashcards!

## ❓ Need Help?

If you encounter any issues:

1. Check the browser console for detailed error messages (look for `[Cptain Auth]` and `[Cptain]` logs)
2. Verify your `.env` has the correct values (no extra spaces, quotes, or newlines)
3. Make sure you've restarted the dev server after changing `.env`
4. Copy the console output (especially the `[Cptain]` logs) for debugging

**The integration now automatically tries:**
- Multiple authentication endpoints (`/token`, `/auth`, `/login`, base URL)
- Multiple authentication methods (different JSON field names)
- Multiple API endpoints for card generation
- Multiple response format parsers

This should work with most API configurations!

The integration is flexible and can be easily adjusted to match your API's exact response format!

