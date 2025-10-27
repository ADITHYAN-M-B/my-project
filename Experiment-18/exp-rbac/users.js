const bcrypt = require("bcryptjs");

const users = [
  { id: 1, username: "admin", password: bcrypt.hashSync("admin123", 8), role: "Admin" },
  { id: 2, username: "moderator", password: bcrypt.hashSync("mod123", 8), role: "Moderator" },
  { id: 3, username: "user", password: bcrypt.hashSync("user123", 8), role: "User" }
];

module.exports = users;
