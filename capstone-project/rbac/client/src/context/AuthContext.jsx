import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true); // ✅ NEW

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const res = await axios.get("http://localhost:5000/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser({
            role: res.data.role,
            permissions: res.data.permissions || [],
          });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
      } finally {
        setLoading(false); // ✅ finish loading
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post("http://localhost:5000/auth/login", {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser({
      role: res.data.role,
      permissions: res.data.permissions || [],
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
