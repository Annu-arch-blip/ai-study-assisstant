import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import NewQuiz from "./pages/NewQuiz.jsx";
import QuizPlay from "./pages/QuizPlay.jsx";
import QuizResults from "./pages/QuizResults.jsx";
import History from "./pages/History.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/quiz/new"
              element={
                <ProtectedRoute>
                  <NewQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:id/play"
              element={
                <ProtectedRoute>
                  <QuizPlay />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:id/results"
              element={
                <ProtectedRoute>
                  <QuizResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
