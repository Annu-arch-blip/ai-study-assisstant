import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";

const CLASS_LEVELS = [
  { value: "1-5", label: "Class 1–5" },
  { value: "6-8", label: "Class 6–8" },
  { value: "9-10", label: "Class 9–10" },
  { value: "11-12", label: "Class 11–12" },
  { value: "college", label: "College" },
  { value: "exam-prep", label: "Exam Prep" },
  { value: "other", label: "Other" },
];

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", classLevel: "other" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(form);
      navigate("/quiz/new");
    } catch (err) {
      setError(err.response?.data?.error || "Could not create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6">
      <p className="margin-note">let's get you set up</p>
      <h1 className="mt-1 mb-2 text-3xl font-semibold">Create your account</h1>
      <p className="mb-6 text-[var(--color-ink-soft)]">Free, and takes less than a minute.</p>

      <form onSubmit={handleSubmit} className="index-card flex flex-col gap-4 p-6">
        <ErrorBanner message={error} />

        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-[var(--color-border)] bg-white px-4 py-2.5 outline-none focus:border-[var(--color-marker)]"
            placeholder="Your name"
          />
        </div>

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
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-[var(--color-border)] bg-white px-4 py-2.5 outline-none focus:border-[var(--color-marker)]"
            placeholder="At least 6 characters"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">I'm studying at</label>
          <select
            name="classLevel"
            value={form.classLevel}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-[var(--color-border)] bg-white px-4 py-2.5 outline-none focus:border-[var(--color-marker)]"
          >
            {CLASS_LEVELS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-[var(--color-marker)] px-4 py-2.5 font-medium text-white hover:bg-[var(--color-marker-dark)] disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-[var(--color-marker)]">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Signup;