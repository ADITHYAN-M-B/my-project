// server/middleware/can.js
import { ROLE_PERMISSIONS } from "../config/roles.js";
import Post from "../models/Post.js";

/**
 * can(permission)
 * can('posts:update:own') → only editors can update their own posts
 */
export const can = (permission) => async (req, res, next) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.id;

    if (!role) return res.status(401).json({ message: "Unauthorized" });

    const permissions = ROLE_PERMISSIONS[role] || [];

    // Admin wildcard
    if (permissions.includes("*")) return next();

    // Direct permission match
    if (permissions.includes(permission)) return next();

    // Ownership-based permission (e.g., posts:update:own)
    if (permission.endsWith(":own")) {
      const [base] = permission.split(":own");
      const basePerm = `${base}:own`;
      if (!permissions.includes(basePerm))
        return res.status(403).json({ message: "Forbidden" });

      // Validate ownership
      const post = await Post.findById(req.params.id);
      if (post && post.authorId.toString() === userId) return next();
    }

    return res.status(403).json({ message: "Permission denied" });
  } catch (err) {
    console.error("can() middleware error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
