#!/usr/bin/env node

/**
 * Check if Ollama is running and Gemma3 model is available
 * This script runs before starting the dev server
 */

const { spawn } = require('child_process');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL_NAME = 'gemma3:270m';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function isWindows() {
  return process.platform === 'win32';
}

async function checkOllamaRunning() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function checkModelExists() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!response.ok) return false;
    
    const data = await response.json();
    const models = data.models || [];
    // Check for 'gemma3' with or without tag
    return models.some(model => model.name.includes('gemma3'));
  } catch (error) {
    return false;
  }
}

async function startOllama() {
  return new Promise((resolve) => {
    log('\n🚀 Starting Ollama...', colors.cyan);
    
    const command = isWindows() ? 'ollama' : 'ollama';
    const args = ['serve'];
    
    const ollamaProcess = spawn(command, args, {
      detached: true,
      stdio: 'ignore',
      shell: isWindows(),
    });
    
    ollamaProcess.unref();
    
    // Wait a bit for Ollama to start
    setTimeout(() => {
      log('✅ Ollama started in background', colors.green);
      resolve(true);
    }, 3000);
  });
}

async function pullGptOssModel() {
  return new Promise((resolve) => {
    log('\n📥 Downloading Gemma3 model (this may take a few minutes)...', colors.cyan);
    log('   Model size varies by version', colors.yellow);
    
    const command = isWindows() ? 'ollama' : 'ollama';
    const args = ['pull', MODEL_NAME];
    
    const pullProcess = spawn(command, args, {
      stdio: 'inherit',
      shell: isWindows(),
    });
    
    pullProcess.on('close', (code) => {
      if (code === 0) {
        log('\n✅ Gemma3 model downloaded successfully!', colors.green);
        resolve(true);
      } else {
        log('\n❌ Failed to download Gemma3 model', colors.red);
        resolve(false);
      }
    });
  });
}

async function main() {
  log('\n' + '='.repeat(60), colors.blue);
  log('🤖 Checking Local AI Setup (Ollama + Gemma3)', colors.bright + colors.blue);
  log('='.repeat(60) + '\n', colors.blue);
  
  // Check if Ollama is running
  log('1️⃣  Checking if Ollama is running...', colors.cyan);
  let isRunning = await checkOllamaRunning();
  
  if (!isRunning) {
    log('⚠️  Ollama is not running', colors.yellow);
    
    // Try to start Ollama automatically
    if (isWindows()) {
      log('   Attempting to start Ollama on Windows...', colors.yellow);
      await startOllama();
      
      // Wait and check again
      await new Promise(resolve => setTimeout(resolve, 2000));
      isRunning = await checkOllamaRunning();
      
      if (!isRunning) {
        log('\n❌ Could not start Ollama automatically', colors.red);
        log('\n📋 Please start Ollama manually:', colors.yellow);
        log('   - Check if Ollama is installed: https://ollama.ai/download', colors.yellow);
        log('   - Windows: Look for Ollama icon in system tray', colors.yellow);
        log('   - Or run in terminal: ollama serve\n', colors.yellow);
        process.exit(1);
      }
    } else {
      // Mac/Linux - try to start
      await startOllama();
      await new Promise(resolve => setTimeout(resolve, 2000));
      isRunning = await checkOllamaRunning();
      
      if (!isRunning) {
        log('\n❌ Could not start Ollama automatically', colors.red);
        log('\n📋 Please start Ollama manually:', colors.yellow);
        log('   Run in terminal: ollama serve\n', colors.yellow);
        process.exit(1);
      }
    }
  }
  
  log('✅ Ollama is running!', colors.green);
  
  // Check if Gemma3 model exists
  log('\n2️⃣  Checking if Gemma3 model is installed...', colors.cyan);
  const modelExists = await checkModelExists();
  
  if (!modelExists) {
    log('⚠️  Gemma3 model not found', colors.yellow);
    log('   This is required for AI card generation\n', colors.yellow);
    
    // Ask to download
    const shouldDownload = true; // Auto-download
    
    if (shouldDownload) {
      const success = await pullGptOssModel();
      if (!success) {
        log('\n❌ Please install Gemma3 manually:', colors.red);
        log('   Run: ollama pull gemma3:270m\n', colors.yellow);
        process.exit(1);
      }
    } else {
      log('\n📋 To install Gemma3, run:', colors.yellow);
      log('   ollama pull gemma3:270m\n', colors.yellow);
      process.exit(1);
    }
  } else {
    log('✅ Gemma3 model is installed!', colors.green);
  }
  
  // All good!
  log('\n' + '='.repeat(60), colors.green);
  log('✨ Local AI is ready! Gemma3 will generate your flashcards', colors.bright + colors.green);
  log('='.repeat(60) + '\n', colors.green);
  
  log('🔥 Starting Next.js dev server...\n', colors.cyan);
}

main().catch(error => {
  log(`\n❌ Error: ${error.message}`, colors.red);
  log('\n📋 Troubleshooting:', colors.yellow);
  log('   1. Install Ollama: https://ollama.ai/download', colors.yellow);
  log('   2. Start Ollama: ollama serve', colors.yellow);
  log('   3. Install Gemma3: ollama pull gemma3:270m\n', colors.yellow);
  process.exit(1);
});

