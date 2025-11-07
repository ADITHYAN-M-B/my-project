import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi from "joi";
import User from "../models/User.js";
import { getPermissionsForRole } from "../config/roles.js"; // ✅ Use centralized permissions

//  LOGIN CONTROLLER WITH VALIDATION
export const login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // JWT payload now uses consistent naming
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const permissions = getPermissionsForRole(user.role); // ✅ From config file

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

// REGISTER CONTROLLER WITH VALIDATION
export const register = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("Admin", "Editor", "Viewer").required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

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

// AUTH CHECK (used by frontend to validate token)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // ✅ aligned with JWT payload
    if (!user) return res.status(404).json({ message: "User not found" });

    const permissions = getPermissionsForRole(user.role); // ✅ From config file

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
