import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <p className="margin-note">grab your notes, let's begin →</p>

      <h1 className="mt-3 text-5xl font-semibold leading-tight">
        Turn anything you're studying into a{" "}
        <span className="pencil-underline">quick quiz</span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--color-ink-soft)]">
        Type a topic, or paste your notes, chapter, or question paper. StudyBuddy builds a
        simple quiz with easy explanations — for any class, from 1 to college.
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <Link
          to={user ? "/quiz/new" : "/signup"}
          className="rounded-lg bg-[var(--color-marker)] px-6 py-3 font-semibold text-white shadow-[var(--shadow-card)] transition hover:bg-[var(--color-marker-dark)] hover:shadow-[var(--shadow-card-hover)]"
        >
          {user ? "Start a new quiz" : "Get started — it's free"}
        </Link>
        {!user && (
          <Link
            to="/login"
            className="rounded-lg border-2 border-[var(--color-ink)] px-6 py-3 font-semibold transition hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
          >
            Log in
          </Link>
        )}
      </div>

      <div className="mt-24 grid gap-8 text-left sm:grid-cols-3">
        <div className="index-card tilt-l p-6">
          <span className="text-3xl">📝</span>
          <h3 className="mt-4 font-semibold">Type or paste</h3>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            A topic in plain English, or your own notes and question papers.
          </p>
        </div>
        <div className="index-card p-6 sm:mt-3">
          <span className="text-3xl">🎯</span>
          <h3 className="mt-4 font-semibold">Practice one at a time</h3>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Up to 10 questions, with simple explanations for every answer.
          </p>
        </div>
        <div className="index-card tilt-r p-6">
          <span className="text-3xl">📈</span>
          <h3 className="mt-4 font-semibold">Track your progress</h3>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            See your score and revisit past quizzes anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;