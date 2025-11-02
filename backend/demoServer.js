import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from 'url';

// Import demo controllers
import { register, login, getDemoStats, clearDemoData } from "./controllers/demoAuthController.js";
import { chatWithAI, getChatHistory, clearChatHistory, getDemoChatStats } from "./controllers/demoChatController.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from parent directory (where js-app.html is located)
app.use(express.static(path.join(__dirname, '..')));

// Demo auth middleware
const demoAuthMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access denied - No token provided" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "demo-secret-key-2024";
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Serve the JavaScript application
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'js-app.html'));
});

// API info route
app.get("/api", (req, res) => {
  res.json({
    message: "🤖 AI Student Companion Demo Server",
    version: "1.0.0",
    status: "Running in demo mode (no database required)",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        stats: "GET /api/auth/demo-stats"
      },
      chat: {
        chat: "POST /api/chat",
        history: "GET /api/chat/history",
        clear: "DELETE /api/chat/history",
        stats: "GET /api/chat/demo-stats"
      },
      health: "GET /api/health"
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Demo server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Auth routes
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.get("/api/auth/demo-stats", getDemoStats);
app.delete("/api/auth/demo-data", clearDemoData);

// Chat routes
app.post("/api/chat", demoAuthMiddleware, chatWithAI);
app.get("/api/chat/history", demoAuthMiddleware, getChatHistory);
app.delete("/api/chat/history", demoAuthMiddleware, clearChatHistory);
app.get("/api/chat/demo-stats", getDemoChatStats);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      "GET /",
      "GET /api/health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/chat"
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
🚀 AI Student Companion Demo Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server: http://localhost:${PORT}
🔧 Mode: Demo (No database required)
💬 AI Engine: ${process.env.AI_ENGINE_URL || 'http://localhost:3001'}
🌐 Frontend: Open frontend/index.html in browser
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready for connections! 🎉
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Demo server shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Demo server shutting down gracefully...');
  process.exit(0);
});

export default app;
