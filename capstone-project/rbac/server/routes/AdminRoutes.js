import express from "express";
import { authenticate } from "../middleware/AuthMiddleware.js";
import { can } from "../middleware/can.js"; // your RBAC check middleware
import { listUsers, changeRole } from "../controllers/adminController.js";

const router = express.Router();
router.get("/users", authenticate, can("users:manage"), listUsers);
router.patch("/users/:id/role", authenticate, can("users:manage"), changeRole);
export default router;
