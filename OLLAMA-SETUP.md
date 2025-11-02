# 🤖 Ollama Integration Setup Guide

## Quick Start

### 1. Install Ollama
Download from: https://ollama.ai/download

```bash
# Windows, Mac, or Linux - follow installer
```

### 2. Pull the Model
```bash
# 1B parameter model (lightweight & fast)
ollama pull llama3.2:1b

# Alternative models:
# ollama pull llama3.2:3b    # Balanced performance
# ollama pull llama3.2:10b   # More capable, slower
# ollama pull mistral:7b     # Good alternative
# ollama pull codellama:13b  # For coding
```

### 3. Configure AI Engine
Create `ai-engine/.env`:
```env
PORT=3001
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:1b
```

### 4. Start Services
```bash
# Terminal 1 - Ollama (auto-starts usually)
ollama serve

# Terminal 2 - AI Engine
cd ai-engine
node ollamaEngine.js

# Terminal 3 - Backend (optional)
cd backend
node advancedServer.js
```

### 5. Open UI
Open `modern-ui.html` in your browser

## Features

✅ Advanced reasoning and thinking
✅ Multi-subject expertise
✅ Context-aware conversations
✅ Step-by-step explanations
✅ Beautiful modern interface

## Troubleshooting

**Ollama not found:**
- Make sure Ollama is installed
- Check if `ollama serve` is running

**Model not loaded:**
```bash
ollama list  # Check available models
ollama pull llama3.2:1b  # Download if missing
```

**Port conflicts:**
- Ollama uses port 11434
- AI Engine uses port 3001
- Change in .env if needed
