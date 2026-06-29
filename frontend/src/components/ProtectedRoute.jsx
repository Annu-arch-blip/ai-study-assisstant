import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "./Loader.jsx";

/**
 * Wraps any route that requires login. Mirrors the backend's `protect`
 * middleware — same concept, just on the frontend side, so logged-out
 * users never even see the quiz/history pages flash before redirecting.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking your session..." />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
