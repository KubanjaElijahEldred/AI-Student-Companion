import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // If no MONGO_URI is set, use in-memory fallback
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/ai-student-companion";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.warn("⚠️ MongoDB Connection Warning:", err.message);
    console.log("🔄 Running in demo mode without database persistence");
    // Don't exit - allow app to run without database for demo purposes
  }
};

export default connectDB;
