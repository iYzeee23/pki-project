import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileApi } from "../../util/services";
import { isCanceled, resolveImageUrl } from "@app/shared";
import { getApiErrorMessage } from "../../util/http";
import { useTranslation } from "react-i18next";
import { changePasswordTexts } from "../../i18n/i18n-builder";
import { useAuthStore } from "../../stores/auth-store";
import { VITE_API_BASE_URL, DEFAULT_PROFILE_PICTURE_RESOLVED } from "../../util/config";

const GREEN = "#2E7D32";

export function ChangePasswordPage() {
  const { t } = useTranslation();
  const cpp = changePasswordTexts(t);

  const nav = useNavigate();
  const me = useAuthStore((s) => s.me);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confNewPassword, setConfNewPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    () => {
      return submitControllerRef.current?.abort();
    }
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    submitControllerRef.current?.abort();
    submitControllerRef.current = new AbortController();
    
    const signal = submitControllerRef.current.signal;

    setBusy(true);
    setError(null);

    try {
      if (!oldPassword || !newPassword || !confNewPassword)
        throw new Error(cpp.ErrAllFields);

      if (newPassword !== confNewPassword)
        throw new Error(cpp.ErrMismatch);

      await profileApi.changePassword({ oldPassword, newPassword }, signal);
      nav("/profile", { replace: true });
    } 
    catch (e: any) {
      if (isCanceled(e)) return;
      setError(getApiErrorMessage(e));
    } 
    finally {
      setBusy(false);
    }
  };

  const avatarUrl = me
    ? resolveImageUrl(VITE_API_BASE_URL, me.profileImagePath)
    : DEFAULT_PROFILE_PICTURE_RESOLVED;

  const inputStyle: React.CSSProperties = {
    border: "none",
    borderBottom: "1px solid #e0e0e0",
    padding: "14px 8px",
    fontSize: 15,
    color: "#333",
    outline: "none",
    width: "100%",
    background: "transparent",
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 64px)", padding: 24 }}>
      <div
        style={{
          width: 360,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
          padding: "24px 28px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Back arrow */}
        <div style={{ width: "100%", marginBottom: 12 }}>
          <span
            onClick={() => nav(-1)}
            style={{ cursor: "pointer", fontSize: 20, color: "#333" }}
          >
            ←
          </span>
        </div>

        {/* Avatar */}
        <img
          src={avatarUrl}
          alt="Profile"
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid " + GREEN,
          }}
        />

        {/* Name / email / phone */}
        {me && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#222" }}>
              {me.firstName} {me.lastName}
            </div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{me.email}</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 1 }}>{me.phone}</div>
          </div>
        )}

        {/* Divider */}
        <div style={{ width: 120, height: 1, background: "#e0e0e0", margin: "16px 0" }} />

        {/* Form */}
        <form onSubmit={onSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 12, color: "#888", marginTop: 8, marginLeft: 8 }}>{cpp.CurrentPassword}</label>
          <input
            style={inputStyle}
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder={cpp.CurrentPassword}
            disabled={busy}
          />
          <label style={{ fontSize: 12, color: "#888", marginTop: 8, marginLeft: 8 }}>{cpp.NewPassword}</label>
          <input
            style={inputStyle}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={cpp.NewPassword}
            disabled={busy}
          />
          <label style={{ fontSize: 12, color: "#888", marginTop: 8, marginLeft: 8 }}>{cpp.ConfNewPassword}</label>
          <input
            style={inputStyle}
            type="password"
            value={confNewPassword}
            onChange={(e) => setConfNewPassword(e.target.value)}
            placeholder={cpp.ConfNewPassword}
            disabled={busy}
          />

          {error && (
            <div style={{ fontSize: 13, color: "#d32f2f", marginTop: 12, fontStyle: "italic" }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={busy}
            style={{
              backgroundColor: GREEN,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "16px 0",
              fontWeight: 600,
              fontSize: 17,
              cursor: busy ? "default" : "pointer",
              opacity: busy ? 0.5 : 1,
              marginTop: 8,
            }}
          >
            {busy ? cpp.Changing : cpp.Change}
          </button>
        </form>
      </div>
    </div>
  );
}
