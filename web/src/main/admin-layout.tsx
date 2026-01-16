import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/auth-store";

const linkStyle: React.CSSProperties = { padding: "10px 12px", textDecoration: "none" };

export function AdminLayout() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid #ddd", padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Admin</div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <NavLink to="/map" style={linkStyle}>Map</NavLink>
          <NavLink to="/rentals" style={linkStyle}>Rentals</NavLink>
          <NavLink to="/issues" style={linkStyle}>Issues</NavLink>
          <NavLink to="/profile" style={linkStyle}>Profile</NavLink>
        </nav>

        <div style={{ marginTop: 16 }}>
          <button onClick={logout}>Logout</button>
        </div>
      </aside>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
