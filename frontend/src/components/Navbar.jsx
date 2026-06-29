import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-[var(--color-paper)] shadow-[0_1px_0_var(--color-border),0_2px_6px_rgba(43,36,24,0.04)]">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <rect x="3" y="2" width="18" height="24" rx="2" fill="var(--color-accent)" />
            <rect x="6" y="6" width="12" height="2" rx="1" fill="var(--color-paper)" />
            <rect x="6" y="11" width="12" height="2" rx="1" fill="var(--color-paper)" />
            <rect x="6" y="16" width="8" height="2" rx="1" fill="var(--color-paper)" />
          </svg>
          <span className="font-[var(--font-display)] text-xl font-semibold">StudyBuddy</span>
        </Link>

        <div className="flex items-center gap-6 text-base font-medium">
          {user ? (
            <>
              <Link to="/quiz/new" className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">
                New Quiz
              </Link>
              <Link to="/history" className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">
                History
              </Link>
              <span className="hidden text-[var(--color-ink-soft)] sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-[var(--color-border)] px-4 py-1.5 hover:bg-[var(--color-paper-dark)]"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-[var(--color-accent)] px-4 py-1.5 text-white shadow-[var(--shadow-card)] hover:bg-[var(--color-accent-dark)]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;