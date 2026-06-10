import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthRequiredRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
}
