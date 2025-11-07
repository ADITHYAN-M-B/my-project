// server/routes/PostRoutes.js
import express from "express";
import { authenticate } from "../middleware/AuthMiddleware.js";
import { can } from "../middleware/can.js"; 
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} from "../controllers/PostController.js";

const router = express.Router();

// GET - All roles with 'posts:read' can view posts
router.get("/", authenticate, can("posts:read"), getPosts);

// POST - Only roles with 'posts:create' (Admin, Editor)
router.post("/", authenticate, can("posts:create"), createPost);

// PUT - Editors can only update their own posts, Admin can update all
router.put("/:id", authenticate, can("posts:update:own"), updatePost);

// DELETE - Editors can delete own posts, Admin can delete any
router.delete("/:id", authenticate, can("posts:delete:own"), deletePost);

export default router;
