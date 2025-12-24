# 🎴 FlashyCards

A modern flashcard application with **AI-powered card generation** using either local Gemma3 AI or cloud-based Cptain AI. Create, study, and manage flashcards with flexibility!

## ✨ Features

- 🤖 **Dual AI Generation** - Choose between local Gemma3 AI (free, private, offline) or Cptain AI (cloud-based, higher quality)
- 🎯 **Bulk Import** - Paste 50+ cards at once in simple format
- 🔐 **Secure Authentication** - Powered by Clerk
- 📊 **Deck Management** - Create, edit, delete decks and cards
- 🎨 **Modern UI** - Dark mode with shadcn/ui components
- 🔒 **Data Privacy** - Local AI option keeps all data on your computer

## 🚀 Quick Start

### Prerequisites

1. **Install Ollama** (for AI features):
   - Download from: https://ollama.ai/download
   - The app will automatically download Gemma3 model when you first run it

2. **Setup Environment**:
   - Create `.env` file with required variables
   - Add your Clerk credentials
   - Add your database URL
   - (Optional) Add Cptain AI credentials for cloud AI features

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

**The app automatically:**
- ✅ Checks if Ollama is running
- ✅ Starts Ollama if needed
- ✅ Downloads Gemma3 model if missing
- ✅ Starts the dev server

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📖 Usage

### Creating a Deck with AI

1. Click "Create Deck"
2. Enter deck name (e.g., "Dutch Food Vocabulary")
3. Enter description (e.g., "Typical food Dutch to English")
4. Choose number of cards (e.g., 50)
5. Select AI provider:
   - **Gemma3 (Local)** - Free, private, offline (best for 5-10 cards)
   - **Cptain AI (Cloud)** - Higher quality, handles larger batches (up to 100 cards)
6. Click "Generate"
7. Review and create!

### Manual Card Import

Paste cards in this format:
```
Apple | Appel
Bread | Brood
Cheese | Kaas
```

## 🎯 NPM Scripts

```bash
# Start with automatic Ollama check
npm run dev

# Skip Ollama check (faster if already running)
npm run dev:skip-check

# Check Ollama status only
npm run ollama:check

# Build for production
npm run build

# Seed database
npm run db:seed
```

## 🤖 AI Setup

### Option 1: Local AI (Gemma3 via Ollama)

Detailed instructions: [OLLAMA_SETUP.md](./OLLAMA_SETUP.md)

**Quick setup:**
1. Install Ollama: https://ollama.ai/download
2. Run `npm run dev` (auto-downloads Gemma3)
3. Done!

**Benefits:**
- 100% Free
- Complete Privacy
- Works Offline
- No API Keys Needed

### Option 2: Cloud AI (Cptain AI)

**Setup:**
1. Get your API key from Cptain
2. Add to `.env`:
   ```bash
   CPTAIN_AUTH_URL=https://auth.cptain.nl
   CPTAIN_API_URL=https://api.cptain.nl/api
   CPTAIN_API_KEY=your_api_key_here
   ```
3. Restart the dev server: `npm run dev`

**Benefits:**
- Higher Quality Results
- Handles Larger Batches (up to 100 cards)
- No Local Installation Required
- Faster Generation

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Neon (PostgreSQL)
- **ORM:** Drizzle
- **Authentication:** Clerk
- **UI:** shadcn/ui + Tailwind CSS
- **AI:** 
  - Gemma3 270M via Ollama (local, free)
  - Cptain AI (cloud, optional)

## 📁 Project Structure

```
flashycards/
├── app/                    # Next.js app router pages
├── actions/               # Server actions (business logic)
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── db/
│   ├── queries/          # Database query helpers (ONLY place for DB queries)
│   └── schema.ts         # Database schema
├── lib/                   # Utilities and validations
└── scripts/              # Development scripts
```

## 🔒 Security

- ✅ Row-level security (users only access their data)
- ✅ Server-side authentication with Clerk
- ✅ Zod validation on all inputs
- ✅ SQL injection protection via Drizzle ORM
- ✅ Local AI (data never leaves your computer)

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Authentication](https://clerk.com/docs)
- [Ollama Documentation](https://ollama.ai/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or production!
