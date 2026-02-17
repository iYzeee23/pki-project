import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth-store";
import { isCanceled } from "@app/shared";
import { getApiErrorMessage } from "../../util/http";
import { CenterLayout } from "../../main/center-layout";
import { Pressable } from "../../elements/pressable";
import { TextField } from "../../elements/text-field";
import { useTranslation } from "react-i18next";
import { loginTexts } from "../../i18n/i18n-builder";

const GREEN = "#2E7D32";

export function LoginPage() {
  const { t } = useTranslation();
  const lgp = loginTexts(t);

  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nav = useNavigate();
  const loc = useLocation() as any;
  const from = loc.state?.from?.pathname ?? "/profile";

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
      await login(username.trim(), password, signal);
      nav(from, { replace: true });
    } 
    catch (e: any) {
      if (isCanceled(e)) return;
      setError(getApiErrorMessage(e));
    } 
    finally {
      setBusy(false);
    }
  };

  return (
    <CenterLayout>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="42" r="12" stroke={GREEN} strokeWidth="3" fill="none" />
            <circle cx="46" cy="42" r="12" stroke={GREEN} strokeWidth="3" fill="none" />
            <path d="M18 42 L28 20 L36 20" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M32 20 L46 42" stroke={GREEN} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M24 32 L40 32" stroke={GREEN} strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="32" cy="14" r="4" fill={GREEN} />
            <path d="M32 56 L32 50 M32 56 L28 52 M32 56 L36 52" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span style={{ fontSize: 52, fontWeight: 800, color: GREEN, letterSpacing: -0.5 }}>
            BikeLand
          </span>
        </div>

        {/* Card */}
        <div style={{
          width: 440,
          maxWidth: "100%",
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: "40px 36px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        }}>
          <h2 style={{
            margin: "0 0 4px 0",
            fontSize: 26,
            fontWeight: 800,
            color: "#1a1a1a",
            textAlign: "center",
          }}>
            {lgp.WelcomeBack}
          </h2>

          <p style={{
            margin: "0 0 28px 0",
            fontSize: 14,
            color: "#888",
            textAlign: "center",
          }}>
            {lgp.Subtitle}
          </p>

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
            <TextField
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={lgp.UsernamePlaceholder}
              style={{ padding: "14px 16px", fontSize: 15 }}
            />

            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={lgp.PasswordPlaceholder}
              style={{ padding: "14px 16px", fontSize: 15 }}
            />

            {error && (
              <div style={{ fontSize: 13, color: "#d32f2f" }}>
                {error}
              </div>
            )}

            <Pressable
              type="submit"
              variant="primary"
              disabled={busy}
              style={{
                width: "100%",
                background: GREEN,
                color: "#fff",
                padding: "14px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 16,
                border: "none",
              }}
            >
              {busy ? lgp.Logging : lgp.Login}
            </Pressable>
          </form>
        </div>
      </div>
    </CenterLayout>
  );
}
