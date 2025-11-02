import axios from "axios";
import Message from "../models/Message.js";

export const chatWithAI = async (req, res) => {
  try {
    const { content } = req.body;
    const { id: userId } = req.user;

    const aiResponse = await axios.post(
      `${process.env.AI_ENGINE_URL || "http://localhost:3001"}/api/respond`,
      { message: content },
    );
    const reply = aiResponse.data.reply;

    const message = await Message.create({ userId, content, response: reply });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Chat service unavailable" });
  }
};
