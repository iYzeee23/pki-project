import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth-store";

export function ProtectedRoute() {
  const { token, me, isHydrated } = useAuthStore();
  const loc = useLocation();

  if (!isHydrated) return <div style={{ padding: 16 }}>Učitavanje...</div>;
  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />;
  if (!me) return <div style={{ padding: 16 }}>Učitavanje profila...</div>;
  if (!me.isAdmin) return <Navigate to="/login" replace />;

  return <Outlet />;
}
