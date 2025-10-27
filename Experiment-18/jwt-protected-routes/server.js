const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Secret key for JWT signing (in production, use env variable)
const SECRET_KEY = 'mysecretkey';

// Middleware to parse JSON
app.use(bodyParser.json());

// Hardcoded user for simplicity
const user = {
  id: 1,
  username: 'testuser',
  password: 'password123' // never store plain passwords in real apps
};

// LOGIN ROUTE

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === user.username && password === user.password) {
    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ message: 'Login successful', token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});


// JWT VERIFICATION MIDDLEWARE

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Expecting Bearer token
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded; // attach decoded payload to request
    next();
  });
}


// PROTECTED ROUTE

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// ------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
