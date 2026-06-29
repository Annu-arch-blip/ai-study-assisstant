import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";

const QuizResults = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [results, setResults] = useState(location.state?.results || null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!results) {
      api
        .get(`/quiz/${id}`)
        .then(({ data }) => {
          setResults({
            score: data.quiz.score,
            totalQuestions: data.quiz.questions.length,
            questions: data.quiz.questions,
          });
        })
        .catch(() => setError("Could not load these results."));
    }
  }, [id, results]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <ErrorBanner message={error} />
      </div>
    );
  }

  if (!results) return <Loader label="grading your paper..." />;

  const { score, totalQuestions, questions } = results;
  const percentage = Math.round((score / totalQuestions) * 100);

  const stampWord =
    percentage >= 90 ? "Excellent!" : percentage >= 70 ? "Good job!" : percentage >= 50 ? "Keep going!" : "Try again!";
  const stampColor = percentage >= 70 ? "var(--color-sage)" : "var(--color-red-pen)";

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="index-card relative overflow-hidden p-8 text-center">
        <div
          className="grade-stamp absolute -right-4 top-6 px-4 py-2 text-lg"
          style={{ color: stampColor }}
        >
          {stampWord}
        </div>

        <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
          Your score
        </p>
        <p className="mt-2 text-5xl font-semibold" style={{ color: stampColor }}>
          {score} / {totalQuestions}
        </p>
        <p className="mt-2 text-[var(--color-ink-soft)]">{percentage}% correct</p>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => navigate("/quiz/new")}
          className="flex-1 rounded-lg bg-[var(--color-marker)] px-4 py-2.5 font-medium text-white hover:bg-[var(--color-marker-dark)]"
        >
          New quiz
        </button>
        <button
          onClick={() => navigate("/history")}
          className="flex-1 rounded-lg border-2 border-[var(--color-border)] px-4 py-2.5 font-medium hover:bg-[var(--color-paper-dark)]"
        >
          View history
        </button>
      </div>

      <p className="margin-note mt-10">let's review what you missed</p>
      <h2 className="mb-4 text-xl font-semibold">Review your answers</h2>
      <div className="flex flex-col gap-4">
        {questions.map((q, i) => (
          <div
            key={i}
            className={`index-card p-5 ${
              q.isCorrect ? "border-l-4 border-l-[var(--color-sage)]" : "border-l-4 border-l-[var(--color-red-pen)]"
            }`}
          >
            <p className="font-medium">
              {i + 1}. {q.question}
            </p>

            <div className="mt-3 flex flex-col gap-1.5 text-sm">
              <p>
                <span className="font-medium">Your answer: </span>
                <span className={q.isCorrect ? "text-[var(--color-sage)]" : "text-[var(--color-red-pen)]"}>
                  {q.userAnswer || "Not answered"}
                </span>
              </p>
              {!q.isCorrect && (
                <p>
                  <span className="font-medium">Correct answer: </span>
                  <span className="text-[var(--color-sage)]">{q.correctAnswer}</span>
                </p>
              )}
            </div>

            <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
              <span className="font-medium text-[var(--color-ink)]">Why: </span>
              {q.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizResults;