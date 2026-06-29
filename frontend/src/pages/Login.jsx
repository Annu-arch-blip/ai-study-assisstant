import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate("/quiz/new");
    } catch (err) {
      setError(err.response?.data?.error || "Could not log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6">
      <p className="margin-note">welcome back</p>
      <h1 className="mt-1 mb-2 text-3xl font-semibold">Log in</h1>
      <p className="mb-6 text-[var(--color-ink-soft)]">Pick up where you left off.</p>

      <form onSubmit={handleSubmit} className="index-card flex flex-col gap-4 p-6">
        <ErrorBanner message={error} />

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-[var(--color-border)] bg-white px-4 py-2.5 outline-none focus:border-[var(--color-marker)]"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-[var(--color-border)] bg-white px-4 py-2.5 outline-none focus:border-[var(--color-marker)]"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-[var(--color-marker)] px-4 py-2.5 font-medium text-white hover:bg-[var(--color-marker-dark)] disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
        New here?{" "}
        <Link to="/signup" className="font-medium text-[var(--color-marker)]">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;