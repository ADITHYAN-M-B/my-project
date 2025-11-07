// server/controllers/PostController.js
import Post from "../models/Post.js";

/**
 * Create a new post
 * Accessible by Admin and Editor roles (validated by can('posts:create'))
 */
export const createPost = async (req, res) => {
  try {
    const post = new Post({ ...req.body, authorId: req.user.id });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Error creating post" });
  }
};

/**
 * Get all posts
 * Data scoping: Editors only see their own posts
 */
export const getPosts = async (req, res) => {
  try {
    let filter = {};

    // Editors only see their own posts
    if (req.user.role === "Editor") {
      filter = { authorId: req.user.id };
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Get posts error:", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

/**
 * Update a post
 * Ownership verified by can('posts:update:own') middleware
 */
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Extra safety: Admin can update any, Editors can update own
    if (req.user.role !== "Admin" && post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden: not your post" });
    }

    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Update post error:", err);
    res.status(500).json({ message: "Error updating post" });
  }
};

/**
 * Delete a post
 * Ownership verified by can('posts:delete:own') middleware
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (req.user.role !== "Admin" && post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden: not your post" });
    }

    await post.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Error deleting post" });
  }
};
