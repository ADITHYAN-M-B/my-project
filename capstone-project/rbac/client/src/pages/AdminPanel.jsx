import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);

  // Load users only if logged in as Admin
  useEffect(() => {
    if (user?.role !== "Admin") return;
    axios
      .get("http://localhost:5000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, [user, token]);

  const handleRoleChange = (id, newRole) => {
    axios
      .patch(
        `http://localhost:5000/admin/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
        );
      })
      .catch(console.error);
  };

  if (user?.role !== "Admin") return <p>Access Denied</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Panel</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Email</th>
            <th>Current Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
