import Quiz from "../models/Quiz.js";

/**
 * @route GET /api/history
 * Returns a lightweight list of the user's past quizzes (no full question
 * data — keeps the history page fast to load). Most recent first.
 */
export const getHistory = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("topic classLevel score totalQuestions status createdAt");

    res.status(200).json({ history: quizzes });
  } catch (error) {
    console.error("Get history error:", error.message);
    res.status(500).json({ error: "Could not load quiz history." });
  }
};

/**
 * @route GET /api/history/:id
 * Returns full details of one past quiz, for review.
 * (Reuses the same ownership-scoped pattern as getQuizById.)
 */
export const getHistoryDetail = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.status(200).json({ quiz });
  } catch (error) {
    console.error("Get history detail error:", error.message);
    res.status(500).json({ error: "Could not load quiz details." });
  }
};
