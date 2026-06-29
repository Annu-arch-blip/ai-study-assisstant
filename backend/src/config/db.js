import mongoose from "mongoose";

/**
 * Connects to MongoDB Atlas.
 *
 * Why this matters (learned from your past ECONNREFUSED issue):
 * - We log a clear, human-readable error instead of letting the app crash silently.
 * - We exit the process on failure so you immediately know the DB didn't connect,
 *   instead of the server running "successfully" but every request failing later.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed.");
    console.error("Common fixes:");
    console.error("  1. Check your IP is whitelisted in MongoDB Atlas (Network Access tab)");
    console.error("  2. Check your username/password in MONGODB_URI are correct");
    console.error("  3. Check the cluster name in the URI matches your Atlas cluster");
    console.error("Raw error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
