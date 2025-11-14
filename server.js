const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Ollama API configuration
const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'llama3.2:1b';

// In-memory store for demo purposes
const sessions = new Map();

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Initialize session
  sessions.set(socket.id, {
    history: []
  });

  // Handle incoming messages
  socket.on('message', async (data) => {
    try {
      const session = sessions.get(socket.id);
      const { message } = data;
      
      // Add user message to history
      session.history.push({ role: 'user', content: message });
      
      // Generate response using Ollama
      const response = await generateResponse(session.history);
      
      // Add AI response to history
      session.history.push({ role: 'assistant', content: response });
      
      // Send response back to client
      socket.emit('response', { message: response });
      
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('error', { message: 'Error processing your request' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    sessions.delete(socket.id);
  });
});

// Generate response using Ollama API
async function generateResponse(history) {
  try {
    // Format the conversation history for the model
    const prompt = history
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');
    
    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: MODEL,
        prompt: prompt,
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data.response;
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    throw new Error('Failed to generate response');
  }
}

// Start the server
const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
