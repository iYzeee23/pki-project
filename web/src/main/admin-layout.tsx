import { NavLink, Outlet } from "react-router-dom";
import { resolveImageUrl } from "@app/shared";
import { VITE_API_BASE_URL } from "../util/config";
import { Pressable } from "../elements/pressable";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../util/socket";
import { useTranslation } from "react-i18next";
import { adminTexts } from "../i18n/i18n-builder";
import i18n from "../i18n";

const navLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  padding: "8px 10px",
  borderRadius: 12,
  textDecoration: "none",
  color: "inherit",
  fontWeight: 800,
  background: isActive ? "#28948d" : "transparent",
});

export function AdminLayout() {
  const { t } = useTranslation();
  const adm = adminTexts(t);
  
  const logoUrl = resolveImageUrl(VITE_API_BASE_URL, "/uploads/logo.png");

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateRows: "64px 1fr" }}>
      <header
        style={{
          borderBottom: "1px solid #e5e5e5",
          display: "grid",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            maxWidth: 1100,
            margin: "0 auto",
            width: "35%",
            gap: 12,
          }}
        >
          <NavLink
            to="/profile"
            style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#111" }}
          >
            <img src={logoUrl} alt="logo" style={{ height: 50, width: 50, objectFit: "contain" }} />
          </NavLink>

          <nav style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <NavLink to="/map" style={navLinkStyle}>{adm.Map}</NavLink>
            <NavLink to="/rentals" style={navLinkStyle}>{adm.Rentals}</NavLink>
            <NavLink to="/issues" style={navLinkStyle}>{adm.Issues}</NavLink>
            <NavLink to="/profile" style={navLinkStyle}>{adm.Profile}</NavLink>
          </nav>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Pressable
              title={adm.Language}
              onClick={() => i18n.changeLanguage(i18n.language === "sr" ? "en" : "sr")}
              style={{ border: "1px solid #e5e5e5", padding: "8px", borderRadius: 12, fontWeight: 800 }}
            >
              {adm.Language}
            </Pressable>
          </div>
        </div>
      </header>

      <main style={{ padding: 16 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
