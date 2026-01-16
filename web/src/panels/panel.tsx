import type { PropsWithChildren } from "react";
import { Pressable } from "../main/pressable";


export function Panel({
  title,
  onClose,
  children,
}: PropsWithChildren<{ title: string; onClose: () => void }>) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        height: "100%",
        width: 420,
        maxWidth: "92vw",
        background: "#fff",
        color: "#111",
        borderLeft: "1px solid #e5e5e5",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        display: "grid",
        gridTemplateRows: "56px 1fr",
        zIndex: 500,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          borderBottom: "1px solid #f1f1f1"
        }}
      >
        <div style={{ fontWeight: 900 }}>{title}</div>
        <Pressable type="button" onClick={onClose} style={{ padding: "8px 12px" }}>
          Zatvori
        </Pressable>
      </div>

      <div style={{ padding: 12, overflow: "auto" }}>{children}</div>
    </div>
  );
}
