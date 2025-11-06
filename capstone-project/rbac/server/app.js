// server/app.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js";
import postRoutes from "./routes/PostRoutes.js";

dotenv.config();

const app = express();

// ✅ these MUST come before any routes
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());                         // <--- parses application/json
app.use(express.urlencoded({ extended: true })); // <--- parses form data
app.use(cookieParser());

// ✅ routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

// simple test route
app.get("/", (req, res) => res.send("API running"));

export default app;
