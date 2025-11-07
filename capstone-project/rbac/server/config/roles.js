// server/config/roles.js
// Centralized role → permission mapping used by AuthController, middleware, etc.

export const ROLE_PERMISSIONS = {
  Admin: [
    "*", // Admin can do everything
    "users:manage",
    "audit:read"
  ],
  Editor: [
    "posts:create",
    "posts:read",
    "posts:update:own",
    "posts:delete:own"
  ],
  Viewer: [
    "posts:read"
  ]
};

export const getPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};
