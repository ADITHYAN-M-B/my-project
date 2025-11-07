// server/scripts/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Post from "../models/Post.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🌱 Connected to MongoDB");

    await User.deleteMany({});
    await Post.deleteMany({});

    const passwordHash = await bcrypt.hash("password123", 10);

    const admin = await User.create({
      email: "admin@example.com",
      passwordHash,
      role: "Admin",
    });
    const editor = await User.create({
      email: "editor@example.com",
      passwordHash,
      role: "Editor",
    });
    const viewer = await User.create({
      email: "viewer@example.com",
      passwordHash,
      role: "Viewer",
    });

    await Post.insertMany([
      { title: "Admin Post", body: "Post by Admin", authorId: admin._id },
      { title: "Editor Post", body: "Post by Editor", authorId: editor._id },
    ]);

    console.log("✅ Database seeded with sample users & posts!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seed();
