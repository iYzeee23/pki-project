import { Link } from "react-router-dom";
import { DEFAULT_PROFILE_PICTURE, resolveImageUrl } from "@app/shared";
import { useAuthStore } from "../../stores/auth-store";
import { VITE_API_BASE_URL } from "../../util/config";
import { useState } from "react";
import { ImagePreview } from "../../elements/image-preview";
import { useTranslation } from "react-i18next";
import { profileTexts } from "../../i18n/i18n-builder";

const GREEN = "#2E7D32";

export function ProfilePage() {
  const { t } = useTranslation();
  const ppp = profileTexts(t);

  const me = useAuthStore((s) => s.me);

  const [previewOpen, setPreviewOpen] = useState(false);

  if (!me) return null;

  const imgPath = me.profileImagePath || DEFAULT_PROFILE_PICTURE;
  const imgUrl = resolveImageUrl(VITE_API_BASE_URL, imgPath);

  const menuItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 0",
    cursor: "pointer",
    textDecoration: "none",
    color: "#333",
    fontSize: 15,
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 64px)", padding: 24 }}>
      <div
        style={{
          width: 360,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={imgUrl}
          alt="Profile"
          onClick={() => setPreviewOpen(true)}
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "zoom-in",
            border: "3px solid " + GREEN,
          }}
        />

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
            {me.firstName} {me.lastName}
          </div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 2 }}>{me.email}</div>
          <div style={{ fontSize: 14, color: "#666" }}>{me.phone}</div>
        </div>

        <div style={{ width: 120, height: 1, background: "#e0e0e0", margin: "20px 0" }} />

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
          <Link to="/profile/edit" style={menuItemStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span style={{ flex: 1 }}>{ppp.EditProfile}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <Link to="/profile/password" style={menuItemStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ flex: 1 }}>{ppp.ChangePassword}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>

      <ImagePreview
        isOpen={previewOpen}
        src={imgUrl}
        alt={ppp.ProfPicture}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}
