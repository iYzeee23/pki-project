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
      <div style={{ width: 420, maxWidth: "100%", border: "1px solid #e5e5e5", borderRadius: 16, padding: 16, }}>
        <h2 style={{ marginTop: 0 }}>{lgp.AdminLogin}</h2>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            {lgp.Username}
            <TextField value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            {lgp.Password}
            <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          <Pressable type="submit" variant="primary" disabled={busy}
            style={{ width: "100%", background: "#111", color: "#fff", padding: "10px", borderRadius: 12, fontWeight: 900 }}>
            {busy ? lgp.Logging : lgp.Login}
          </Pressable>

          {error ? <div style={{ color: "crimson" }}>{error}</div> : null}
        </form>
      </div>
    </CenterLayout>
  );
}
