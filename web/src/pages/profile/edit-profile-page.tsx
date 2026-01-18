import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth-store";
import { profileApi } from "../../util/services";
import { Pressable } from "../../elements/pressable";
import { isCanceled } from "@app/shared";
import { getApiErrorMessage } from "../../util/http";
import { CenterLayout } from "../../main/center-layout";
import { TextField } from "../../elements/text-field";
import { FileField } from "../../elements/file-field";

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
  const [file, setFile] = useState<File | undefined | null>(undefined);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    () => {
        return submitControllerRef.current?.abort();
    }
  }, []);

  if (!me) return null;

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

  const btn: React.CSSProperties = {
    border: "1px solid #e5e5e5",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 900,
  };

  return (
    <CenterLayout centerY={false}>
        <div style={{ maxWidth: 520, width: 300 }}>
            <h2 style={{ marginTop: 0 }}>Izmena profila</h2>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
                <label style={{ display: "grid", gap: 6 }}>
                    Username
                    <TextField value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                    Ime
                    <TextField value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                    Prezime
                    <TextField value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                    Telefon
                    <TextField value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                    Email
                    <TextField value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                    Profilna slika (opciono)
                    <FileField profilePath={me.profileImagePath} accept="image/*" value={file} onChange={setFile} />
                </label>

                <div style={{ display: "flex", gap: 10 }}>
                    <Pressable type="button"  onClick={() => nav(-1)} disabled={busy} style={btn}>Nazad</Pressable>

                    <Pressable type="submit" disabled={busy}
                        style={btn}>
                        {busy ? "Čuvam..." : "Sačuvaj"}
                    </Pressable>
                </div>

                {error ? <div style={{ color: "crimson" }}>{error}</div> : null}
            </form>
        </div>
    </CenterLayout>
  );
}
