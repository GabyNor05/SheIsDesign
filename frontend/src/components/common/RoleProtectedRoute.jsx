import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RoleProtectedRoute({ role, children }) {
  const { user } = useAuth();
  if (!user || user.role?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }
  return children;
}
