import { useAuth } from "../context/AuthContext";

export default function useCan(permission) {
  const { user } = useAuth();
  if (!user) return false; 
  if (!user.permissions) return false; 
  if (user.permissions.includes("*")) return true;
  return user.permissions.includes(permission);
}
