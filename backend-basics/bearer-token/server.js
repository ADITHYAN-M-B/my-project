const express = require("express");
const app = express();
const PORT = 3010;

//Logging Middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

//Bearer Token Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1]; // Expect format: Bearer mysecrettoken
  if (token !== "mysecrettoken") {
    return res.status(403).json({ error: "Invalid or missing token" });
  }

  next();
};

//Apply logger globally
app.use(logger);

//Routes
app.get("/public", (req, res) => {
  res.json({ message: "This is a public route, no token required." });
});

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Welcome! You accessed a protected route." });
});

//Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
