@echo off
REM Windows script to start Ollama in the background

echo Starting Ollama service...
start /B ollama serve

timeout /t 3 /nobreak > nul

echo Ollama started!
echo You can now run: npm run dev

