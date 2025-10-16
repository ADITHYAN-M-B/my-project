import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

function AdminDashboard({ newStudent }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from JSONPlaceholder
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (newStudent) {
      // Normalize new student to match API data structure
      const student = {
        id: users.length + 1,
        name: newStudent.Name, // lowercase 'name'
        email: newStudent.email,
        age: newStudent.age,
      };
      setUsers((prev) => [...prev, student]);
    }
  }, [newStudent]);

  return (
    <>
      <input type="checkbox" id="Checkbox" />
      <div className="dashboard">
        <header>
          <h1>Admin Dashboard</h1>
          <label htmlFor="Checkbox" className="toggle-btn">Dark Mode</label>
        </header>

        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Users</a></li>
            <li><a href="#">Settings</a></li>
          </ul>
        </nav>

        <main>
          <h3>Welcome, Admin!</h3>
          <p>Fetched Users / Registered Students:</p>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name} | {user.email} | {user.age || "-"}
              </li>
            ))}
          </ul>
        </main>

        <footer>
          &copy; 2025 Admin Dashboard
        </footer>
      </div>
    </>
  );
}

export default AdminDashboard;
