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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Handle root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
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

// AI Engine API configuration
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:3001';
const AI_ENGINE_PORT = process.env.AI_ENGINE_PORT || 3001;

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

  static createListMessage(bodyText, buttonText, sections) {
    return {
      type: 'list',
      header: {
        text: 'AI Student Companion'
      },
      body: {
        text: bodyText
      },
      footer: {
        text: 'Powered by AI'
      },
      action: {
        button: buttonText,
        sections: sections
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

// In-memory stores
const sessions = new Map();
const whatsappSessions = new Map();
const activeConnections = new Map();

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

// WhatsApp Webhook Verification
app.get('/webhook/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('WhatsApp webhook verification attempt:', { mode, token });

  const result = WhatsAppService.verifyWebhook(mode, token, challenge);
  if (result) {
    console.log('WhatsApp webhook verified successfully');
    res.status(200).send(result);
  } else {
    console.log('WhatsApp webhook verification failed');
    res.sendStatus(403);
  }
});

// WhatsApp Webhook - Handle incoming messages
app.post('/webhook/whatsapp', async (req, res) => {
  try {
    const data = req.body;
    console.log('Received WhatsApp webhook:', JSON.stringify(data, null, 2));

    // Validate webhook data structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid webhook data received');
      return res.sendStatus(400);
    }

    // Mark message as read
    if (data.entry && data.entry[0] && data.entry[0].changes[0]) {
      const change = data.entry[0].changes[0];
      if (change.value && change.value.messages && change.value.messages[0]) {
        const message = change.value.messages[0];
        await WhatsAppService.markAsRead(message.id);
      }
    }

    // Process incoming messages
    if (data.object === 'whatsapp_business_account') {
      for (const entry of data.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages' && change.value.messages) {
            for (const message of change.value.messages) {
              await processWhatsAppMessage(message, change.value.metadata.phone_number_id);
            }
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error);
    res.sendStatus(500);
  }
});

// Process WhatsApp messages and integrate with AI
async function processWhatsAppMessage(message, phoneNumberId) {
  try {
    const from = message.from;
    const messageType = message.type;

    // Get or create WhatsApp session
    let session = whatsappSessions.get(from);
    if (!session) {
      session = {
        phoneNumber: from,
        history: [],
        lastActivity: Date.now(),
        context: 'student_companion'
      };
      whatsappSessions.set(from, session);
    }

    session.lastActivity = Date.now();

    let response;

    if (messageType === 'text') {
      const userMessage = message.text.body;
      
      // Add user message to history
      session.history.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      });

      // Generate AI response
      response = await generateAIResponse(session.history, 'whatsapp');

      // Add AI response to history
      session.history.push({
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      });

      // Send response via WhatsApp
      await WhatsAppService.sendMessage(from, response);

    } else if (messageType === 'interactive') {
      // Handle button responses
      const buttonReply = message.interactive.button_reply;
      response = await handleButtonInteraction(buttonReply.id, buttonReply.title, session);
      await WhatsAppService.sendMessage(from, response);

    } else if (messageType === 'location') {
      // Handle location messages
      const location = message.location;
      response = await handleLocationMessage(location, session);
      await WhatsAppService.sendMessage(from, response);

    } else {
      // Handle other message types
      response = "I can help you with various student-related tasks. Try sending me a message about your studies, assignments, or any questions you have!";
      await WhatsAppService.sendMessage(from, response);
    }

  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
    await WhatsAppService.sendMessage(message.from, "Sorry, I encountered an error. Please try again later.");
  }
}

// Handle button interactions
async function handleButtonInteraction(buttonId, buttonTitle, session) {
  const responses = {
    'btn_1': "I can help you with study tips, assignment planning, and exam preparation. What specific topic would you like to explore?",
    'btn_2': "I can assist with various subjects including Math, Science, Literature, and more. What subject do you need help with?",
    'btn_3': "Let me help you plan your study schedule. What subjects or topics do you need to cover?"
  };

  // Add interaction to history
  session.history.push({
    role: 'user',
    content: `Button: ${buttonTitle}`,
    timestamp: new Date().toISOString()
  });

  let response = responses[buttonId] || "I can help you with various student-related tasks. How can I assist you today?";

  // Generate contextual AI response
  const fullHistory = [...session.history, { role: 'assistant', content: response }];
  const aiEnhanced = await generateAIResponse(fullHistory, 'whatsapp');

  session.history.push({
    role: 'assistant',
    content: aiEnhanced,
    timestamp: new Date().toISOString()
  });

  return aiEnhanced;
}

// Handle location messages
async function handleLocationMessage(location, session) {
  session.history.push({
    role: 'user',
    content: `Location shared: ${location.latitude}, ${location.longitude}`,
    timestamp: new Date().toISOString()
  });

  const response = "I see you've shared your location. I can help you find nearby study spots, libraries, or educational resources. What are you looking for?";
  
  session.history.push({
    role: 'assistant',
    content: response,
    timestamp: new Date().toISOString()
  });

  return response;
}

// Generate AI response using ai-engine API
async function generateAIResponse(history, platform = 'web') {
  try {
    // Format the conversation history for the AI engine
    const prompt = history
      .map(msg => `${msg.role === 'user' ? 'Student' : 'AI Assistant'}: ${msg.content}`)
      .join('\n');

    // Add platform-specific context
    const platformContext = platform === 'whatsapp' 
      ? "\n\nThis is a WhatsApp conversation. Keep responses concise and mobile-friendly."
      : "\n\nThis is a web chat conversation. Provide detailed, helpful responses.";

    const fullPrompt = `You are an AI Student Companion, designed to help students with their studies, assignments, and educational needs. Be helpful, encouraging, and provide practical advice.

${platformContext}

Recent conversation:
${prompt}

AI Assistant:`;

    const response = await axios.post(
      `${AI_ENGINE_URL}/api/respond`,
      {
        message: fullPrompt
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000 // 30 second timeout
      }
    );

    return response.data.response || response.data.reply;
  } catch (error) {
    console.error('Error calling AI Engine API:', error);
    return "I'm having trouble connecting to my AI brain right now. Please try again in a moment!";
  }
}

// Send WhatsApp notifications from web app
app.post('/api/whatsapp/notify', async (req, res) => {
  try {
    const { phoneNumber, message, type = 'text' } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }

    const result = await WhatsAppService.sendMessage(phoneNumber, message, type);
    res.json({ success: true, result });

  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    res.status(500).json({ error: 'Failed to send WhatsApp notification' });
  }
});

// Send interactive WhatsApp messages
app.post('/api/whatsapp/interactive', async (req, res) => {
  try {
    const { phoneNumber, interactiveContent } = req.body;

    if (!phoneNumber || !interactiveContent) {
      return res.status(400).json({ error: 'Phone number and interactive content are required' });
    }

    const result = await WhatsAppService.sendInteractiveMessage(phoneNumber, interactiveContent);
    res.json({ success: true, result });

  } catch (error) {
    console.error('Error sending interactive WhatsApp message:', error);
    res.status(500).json({ error: 'Failed to send interactive WhatsApp message' });
  }
});

// Handle WebSocket connections (existing functionality)
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
        response = await generateAIResponse(session.history, 'web');
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

  // Clean up WhatsApp sessions
  for (const [phone, session] of whatsappSessions.entries()) {
    if (now - session.lastActivity > timeout) {
      console.log(`Cleaning up inactive WhatsApp session: ${phone}`);
      whatsappSessions.delete(phone);
    }
  }
}, 5 * 60 * 1000); // Check every 5 minutes

// Generate response using AI Engine API (legacy function for web socket)
async function generateResponse(history) {
  try {
    // Format the conversation history for the AI engine
    const prompt = history
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');
    
    const response = await axios.post(
      `${AI_ENGINE_URL}/api/respond`,
      {
        message: `You are an AI Student Companion. Respond to the user conversation:\n\n${prompt}`
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );
    
    return response.data.response || response.data.reply;
  } catch (error) {
    console.error('Error calling AI Engine API:', error);
    throw new Error('Failed to generate response');
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    activeWebSessions: sessions.size,
    activeWhatsAppSessions: whatsappSessions.size
  });
});

// Start the server
const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`AI Student Companion with WhatsApp integration running on port ${PORT}`);
  console.log(`WhatsApp webhook endpoint: /webhook/whatsapp`);
  console.log(`Health check: /health`);
});
