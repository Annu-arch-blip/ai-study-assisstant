import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

/**
 * Wraps the whole app. Provides `user`, `login()`, `signup()`, `logout()`
 * to any component via useAuth(). This is the single source of truth
 * for "is someone logged in right now."
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if a token is already saved (e.g. page refresh)
  // and verify it's still valid by asking the backend who we are.
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signup = async (formData) => {
    const { data } = await api.post("/auth/signup", formData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const login = async (formData) => {
    const { data } = await api.post("/auth/login", formData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
