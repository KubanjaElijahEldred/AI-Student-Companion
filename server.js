const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const crypto = require('crypto');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
}).single('image');

const app = express();
const httpServer = createServer(app);

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Handle root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Create Socket.IO server with improved configuration
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true,
  pingTimeout: 30000, // 30 seconds
  pingInterval: 5000,  // 5 seconds
  maxHttpBufferSize: 10e6 // 10MB max upload size
});

// Ollama API configuration
const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'llama3.2:1b';

// WhatsApp Business API configuration
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
const WHATSAPP_API_VERSION = 'v18.0';
const WHATSAPP_BASE_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

// WhatsApp service functions
class WhatsAppService {
  static verifyWebhook(mode, token, challenge) {
    if (mode === 'subscribe' && token === WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      return challenge;
    }
    return null;
  }

  static async sendMessage(to, message, type = 'text') {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: to.replace(/[\s\+\-\(\)]/g, ''),
        type: type
      };

      if (type === 'text') {
        payload.text = { body: message };
      }

      const response = await axios.post(
        `${WHATSAPP_BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      throw error;
    }
  }

  static async sendInteractiveMessage(to, interactiveContent) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: to.replace(/[\s\+\-\(\)]/g, ''),
        type: 'interactive',
        interactive: interactiveContent
      };

      const response = await axios.post(
        `${WHATSAPP_BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending interactive WhatsApp message:', error.response?.data || error.message);
      throw error;
    }
  }

  static createButtonMessage(bodyText, buttons) {
    return {
      type: 'button',
      body: { text: bodyText },
      action: {
        buttons: buttons.map((button, index) => ({
          type: 'reply',
          reply: {
            id: `btn_${index + 1}`,
            title: button.title
          }
        }))
      }
    };
  }

  static async markAsRead(messageId) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      };

      await axios.post(
        `${WHATSAPP_BASE_URL}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error marking message as read:', error.response?.data || error.message);
    }
  }
}

// In-memory store for demo purposes
const sessions = new Map();
const whatsappSessions = new Map();

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Handle image uploads
app.post('/api/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
      success: true, 
      filePath: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname
    });
  });
});

// Track active connections
const activeConnections = new Map();

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Initialize session
  const session = {
    id: socket.id,
    history: [],
    isTyping: false,
    lastActivity: Date.now()
  };
  
  sessions.set(socket.id, session);
  activeConnections.set(socket.id, socket);
  
  // Send initial connection confirmation
  socket.emit('connected', { 
    sessionId: socket.id,
    timestamp: new Date().toISOString()
  });

  // Handle incoming messages
  socket.on('message', async (data, ack) => {
    try {
      const { message, messageId, type = 'text' } = data;
      const session = sessions.get(socket.id);
      
      if (!session) {
        throw new Error('Session not found');
      }
      
      // Update last activity
      session.lastActivity = Date.now();
      
      // Acknowledge message receipt immediately
      if (typeof ack === 'function') {
        ack({ status: 'received', messageId });
      }
      
      // Update typing state
      socket.emit('typing', { isTyping: true });
      
      // Add user message to history
      const userMessage = {
        role: 'user',
        content: message,
        type,
        timestamp: new Date().toISOString(),
        messageId
      };
      
      if (type === 'image' && data.imageUrl) {
        userMessage.imageUrl = data.imageUrl;
      }
      
      session.history.push(userMessage);
      
      // Process message based on type
      let response;
      if (type === 'image' && data.imageUrl) {
        // Handle image message
        response = await generateResponse([
          ...session.history,
          { 
            role: 'user', 
            content: message || 'What is in this image?',
            images: [data.imageUrl],
            type: 'image'
          }
        ]);
      } else {
        // Handle text message
        response = await generateResponse(session.history);
      }
      
      // Add AI response to history
      const aiResponse = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        inResponseTo: messageId
      };
      
      session.history.push(aiResponse);
      
      // Send response back to client
      socket.emit('response', {
        type: 'text',
        content: response,
        responseId: `res-${Date.now()}`,
        inResponseTo: messageId
      });
      
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('error', { 
        error: 'Error processing your request',
        messageId: data?.messageId,
        details: error.message
      });
    } finally {
      // Always ensure typing indicator is turned off
      socket.emit('typing', { isTyping: false });
    }
  });
  
  // Handle typing indicator
  socket.on('typing', (data) => {
    const session = sessions.get(socket.id);
    if (session) {
      session.isTyping = data.isTyping;
      // Broadcast to other users in the same room if needed
      // socket.to(roomId).emit('user-typing', { userId: socket.id, isTyping: data.isTyping });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
    sessions.delete(socket.id);
    activeConnections.delete(socket.id);
  });
  
  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Clean up inactive sessions
setInterval(() => {
  const now = Date.now();
  const timeout = 30 * 60 * 1000; // 30 minutes
  
  for (const [id, session] of sessions.entries()) {
    if (now - session.lastActivity > timeout) {
      console.log(`Cleaning up inactive session: ${id}`);
      const socket = activeConnections.get(id);
      if (socket) {
        socket.disconnect(true);
      }
      sessions.delete(id);
      activeConnections.delete(id);
    }
  }
}, 5 * 60 * 1000); // Check every 5 minutes

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
