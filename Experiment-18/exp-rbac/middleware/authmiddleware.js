const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecretkey";

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token." });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden. You do not have permission." });
    }
    next();
  };
}

module.exports = { verifyToken, authorizeRoles, SECRET_KEY };
