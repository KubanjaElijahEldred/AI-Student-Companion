import express from "express";
import { chatWithAI } from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", authMiddleware, chatWithAI);

export default router;
