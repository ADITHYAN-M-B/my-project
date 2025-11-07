import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js"; 
import { ROLE_PERMISSIONS } from "../config/roles.js"; 

/**
 * @desc Get all users (Admin only)
 */
export const listUsers = async (req, res) => {
  try {
    const users = await User.find({}, "email role createdAt");
    res.json(users);
  } catch (err) {
    console.error("Error listing users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

/**
 * @desc Change user role (Admin only)
 */
export const changeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    // Validate new role against known roles
    if (!Object.keys(ROLE_PERMISSIONS).includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const updated = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!updated) return res.status(404).json({ message: "User not found" });

    // Create audit log entry
    await AuditLog.create({
      actorId: req.user.id, // Admin performing the action
      action: "CHANGE_ROLE",
      target: updated.email,
      details: { newRole: role },
    });

    res.json({
      message: `Role updated successfully for ${updated.email}`,
      updatedUser: updated,
    });
  } catch (err) {
    console.error("Error changing role:", err);
    res.status(500).json({ message: "Error updating role" });
  }
};
