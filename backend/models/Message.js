import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  response: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
