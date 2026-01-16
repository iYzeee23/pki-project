import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth-store";
import { isCanceled } from "@app/shared";
import { getApiErrorMessage } from "../../util/http";

export function LoginPage() {
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nav = useNavigate();
  const loc = useLocation() as any;
  const from = loc.state?.from?.pathname ?? "/profile";

  const submitControllerRef = useRef<AbortController | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    submitControllerRef.current?.abort();
    submitControllerRef.current = new AbortController();
    const signal = submitControllerRef.current.signal;

    setBusy(true);
    try {
      await login(username.trim(), password, signal);
      nav(from, { replace: true });
    } 
    catch (e2: any) {
      if (isCanceled(e2)) return;
      setError(getApiErrorMessage(e2));
    }
    finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "60px auto" }}>
      <h2>Admin Login</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={busy} type="submit">
          {busy ? "U toku..." : "Prijava"}
        </button>

        {error ? <div style={{ color: "crimson" }}>{error}</div> : null}
      </form>
    </div>
  );
}
