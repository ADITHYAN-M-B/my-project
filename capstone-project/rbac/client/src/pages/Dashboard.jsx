import React from "react";
import { useAuth } from "../context/AuthContext";
import PostList from "../components/PostList";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        backgroundColor: "#f2f2f2",
        minHeight: "100vh",
        fontFamily: "Poppins, Segoe UI, Tahoma, sans-serif",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          backgroundColor: "#2b6777",
          color: "white",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ margin: 0 }}>RBAC Dashboard</h1>
        {user && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "1rem" }}>
              Logged in as:{" "}
              <strong style={{ color: "#c8d8e4" }}>{user.role}</strong>
            </span>
            <button
              onClick={logout}
              style={{
                backgroundColor: "#ffffff",
                color: "#2b6777",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Dashboard Content */}
      <main
        style={{
          maxWidth: "900px",
          margin: "2rem auto",
          padding: "2rem",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          border: "1px solid #c8d8e4",
        }}
      >
        <h2
          style={{
            color: "#2b6777",
            borderBottom: "2px solid #52ab98",
            display: "inline-block",
            paddingBottom: "4px",
            marginBottom: "1.5rem",
          }}
        >
          Posts
        </h2>

        <PostList />
      </main>
    </div>
  );
}
