import Quiz from "../models/Quiz.js";
import { generateQuizQuestions } from "../services/aiService.js";
import { retrieveRelevantContext } from "../utils/ragRetrieval.js";

/**
 * @route POST /api/quiz/generate
 * Creates a new quiz from a topic and/or pasted study text.
 * This is the main entry point for the "generate quiz" user story.
 */
export const generateQuiz = async (req, res) => {
  try {
    const { topic, studyText, classLevel } = req.body;

    // RAG step: if study text was pasted, retrieve only the most relevant
    // chunks instead of dumping everything into the AI prompt.
    const context = studyText ? retrieveRelevantContext(studyText, topic) : "";

    const result = await generateQuizQuestions({
      topic,
      context,
      classLevel: classLevel || req.user.classLevel,
      count: 10,
    });

    if (!result.success) {
      return res.status(502).json({ error: result.error });
    }

    // Save as an in-progress quiz tied to this user.
    // We store the FULL study text isn't needed long-term — only the
    // generated questions are persisted, keeping documents small.
    const quiz = await Quiz.create({
      user: req.user._id,
      topic: topic || "From pasted notes",
      classLevel: classLevel || req.user.classLevel,
      questions: result.questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })),
      totalQuestions: result.questions.length,
      status: "in-progress",
    });

    res.status(201).json({
      message: "Quiz generated successfully",
      quizId: quiz._id,
      topic: quiz.topic,
      // We don't send correctAnswer/explanation yet — those are revealed
      // only after the student answers, so they can't peek ahead.
      questions: quiz.questions.map((q) => ({
        question: q.question,
        options: q.options,
      })),
    });
  } catch (error) {
    console.error("Generate quiz error:", error.message);
    res.status(500).json({ error: "Could not generate quiz. Please try again." });
  }
};

/**
 * @route POST /api/quiz/:id/more
 * Adds more questions to an existing quiz, keeping the same topic context.
 */
export const generateMoreQuestions = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const result = await generateQuizQuestions({
      topic: quiz.topic,
      context: "", // original study text isn't stored long-term; topic carries context
      classLevel: quiz.classLevel,
      count: 5, // smaller follow-up batch
    });

    if (!result.success) {
      return res.status(502).json({ error: result.error });
    }

    const newQuestions = result.questions.map((q) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));

    quiz.questions.push(...newQuestions);
    quiz.totalQuestions = quiz.questions.length;
    await quiz.save();

    res.status(200).json({
      message: "More questions added",
      questions: newQuestions.map((q) => ({
        question: q.question,
        options: q.options,
      })),
    });
  } catch (error) {
    console.error("Generate more error:", error.message);
    res.status(500).json({ error: "Could not generate more questions. Please try again." });
  }
};

/**
 * @route POST /api/quiz/:id/submit
 * Accepts the student's answers, scores the quiz, and returns
 * the correct answers + explanations for review.
 *
 * Expected body: { answers: [{ questionIndex: 0, answer: "Paris" }, ...] }
 */
export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers must be a list" });
    }

    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    let correctCount = 0;

    for (const { questionIndex, answer } of answers) {
      const q = quiz.questions[questionIndex];
      if (!q) continue;

      q.userAnswer = answer;
      q.isCorrect = q.correctAnswer === answer;
      if (q.isCorrect) correctCount++;
    }

    quiz.score = correctCount;
    quiz.status = "completed";
    await quiz.save();

    res.status(200).json({
      message: "Quiz submitted",
      score: correctCount,
      totalQuestions: quiz.questions.length,
      // Now we DO reveal correct answers + explanations, for the review step
      questions: quiz.questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        userAnswer: q.userAnswer,
        isCorrect: q.isCorrect,
      })),
    });
  } catch (error) {
    console.error("Submit quiz error:", error.message);
    res.status(500).json({ error: "Could not submit quiz. Please try again." });
  }
};

/**
 * @route GET /api/quiz/:id
 * Fetch a single quiz (used when resuming or reviewing).
 */
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.status(200).json({ quiz });
  } catch (error) {
    console.error("Get quiz error:", error.message);
    res.status(500).json({ error: "Could not load quiz." });
  }
};
