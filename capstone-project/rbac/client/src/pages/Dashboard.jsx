import React from "react";
import { useAuth } from "../context/AuthContext";
import PostList from "../components/PostList";

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      {user && (
        <>
          <p>Logged in as: <strong>{user.role}</strong></p>
          <button onClick={logout}>Logout</button>
          <PostList />
        </>
      )}
    </div>
  );
}
