import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import useCan from "../hooks/UseCan";

export default function PostList() {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const canCreate = useCan("posts:create");
  const canUpdate = useCan("posts:update:own");
  const canDelete = useCan("posts:delete:own");

  // Fetch posts
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("http://localhost:5000/posts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPosts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  // Create post
  const handleCreate = async () => {
    const title = prompt("Enter post title:");
    const body = prompt("Enter post content:");
    if (!title || !body) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/posts",
        { title, body },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) => [res.data, ...prev]);
      alert("✅ Post created successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ You are not allowed to create a post");
    }
  };

  //  Edit post
  const handleEdit = async (id) => {
    const newTitle = prompt("Enter new title:");
    const newBody = prompt("Enter new content:");
    if (!newTitle && !newBody) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/posts/${id}`,
        { title: newTitle, body: newBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? res.data : p))
      );
      alert("✅ Post updated!");
    } catch (err) {
      console.error(err);
      alert("❌ You can only edit your own posts.");
    }
  };

  // Delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:5000/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
      alert("✅ Post deleted successfully");
    } catch (err) {
      console.error(err);
      alert("❌ You can only delete your own posts.");
    }
  };

  if (loading) return <p>Loading posts...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Posts</h2>

      {canCreate && (
        <button
          onClick={handleCreate}
          style={{
            marginBottom: "1rem",
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          + New Post
        </button>
      )}

      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{p.title}</h3>
            <p>{p.body}</p>

            <div style={{ marginTop: "10px" }}>
              {(canUpdate || user?.role === "Admin") && (
                <button
                  onClick={() => handleEdit(p._id)}
                  style={{
                    marginRight: "10px",
                    padding: "6px 10px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#ffc107",
                    color: "black",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              )}

              {(canDelete || user?.role === "Admin") && (
                <button
                  onClick={() => handleDelete(p._id)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#dc3545",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
