import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/history")
      .then(({ data }) => setHistory(data.history))
      .catch(() => setError("Could not load your quiz history."));
  }, []);

  const handleOpen = (quiz) => {
    if (quiz.status === "completed") {
      navigate(`/quiz/${quiz._id}/results`);
    } else {
      navigate(`/quiz/${quiz._id}/play`);
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <ErrorBanner message={error} />
      </div>
    );
  }

  if (!history) return <Loader label="flipping through your notebook..." />;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="margin-note">your notebook</p>
      <h1 className="mt-2 text-3xl font-semibold">Quiz history</h1>

      {history.length === 0 ? (
        <div className="mt-8 rounded-lg border-2 border-dashed border-[var(--color-border)] p-10 text-center">
          <p className="text-[var(--color-ink-soft)]">No quizzes yet. Once you make one, it'll show up here.</p>
          <button
            onClick={() => navigate("/quiz/new")}
            className="mt-4 rounded-lg bg-[var(--color-marker)] px-5 py-2.5 font-medium text-white hover:bg-[var(--color-marker-dark)]"
          >
            Make your first quiz
          </button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {history.map((quiz) => (
            <button
              key={quiz._id}
              onClick={() => handleOpen(quiz)}
              className="index-card flex items-center justify-between p-5 text-left"
            >
              <div>
                <p className="font-medium">{quiz.topic || "Untitled quiz"}</p>
                <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                  {new Date(quiz.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {quiz.totalQuestions} questions
                </p>
              </div>

              {quiz.status === "completed" ? (
                <span className="rounded-full bg-[var(--color-sage-bg)] px-3 py-1 text-sm font-medium text-[var(--color-sage)]">
                  {quiz.score}/{quiz.totalQuestions}
                </span>
              ) : (
                <span className="rounded-full bg-[var(--color-paper-dark)] px-3 py-1 text-sm font-medium text-[var(--color-ink-soft)]">
                  In progress
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;