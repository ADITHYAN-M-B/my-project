import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel"; // ✅ new import
import "./App.css";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
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
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
