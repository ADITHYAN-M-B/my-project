const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = require("./users");
const { verifyToken, authorizeRoles, SECRET_KEY } = require("./middleware/authMiddleware");

const app = express();
app.use(express.json());

// Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required." });

  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(400).json({ error: "Invalid username or password." });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

// Protected Routes
app.get("/admin/dashboard", verifyToken, authorizeRoles("Admin"), (req, res) => res.json({ message: "Welcome Admin!" }));
app.get("/moderator/manage", verifyToken, authorizeRoles("Moderator", "Admin"), (req, res) => res.json({ message: "Welcome Moderator!" }));
app.get("/user/profile", verifyToken, authorizeRoles("User", "Moderator", "Admin"), (req, res) => res.json({ message: `Welcome ${req.user.username}!` }));

// Start Server on Port 3001
app.listen(3001, () => console.log("Server running on http://localhost:3001"));
