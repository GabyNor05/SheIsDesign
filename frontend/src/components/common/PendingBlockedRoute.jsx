import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PendingBlockedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  const isAdmin = user.role?.toLowerCase() === "admin";
  if (user.status === "Pending" && !isAdmin) return <Navigate to="/" replace />;
  return children;
}
