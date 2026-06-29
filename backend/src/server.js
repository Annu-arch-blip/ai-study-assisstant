import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

dotenv.config();

const app = express();
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Connect to database
connectDB();

//  Security middleware
app.use(helmet()); // sets safe HTTP headers

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Limit body size — prevents someone pasting a 50MB "note" and crashing the server
app.use(express.json({ limit: "1mb" }));

// Rate limiting 
// Applies to ALL routes. This protects both our server AND our free Gemini quota
// from being exhausted by one user spamming requests.
const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/history", historyRoutes);

// Health check — useful for confirming the server is alive during deployment
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "AI Study Quiz Assistant API is running" });
});

//  404 handler 
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler 
// Catches anything thrown anywhere in the app so the server NEVER crashes
// on an unhandled error. This is the safety net for the crash issues you've hit before.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong on the server.",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

// ===== Catch crashes that escape Express entirely =====
// Without this, one bad async error anywhere (e.g. inside the AI service)
// can kill the whole Node process. This is exactly the kind of crash
// you hit in aiService.js before — this is the fix for that class of bug.
process.on("unhandledRejection", (reason) => {
  console.error(" Unhandled Promise Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error(" Uncaught Exception:", err);
});
