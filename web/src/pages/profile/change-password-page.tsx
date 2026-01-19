import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileApi } from "../../util/services";
import { isCanceled } from "@app/shared";
import { getApiErrorMessage } from "../../util/http";
import { Pressable } from "../../elements/pressable";
import { CenterLayout } from "../../main/center-layout";
import { TextField } from "../../elements/text-field";
import { useTranslation } from "react-i18next";
import { changePasswordTexts, commonTexts } from "../../i18n/i18n-builder";

export function ChangePasswordPage() {
  const { t } = useTranslation();
  const cpp = changePasswordTexts(t);
  const com = commonTexts();

  const nav = useNavigate();

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

  const btn: React.CSSProperties = {
    border: "1px solid #e5e5e5",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 900,
  };

  return (
    <CenterLayout centerY={false}>
      <div style={{ maxWidth: 520 }}>
        <h2 style={{ marginTop: 0 }}>{cpp.ChangePasswords}</h2>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            {cpp.CurrentPassword}
            <TextField type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            {cpp.NewPassword}
            <TextField type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            {cpp.ConfNewPassword}
            <TextField type="password" value={confNewPassword} onChange={(e) => setConfNewPassword(e.target.value)} />
          </label>

          <div style={{ display: "flex", gap: 10 }}>
              <Pressable type="button" onClick={() => nav(-1)} disabled={busy} style={btn}>{com.Back}</Pressable>

              <Pressable type="submit" disabled={busy}
                style={btn}>
                {busy ? cpp.Changing : cpp.Change}
              </Pressable>
          </div>

          {error ? <div style={{ color: "crimson" }}>{error}</div> : null}
        </form>
      </div>
    </CenterLayout>
  );
}
