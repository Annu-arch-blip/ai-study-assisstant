import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import ErrorBanner from "../components/ErrorBanner.jsx";
import Loader from "../components/Loader.jsx";

const NewQuiz = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("topic"); // "topic" | "paste"
  const [topic, setTopic] = useState("");
  const [studyText, setStudyText] = useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "topic" && !topic.trim()) {
      setError("Please type a topic to make a quiz about.");
      return;
    }
    if (mode === "paste" && !studyText.trim()) {
      setError("Please paste some notes or text first.");
      return;
    }

    setGenerating(true);
    try {
      const payload =
        mode === "topic" ? { topic: topic.trim() } : { studyText: studyText.trim(), topic: topic.trim() };

      const { data } = await api.post("/quiz/generate", payload);
      navigate(`/quiz/${data.quizId}/play`, { state: { quiz: data } });
    } catch (err) {
      setError(err.response?.data?.error || "Could not generate quiz right now. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (generating) {
    return <Loader label="building your quiz..." />;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="margin-note">step 1 — pick a way to start</p>
      <h1 className="mt-2 text-3xl font-semibold">Make a quiz</h1>
      <p className="mt-2 text-[var(--color-ink-soft)]">
        Choose a topic, or paste your own notes, chapter, or question paper.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMode("topic")}
          className={`index-card tilt-l relative flex flex-col items-start gap-2 p-5 text-left ${
            mode === "topic" ? "ring-2 ring-[var(--color-marker)]" : ""
          }`}
        >
          {mode === "topic" && <span className="pin-dot" />}
          <span className="text-2xl">✍️</span>
          <span className="font-semibold">Type a topic</span>
          <span className="text-sm text-[var(--color-ink-soft)]">
            Just tell us what you're studying — we'll build the quiz from scratch.
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMode("paste")}
          className={`index-card tilt-r relative flex flex-col items-start gap-2 p-5 text-left ${
            mode === "paste" ? "ring-2 ring-[var(--color-marker)]" : ""
          }`}
        >
          {mode === "paste" && <span className="pin-dot" />}
          <span className="text-2xl">📋</span>
          <span className="font-semibold">Paste notes / chapter</span>
          <span className="text-sm text-[var(--color-ink-soft)]">
            Drop in your notes, chapter text, or question paper directly.
          </span>
        </button>
      </div>

      <form onSubmit={handleGenerate} className="index-card mt-7 flex flex-col gap-4 p-6">
        <ErrorBanner message={error} />

        {mode === "topic" ? (
          <div>
            <label className="mb-1 block text-sm font-medium">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Photosynthesis, Indian Independence Movement, Fractions"
              className="w-full rounded-lg border-2 border-[var(--color-border)] bg-white px-4 py-2.5 outline-none focus:border-[var(--color-marker)]"
            />
          </div>
        ) : (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium">Topic (optional, helps focus the quiz)</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Chapter 4 — Cell Structure"
                className="w-full rounded-lg border-2 border-[var(--color-border)] bg-white px-4 py-2.5 outline-none focus:border-[var(--color-marker)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Paste your notes, chapter, or question paper</label>
              <textarea
                rows={10}
                value={studyText}
                onChange={(e) => setStudyText(e.target.value)}
                placeholder="Paste your study material here..."
                className="w-full rounded-lg border-2 border-[var(--color-border)] bg-white px-4 py-2.5 outline-none focus:border-[var(--color-marker)]"
              />
              <p className="mt-1 text-xs text-[var(--color-ink-soft)]">Max ~20,000 characters.</p>
            </div>
          </>
        )}

        <button
          type="submit"
          className="mt-2 rounded-lg bg-[var(--color-marker)] px-4 py-3.5 font-semibold text-white shadow-[var(--shadow-card)] transition hover:bg-[var(--color-marker-dark)] hover:shadow-[var(--shadow-card-hover)]"
        >
          Generate quiz
        </button>
      </form>
    </div>
  );
};

export default NewQuiz;