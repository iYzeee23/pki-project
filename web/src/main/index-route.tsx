import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth-store";

export function IndexRoute() {
  const { isHydrated, token } = useAuthStore();

  if (!isHydrated) return <div style={{ padding: 16 }}>Učitavanje...</div>;

  return token ? <Navigate to="/profile" replace /> : <Navigate to="/login" replace />;
}
