// server/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pino from "pino-http";
import requestId from "express-request-id";
import authRoutes from "./routes/AuthRoutes.js";
import postRoutes from "./routes/PostRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";

dotenv.config();
const app = express();

// ---------------- Security Middleware ----------------
app.use(helmet());
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// ---------------- Core Middleware ----------------
app.use(requestId());
app.use(
  pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    customLogLevel: (res, err) => {
      if (res.statusCode >= 500 || err) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------------- Routes ----------------
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/admin", adminRoutes);

// ---------------- Test Route ----------------
app.get("/", (req, res) => res.send("API running"));

export default app;
