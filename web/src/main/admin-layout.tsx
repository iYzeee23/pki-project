import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../util/socket";
import { useTranslation } from "react-i18next";
import { adminTexts } from "../i18n/i18n-builder";
import { useAuthStore } from "../stores/auth-store";
import i18n from "../i18n";

const GREEN = "#2E7D32";

type NavItemProps = {
  to?: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

function NavItem({ to, icon, label, onClick }: NavItemProps) {
  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    textDecoration: "none",
    color: "#555",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    padding: "6px 14px",
    borderRadius: 8,
    transition: "color 150ms",
  };

  if (to) {
    return (
      <NavLink
        to={to}
        style={({ isActive }) => ({
          ...style,
          color: isActive ? GREEN : "#555",
        })}
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    );
  }

  return (
    <button onClick={onClick} style={{ ...style, background: "none", border: "none" }}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* ── SVG icons (20×20) ── */

const MapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const RentalsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IssuesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6" />
  </svg>
);

const LanguageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export function AdminLayout() {
  const { t } = useTranslation();
  const adm = adminTexts(t);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, []);

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateRows: "auto 1fr" }}>
      <header
        style={{
          backgroundColor: "#fff",
          padding: "10px 32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          position: "relative",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* Logo */}
          <NavLink
            to="/profile"
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
          >
            <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
              <circle cx="18" cy="42" r="12" stroke={GREEN} strokeWidth="3" fill="none" />
              <circle cx="46" cy="42" r="12" stroke={GREEN} strokeWidth="3" fill="none" />
              <path d="M18 42 L28 20 L36 20" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M32 20 L46 42" stroke={GREEN} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M24 32 L40 32" stroke={GREEN} strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="32" cy="14" r="4" fill={GREEN} />
              <path d="M32 56 L32 50 M32 56 L28 52 M32 56 L36 52" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span style={{ fontSize: 22, fontWeight: 800, color: GREEN }}>
              BikeLand
            </span>
          </NavLink>

          {/* Nav items */}
          <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <NavItem to="/map" icon={<MapIcon />} label={adm.Map} />
            <NavItem to="/rentals" icon={<RentalsIcon />} label={adm.Rentals} />
            <NavItem to="/issues" icon={<IssuesIcon />} label={adm.Issues} />
            <NavItem to="/profile" icon={<ProfileIcon />} label={adm.Profile} />
            <NavItem
              icon={<LanguageIcon />}
              label={adm.Language}
              onClick={() => i18n.changeLanguage(i18n.language === "sr" ? "en" : "sr")}
            />
            <NavItem icon={<LogoutIcon />} label={adm.Logout} onClick={onLogout} />
          </nav>
        </div>
      </header>

      <main style={{ overflow: "hidden" }}>
        <Outlet />
      </main>
    </div>
  );
}
