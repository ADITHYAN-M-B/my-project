const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3010;
const SECRET_KEY = "mysecrettoken"; // Secret key for signing JWT

app.use(bodyParser.json());

//Fake User
const USER = {
  username: "admin",
  password: "password",
};

//Middleware to Verify JWT 
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

//Banking Data 
let balance = 1000; // Starting balance

//Routes
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/balance", authenticateJWT, (req, res) => {
  res.json({ balance });
});

app.post("/deposit", authenticateJWT, (req, res) => {
  const { amount } = req.body;
  balance += amount;
  res.json({ message: `Deposited ${amount}`, balance });
});

app.post("/withdraw", authenticateJWT, (req, res) => {
  const { amount } = req.body;
  if (amount > balance) {
    return res.status(400).json({ error: "Insufficient balance" });
  }
  balance -= amount;
  res.json({ message: `Withdrew ${amount}`, balance });
});

//Start Server
app.listen(PORT, () => {
  console.log(`Banking API running on http://localhost:${PORT}`);
});
