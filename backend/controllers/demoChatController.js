import axios from "axios";

// Demo messages storage (in-memory for demo purposes)
const demoMessages = new Map();

export const chatWithAI = async (req, res) => {
  try {
    const { content } = req.body;
    const { id: userId } = req.user;

    if (!content) {
      return res.status(400).json({ error: "Message content is required" });
    }

    console.log(`💬 User ${userId} asked: "${content}"`);

    // Get AI response from the AI engine
    const aiEngineUrl = process.env.AI_ENGINE_URL || "http://localhost:3001";
    const aiResponse = await axios.post(`${aiEngineUrl}/api/respond`, {
      message: content
    }, {
      timeout: 5000 // 5 second timeout
    });

    const reply = aiResponse.data.reply;

    console.log(`🤖 AI responded: "${reply}"`);

    // Store message in demo storage
    const messageId = Date.now().toString();
    const messageData = {
      id: messageId,
      userId,
      content,
      response: reply,
      timestamp: new Date()
    };

    // Store in user's message history
    if (!demoMessages.has(userId)) {
      demoMessages.set(userId, []);
    }
    demoMessages.get(userId).push(messageData);

    // Keep only last 50 messages per user to prevent memory issues
    const userMessages = demoMessages.get(userId);
    if (userMessages.length > 50) {
      userMessages.splice(0, userMessages.length - 50);
    }

    res.json({
      id: messageId,
      userId,
      content,
      response: reply,
      timestamp: messageData.timestamp
    });

  } catch (err) {
    console.error("Chat error:", err);

    // Provide helpful error messages based on the error type
    if (err.code === 'ECONNREFUSED') {
      res.status(503).json({
        error: "AI service unavailable. Please make sure the AI engine is running on port 3001."
      });
    } else if (err.response) {
      res.status(500).json({
        error: `AI service error: ${err.response.data?.error || err.response.statusText}`
      });
    } else if (err.request) {
      res.status(503).json({
        error: "Unable to reach AI service. Please check your connection."
      });
    } else {
      res.status(500).json({
        error: "Chat service temporarily unavailable"
      });
    }
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const limit = parseInt(req.query.limit) || 20;

    const userMessages = demoMessages.get(userId) || [];
    const recentMessages = userMessages.slice(-limit);

    res.json({
      messages: recentMessages,
      totalCount: userMessages.length
    });
  } catch (err) {
    console.error("Chat history error:", err);
    res.status(500).json({ error: "Unable to retrieve chat history" });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    const { id: userId } = req.user;

    if (demoMessages.has(userId)) {
      demoMessages.delete(userId);
      console.log(`🧹 Chat history cleared for user ${userId}`);
    }

    res.json({ message: "Chat history cleared successfully" });
  } catch (err) {
    console.error("Clear chat history error:", err);
    res.status(500).json({ error: "Unable to clear chat history" });
  }
};

// Get demo chat stats
export const getDemoChatStats = async (req, res) => {
  try {
    let totalMessages = 0;
    const userStats = [];

    for (const [userId, messages] of demoMessages) {
      totalMessages += messages.length;
      userStats.push({
        userId,
        messageCount: messages.length,
        lastMessage: messages[messages.length - 1]?.timestamp || null
      });
    }

    res.json({
      totalUsers: demoMessages.size,
      totalMessages,
      userStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
