import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import useCan from "../hooks/UseCan";

export default function PostList() {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const canCreate = useCan("posts:create");
  const canUpdate = useCan("posts:update:own");
  const canDelete = useCan("posts:delete:own");

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/posts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPosts(res.data))
      .catch(console.error);
  }, [token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Posts</h2>
      {canCreate && <button onClick={() => alert("Create new post UI here!")}>+ New Post</button>}
      {posts.map((p) => (
        <div key={p._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
          {(canUpdate || user?.role === "Admin") && <button>Edit</button>}
          {(canDelete || user?.role === "Admin") && <button>Delete</button>}
        </div>
      ))}
    </div>
  );
}
