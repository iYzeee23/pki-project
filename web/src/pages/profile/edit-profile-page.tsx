import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth-store";
import { profileApi } from "../../util/services";
import { DEFAULT_PROFILE_PICTURE, isCanceled, resolveImageUrl } from "@app/shared";
import { getApiErrorMessage } from "../../util/http";
import { useTranslation } from "react-i18next";
import { editProfileTexts } from "../../i18n/i18n-builder";
import { VITE_API_BASE_URL, DEFAULT_PROFILE_PICTURE_RESOLVED } from "../../util/config";

const GREEN = "#2E7D32";

export function EditProfilePage() {
  const { t } = useTranslation();
  const epp = editProfileTexts(t);

  const nav = useNavigate();
  const me = useAuthStore((s) => s.me);
  const setMe = useAuthStore((s) => s.setMe);

  const initial = useMemo(() => me, [me]);

  const [username, setUsername] = useState(initial?.username ?? "");
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [file, setFile] = useState<File | undefined | null>(undefined);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    () => {
        return submitControllerRef.current?.abort();
    }
  }, []);

  if (!me) return null;

  const serverUrl = resolveImageUrl(VITE_API_BASE_URL, me.profileImagePath);
  const previewUrl = file
    ? URL.createObjectURL(file)
    : file === null
    ? DEFAULT_PROFILE_PICTURE_RESOLVED
    : serverUrl;

  const canRemove = !(
    (file === null) ||
    (file === undefined && me.profileImagePath === DEFAULT_PROFILE_PICTURE)
  );

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    submitControllerRef.current?.abort();
    submitControllerRef.current = new AbortController();

    const signal = submitControllerRef.current.signal;

    setBusy(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("username", username.trim());
      fd.append("firstName", firstName.trim());
      fd.append("lastName", lastName.trim());
      fd.append("phone", phone.trim());
      fd.append("email", email.trim());
      fd.append("removeProfileImage", file === null ? "true" : "false");
      if (file) fd.append("file", file);

      const updated = await profileApi.updateMe(fd, signal);
      setMe(updated);
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
        <div style={{ width: "100%", marginBottom: 12 }}>
          <span
            onClick={() => nav(-1)}
            style={{ cursor: "pointer", fontSize: 20, color: "#333" }}
          >
            ←
          </span>
        </div>

        <img
          src={previewUrl}
          alt="Profile"
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid " + GREEN,
          }}
        />

        <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
          <span
            onClick={() => fileInputRef.current?.click()}
            style={{ fontSize: 14, fontWeight: 700, color: GREEN, cursor: "pointer" }}
          >
            {epp.ChangePhoto}
          </span>
          <span
            onClick={() => { if (canRemove) { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; } }}
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#d32f2f",
              cursor: canRemove ? "pointer" : "default",
              opacity: canRemove ? 1 : 0.3,
            }}
          >
            {epp.Remove}
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }}
        />

        <div style={{ width: 120, height: 1, background: "#e0e0e0", margin: "16px 0" }} />

        <form onSubmit={onSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 12, color: "#888", marginTop: 8, marginLeft: 8 }}>{epp.Username}</label>
          <input
            style={inputStyle}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={epp.Username}
            disabled={busy}
          />
          <label style={{ fontSize: 12, color: "#888", marginTop: 8, marginLeft: 8 }}>{epp.FirstName}</label>
          <input
            style={inputStyle}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={epp.FirstName}
            disabled={busy}
          />
          <label style={{ fontSize: 12, color: "#888", marginTop: 8, marginLeft: 8 }}>{epp.LastName}</label>
          <input
            style={inputStyle}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={epp.LastName}
            disabled={busy}
          />
          <label style={{ fontSize: 12, color: "#888", marginTop: 8, marginLeft: 8 }}>{epp.Phone}</label>
          <input
            style={inputStyle}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={epp.Phone}
            disabled={busy}
          />
          <label style={{ fontSize: 12, color: "#888", marginTop: 8, marginLeft: 8 }}>{epp.Email}</label>
          <input
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={epp.Email}
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
            {busy ? epp.Saving : epp.Save}
          </button>
        </form>
      </div>
    </div>
  );
}
