import * as React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function TextField({ label, error, style, ...rest }: Props) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      {label ? <b style={{ fontSize: 14 }}>{label}</b> : null}

      <input
        {...rest}
        style={{
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid #cfcfcf",
          background: "#fff",
          color: "#111",
          outline: "none",
          ...(style ?? {}),
          ...(error ? { borderColor: "#d44" } : null),
        }}
      />

      {error ? <span style={{ color: "#d44", fontSize: 12 }}>{error}</span> : null}
    </label>
  );
}
