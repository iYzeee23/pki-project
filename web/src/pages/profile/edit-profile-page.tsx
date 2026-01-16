import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth-store";
import { profileApi } from "../../util/services";
import { getApiErrorMessage } from "../../util/http";

export function EditProfilePage() {
  const nav = useNavigate();

  const me = useAuthStore((s) => s.me);
  const setMe = useAuthStore((s) => s.setMe);

  const initial = useMemo(() => me, [me]);

  const [username, setUsername] = useState(initial?.username ?? "");
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [file, setFile] = useState<File | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!me) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const fd = new FormData();
      fd.append("username", username.trim());
      fd.append("firstName", firstName.trim());
      fd.append("lastName", lastName.trim());
      fd.append("phone", phone.trim());
      fd.append("email", email.trim());
      if (file) fd.append("file", file);

      const updated = await profileApi.updateMe(fd);
      // store update
      await Promise.resolve(setMe(updated));
      nav("/profile", { replace: true });
    } catch (e2: unknown) {
      setError(getApiErrorMessage(e2));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <h2>Edit profile</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label>
          First name
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>

        <label>
          Last name
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>

        <label>
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>

        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Profile picture (optional)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={() => nav(-1)} disabled={busy}>
            Back
          </button>
          <button type="submit" disabled={busy}>
            {busy ? "Čuvam..." : "Sačuvaj"}
          </button>
        </div>

        {error ? <div style={{ color: "crimson" }}>{error}</div> : null}
      </form>
    </div>
  );
}
