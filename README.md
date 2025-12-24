# 🎴 FlashyCards

A modern flashcard application with **AI-powered card generation** using local Gemma3 AI. Create, study, and manage flashcards completely free and private!

## ✨ Features

- 🤖 **AI Card Generation** - Generate flashcards using local Gemma3 AI (100% free, private, offline)
- 🎯 **Bulk Import** - Paste 50+ cards at once in simple format
- 🔐 **Secure Authentication** - Powered by Clerk
- 📊 **Deck Management** - Create, edit, delete decks and cards
- 🎨 **Modern UI** - Dark mode with shadcn/ui components
- 🔒 **Data Privacy** - All AI processing runs locally on your computer

## 🚀 Quick Start

### Prerequisites

1. **Install Ollama** (for AI features):
   - Download from: https://ollama.ai/download
   - The app will automatically download Gemma3 model when you first run it

2. **Setup Environment**:
   - Copy `.env.local.example` to `.env.local`
   - Add your Clerk credentials
   - Add your database URL

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
5. Click "Generate with Gemma3 (Local)"
6. Review and create!

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

## 🤖 Local AI Setup

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

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Neon (PostgreSQL)
- **ORM:** Drizzle
- **Authentication:** Clerk
- **UI:** shadcn/ui + Tailwind CSS
- **AI:** Gemma3 270M via Ollama (local)

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
