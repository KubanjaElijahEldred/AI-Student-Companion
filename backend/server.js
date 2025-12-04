import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to in-memory database
    await db.connect();
    
    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/chat", chatRoutes);
    
    // Simple health check endpoint
    app.get("/health", (req, res) => {
      res.status(200).json({ status: "ok", database: "in-memory" });
    });
    
    const PORT = process.env.PORT || 5003;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 http://localhost:${PORT}`);
    });
    
    // Handle server shutdown
    const gracefulShutdown = async () => {
      console.log("\n🛑 Shutting down server...");
      server.close(async () => {
        console.log("✅ Server closed");
        process.exit(0);
      });
    };
    
    // Handle termination signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
