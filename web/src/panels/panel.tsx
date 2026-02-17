import type { PropsWithChildren } from "react";
import { Pressable } from "../elements/pressable";


export function Panel({
  title,
  onClose,
  noBackdrop,
  children,
}: PropsWithChildren<{ title: string; onClose: () => void; noBackdrop?: boolean }>) {
  return (
    <>
      {!noBackdrop && (
        <div
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
            backgroundColor: "rgba(0,0,0,0.15)",
            zIndex: 499,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: 360,
          maxWidth: "92vw",
          background: "#fff",
          color: "#111",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          zIndex: 500,
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 16px 0" }}>
          <Pressable
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#333",
              fontSize: 22,
              lineHeight: 1,
            }}
          >
            ✕
          </Pressable>
        </div>

        <div style={{ padding: "4px 20px 12px", fontWeight: 800, fontSize: 20 }}>
          {title}
        </div>

        <div style={{ padding: "0 20px 20px", overflow: "auto", flex: 1 }}>
          {children}
        </div>
      </div>
    </>
  );
}
