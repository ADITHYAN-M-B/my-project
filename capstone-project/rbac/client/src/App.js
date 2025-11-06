import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css";

// ✅ Updated ProtectedRoute with loading check
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show this temporarily while checking token
  if (loading) return <p>Loading...</p>;

  // Once loading finishes, decide where to go
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
