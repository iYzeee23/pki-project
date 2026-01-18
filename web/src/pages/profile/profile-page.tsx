import { Link } from "react-router-dom";
import { DEFAULT_PROFILE_PICTURE, resolveImageUrl } from "@app/shared";
import { useAuthStore } from "../../stores/auth-store";
import { VITE_API_BASE_URL } from "../../util/config";
import { Pressable } from "../../elements/pressable";
import { CenterLayout } from "../../main/center-layout";
import { useState } from "react";
import { ImagePreview } from "../../elements/image-preview";

export function ProfilePage() {
  const me = useAuthStore((s) => s.me);
  const logout = useAuthStore((s) => s.logout);

  const [previewOpen, setPreviewOpen] = useState(false);

  if (!me) return null;

  const imgPath = me.profileImagePath || DEFAULT_PROFILE_PICTURE;
  const imgUrl = resolveImageUrl(VITE_API_BASE_URL, imgPath);

  const actionBtn: React.CSSProperties = {
    border: "1px solid #e5e5e5",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 900,
  };

  return (
    <CenterLayout centerY={false}>
        <div style={{ display: "grid", gap: 14, maxWidth: 720 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ margin: 0 }}>Profil</h2>
                
                <Pressable style={{ ...actionBtn }} onClick={logout}>Odjava</Pressable>
            </div>

            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <img
                src={imgUrl} alt="Profile" onClick={() => setPreviewOpen(true)}
                style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    objectFit: "cover",
                    cursor: "zoom-in",
                    border: "1px solid #e5e5e5",
                }} />

                <div>
                    <div style={{ fontSize: 18, fontWeight: 900 }}>{me.firstName} {me.lastName}</div>
                    <div style={{ opacity: 0.8 }}>@{me.username}</div>
                </div>
            </div>

            <div><b>Email:</b> {me.email}</div>
            <div><b>Telefon:</b> {me.phone}</div>

            <div style={{ display: "flex", gap: 10 }}>
                <Link to="/profile/edit" style={{ textDecoration: "none" }}>
                    <Pressable style={actionBtn}>Izmeni podatke</Pressable>
                </Link>

                <Link to="/profile/password" style={{ textDecoration: "none" }}>
                    <Pressable style={actionBtn}>Promeni lozinku</Pressable>
                </Link>
            </div>

            <ImagePreview
            isOpen={previewOpen}
            src={imgUrl}
            alt="Profilna slika"
            onClose={() => setPreviewOpen(false)}/>
        </div>
    </CenterLayout>
  );
}
