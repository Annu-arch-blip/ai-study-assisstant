import express from "express";
import rateLimit from "express-rate-limit";
import {
  generateQuiz,
  generateMoreQuestions,
  submitQuiz,
  getQuizById,
} from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  quizGenerationValidation,
  handleValidationErrors,
} from "../middleware/validators.js";

const router = express.Router();

// AI calls are the most expensive operation in this app (cost + quota-wise),
// so we rate-limit them tighter than general API routes.
const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 15,
  message: { error: "You're generating quizzes too fast. Please wait a few minutes." },
});

router.post(
  "/generate",
  protect,
  aiLimiter,
  quizGenerationValidation,
  handleValidationErrors,
  generateQuiz
);
router.post("/:id/more", protect, aiLimiter, generateMoreQuestions);
router.post("/:id/submit", protect, submitQuiz);
router.get("/:id", protect, getQuizById);

export default router;
