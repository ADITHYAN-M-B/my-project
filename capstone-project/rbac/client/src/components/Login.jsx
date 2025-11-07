import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/"); 
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="login-title">Welcome</h1>
        <p className="login-subtitle">Sign in to access your dashboard</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
