# Local AI Setup with Gemma3

This app uses **Gemma3 AI running locally via Ollama** for flashcard generation. It's completely free, private, and works offline!

## ✨ Automatic Setup

When you run `npm run dev`, the app **automatically checks and starts Ollama with Gemma3** for you! You don't need to do anything manually.

If Gemma3 is not installed, it will download it automatically.

## 🚀 Manual Setup (Optional)

### Step 1: Install Ollama

**Windows:**
1. Download from: https://ollama.ai/download/windows
2. Run the installer
3. Ollama will start automatically in the background

**Mac:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Step 2: Install Gemma3 Model

Open a terminal and run:

```bash
ollama pull gemma3:270m
```

This downloads the Gemma3 270M AI model. It only needs to be done once.

### Step 3: Start the Dev Server

```bash
npm run dev
```

The app will automatically:
1. ✅ Check if Ollama is running
2. ✅ Start Ollama if needed
3. ✅ Check if Gemma3 is installed
4. ✅ Download Gemma3 if missing
5. ✅ Start the Next.js dev server

### Step 4: Start Using!

That's it! The app will now use local Gemma3 AI to generate flashcards.

## 💡 Usage

1. Click "Create Deck"
2. Enter deck name and description
3. Choose how many cards (e.g., 50)
4. Click "Generate with Gemma3 (Local)"
5. Wait 10-30 seconds while AI generates cards
6. Review and create your deck!

## 🎯 NPM Scripts

```bash
# Normal start - checks Ollama automatically
npm run dev

# Skip Ollama check (if you know it's running)
npm run dev:skip-check

# Manually check Ollama status
npm run ollama:check
```

## 🔧 Troubleshooting

### "Could not connect to Ollama"

**Solution:** The startup script tries to start Ollama automatically. If it fails:

- **Windows:** Check system tray for Ollama icon, or run `scripts\start-ollama.bat`
- **Mac/Linux:** Run `./scripts/start-ollama.sh` or `ollama serve` in terminal

### "Gemma3 model not found"

**Solution:** Install the model:

```bash
ollama pull gemma3:270m
```

### Slow Generation

**Tips:**
- First generation is slower (model loads into memory)
- Subsequent generations are faster
- Generation time depends on your PC specs
- Typical: 10-30 seconds for 50 cards

## 📊 What You Get

✅ **100% Free** - No API costs ever
✅ **Private** - Data never leaves your computer
✅ **Offline** - Works without internet
✅ **Fast** - After initial model load
✅ **Quality** - Gemma3 is excellent for education

## 🖥️ System Requirements

- **RAM:** 8GB minimum (16GB recommended)
- **Storage:** Varies by model version
- **OS:** Windows, Mac, or Linux

## 🔄 Optional: Change Ollama URL

If Ollama runs on a different port/host, add to `.env.local`:

```bash
OLLAMA_URL=http://localhost:11434
```

## 🆘 Need Help?

- Ollama Documentation: https://ollama.ai/docs
- Test Ollama: `ollama run gemma3:270m "Hello"`
- Check status: `ollama ps`

## 🎯 Model Info

**Gemma3:**
- Open-source GPT model
- Great for: Education, translations, general knowledge
- Speed: Fast to Medium (depends on GPU/CPU)
- Quality: Excellent

Enjoy free, private AI-powered flashcard generation! 🎉

