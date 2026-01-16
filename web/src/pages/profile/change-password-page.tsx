import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileApi } from "../../util/services";
import { getApiErrorMessage } from "../../util/http";

export function ChangePasswordPage() {
  const nav = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    setBusy(true);

    try {
      if (!oldPassword || !newPassword) {
        throw new Error("Popuni oba polja.");
      }
      if (newPassword.length < 6) {
        throw new Error("Nova lozinka mora imati bar 6 karaktera.");
      }

      await profileApi.changePassword({ oldPassword, newPassword });

      setOk("Lozinka je promenjena.");
      setOldPassword("");
      setNewPassword("");

      nav("/profile", { replace: true });
    } catch (e2: unknown) {
      setError(getApiErrorMessage(e2));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <h2>Change password</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          Current password
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </label>

        <label>
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={() => nav(-1)} disabled={busy}>
            Back
          </button>
          <button type="submit" disabled={busy}>
            {busy ? "Menjam..." : "Promeni"}
          </button>
        </div>

        {error ? <div style={{ color: "crimson" }}>{error}</div> : null}
        {ok ? <div style={{ color: "green" }}>{ok}</div> : null}
      </form>
    </div>
  );
}
