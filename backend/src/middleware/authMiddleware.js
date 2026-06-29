import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protects routes by requiring a valid JWT in the Authorization header.
 * Format expected: "Authorization: Bearer <token>"
 *
 * This is what enforces "users can only access their own data" —
 * req.user is attached here and every controller downstream uses
 * req.user._id to scope queries, instead of trusting any ID sent by the client.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorized. Please log in." });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Session expired or invalid. Please log in again." });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    // Never let an auth check crash the server — fail safely with a 401 instead.
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ error: "Authentication failed." });
  }
};
