#!/bin/bash
# Mac/Linux script to start Ollama in the background

echo "Starting Ollama service..."
nohup ollama serve > /dev/null 2>&1 &

sleep 3

echo "Ollama started!"
echo "You can now run: npm run dev"

