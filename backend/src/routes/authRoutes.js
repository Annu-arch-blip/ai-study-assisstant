import express from "express";
import rateLimit from "express-rate-limit";
import { signup, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  signupValidation,
  loginValidation,
  handleValidationErrors,
} from "../middleware/validators.js";

const router = express.Router();

// Stricter rate limit specifically on auth routes — prevents brute-force
// login attempts and signup spam, separate from the global API limiter.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many attempts. Please try again in 15 minutes." },
});

router.post("/signup", authLimiter, signupValidation, handleValidationErrors, signup);
router.post("/login", authLimiter, loginValidation, handleValidationErrors, login);
router.get("/me", protect, getMe);

export default router;
