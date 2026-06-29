import axios from "axios";

/**
 * Centralized API client. Every request automatically attaches the JWT
 * (if we have one) so individual components never have to think about it.
 *
 * Set VITE_API_URL in a .env file in the frontend folder when deploying
 * (e.g. VITE_API_URL=https://your-backend.onrender.com/api).
 * Defaults to local backend for development.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token expires or is invalid, the backend sends 401 — we clear
// the stale token so the user isn't stuck in a broken logged-in state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;
