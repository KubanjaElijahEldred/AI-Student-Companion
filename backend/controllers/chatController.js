import axios from "axios";
import Message from "../models/Message.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: userId } = req.user;

    const aiResponse = await axios.post(
      `${process.env.AI_ENGINE_URL || "http://localhost:3001"}/api/respond`,
      { message: message },
    );
    const reply = aiResponse.data.response || aiResponse.data.reply;

    // Try to save to database, but don't fail if it's not available
    try {
      const messageData = await Message.create({ userId, content: message, response: reply });
      res.json({ response: reply, ...messageData.toJSON() });
    } catch (dbError) {
      console.log("Database not available, sending response without saving");
      res.json({ response: reply, userId, content: message, fallback: true });
    }
  } catch (err) {
    console.error('Chat controller error:', err);
    res.status(500).json({ error: "Chat service unavailable", fallback: "I'm having trouble connecting to the AI service. Please try again." });
  }
};
