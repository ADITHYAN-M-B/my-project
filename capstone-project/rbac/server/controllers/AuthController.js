import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// ✅ Define what each role can do
const rolePermissions = {
  Admin: ["posts:create", "posts:read", "posts:update", "posts:delete", "users:manage"],
  Editor: ["posts:create", "posts:read", "posts:update:own", "posts:delete:own"],
  Viewer: ["posts:read"],
};

// ✅ LOGIN CONTROLLER
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // 2️⃣ Compare the entered password with the stored bcrypt hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 3️⃣ Generate JWT token with role and userId
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4️⃣ Get permissions based on user role
    const permissions = rolePermissions[user.role] || [];

    // 5️⃣ Send success response
    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      permissions,
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ REGISTER CONTROLLER (optional, if you use it)
export const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      passwordHash: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ AUTH CHECK (used by frontend to validate token)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const permissions = rolePermissions[user.role] || [];

    res.status(200).json({
      email: user.email,
      role: user.role,
      permissions,
    });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
