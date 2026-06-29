import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import ErrorBanner from "../components/ErrorBanner.jsx";
import Loader from "../components/Loader.jsx";

const QuizPlay = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // questions: [{ question, options }] — no correct answer revealed yet
  const [questions, setQuestions] = useState(location.state?.quiz?.questions || []);
  const [topic, setTopic] = useState(location.state?.quiz?.topic || "");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionIndex: "selected option" }
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If the page was opened directly (no navigation state, e.g. refresh),
  // fall back to fetching the quiz from the backend.
  useEffect(() => {
    if (questions.length === 0) {
      api
        .get(`/quiz/${id}`)
        .then(({ data }) => {
          setQuestions(data.quiz.questions.map((q) => ({ question: q.question, options: q.options })));
          setTopic(data.quiz.topic);
        })
        .catch(() => setError("Could not load this quiz."));
    }
  }, [id, questions.length]);

  const handleSelect = (option) => setSelected(option);

  const handleNext = () => {
    setAnswers({ ...answers, [current]: selected });
    setSelected(null);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    }
  };

  const handleGenerateMore = async () => {
    setLoadingMore(true);
    setError("");
    try {
      const { data } = await api.post(`/quiz/${id}/more`);
      setQuestions([...questions, ...data.questions]);
      setCurrent(questions.length); // jump to first new question
      setSelected(null);
    } catch (err) {
      setError(err.response?.data?.error || "Could not generate more questions.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = async () => {
    const finalAnswers = { ...answers, [current]: selected };
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        answers: Object.entries(finalAnswers).map(([questionIndex, answer]) => ({
          questionIndex: Number(questionIndex),
          answer,
        })),
      };
      const { data } = await api.post(`/quiz/${id}/submit`, payload);
      navigate(`/quiz/${id}/results`, { state: { results: data } });
    } catch (err) {
      setError(err.response?.data?.error || "Could not submit quiz. Please try again.");
      setSubmitting(false);
    }
  };

  if (questions.length === 0 && !error) {
    return <Loader label="Loading your quiz..." />;
  }

  const q = questions[current];
  const isLastQuestion = current === questions.length - 1;
  const canProceed = selected !== null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <ErrorBanner message={error} />

      {/* Step dots — shows progress without a generic progress bar */}
      <div className="mb-6 flex flex-wrap gap-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === current
                ? "w-6 bg-[var(--color-marker)]"
                : i < current || answers[i]
                ? "bg-[var(--color-sage)]"
                : "bg-[var(--color-border)]"
            } transition-all`}
          />
        ))}
      </div>

      {topic && <p className="margin-note">{topic}</p>}

      <div className="index-card mt-3 p-6">
        <h2 className="mb-1 text-sm font-medium text-[var(--color-ink-soft)]">
          Question {current + 1} of {questions.length}
        </h2>

        {q && (
          <>
            <p className="mt-3 text-xl font-medium leading-relaxed">{q.question}</p>

            <div className="mt-6 flex flex-col gap-3">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition ${
                    selected === option
                      ? "border-[var(--color-marker)] bg-[var(--color-marker)]/8 font-medium"
                      : "border-[var(--color-border)] bg-white hover:border-[var(--color-marker)]/40"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      selected === option
                        ? "bg-[var(--color-marker)] text-white"
                        : "bg-[var(--color-paper-dark)] text-[var(--color-ink-soft)]"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between">
              {!isLastQuestion ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="rounded-lg bg-[var(--color-marker)] px-6 py-2.5 font-medium text-white hover:bg-[var(--color-marker-dark)] disabled:opacity-40"
                >
                  Next question
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed || submitting}
                  className="rounded-lg bg-[var(--color-marker)] px-6 py-2.5 font-medium text-white hover:bg-[var(--color-marker-dark)] disabled:opacity-40"
                >
                  {submitting ? "Submitting..." : "Submit quiz"}
                </button>
              )}

              {isLastQuestion && (
                <button
                  onClick={handleGenerateMore}
                  disabled={loadingMore}
                  className="text-sm font-medium text-[var(--color-ink-soft)] underline hover:text-[var(--color-marker)] disabled:opacity-50"
                >
                  {loadingMore ? "Adding questions..." : "+ Generate more questions"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPlay;