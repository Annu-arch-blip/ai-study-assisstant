import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    userAnswer: { type: String, default: null }, // filled in when student answers
    isCorrect: { type: Boolean, default: null },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: { type: String, default: "" },
    classLevel: { type: String, default: "general" },
    questions: { type: [questionSchema], default: [] },
    score: { type: Number, default: null }, // null until quiz is submitted
    totalQuestions: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
