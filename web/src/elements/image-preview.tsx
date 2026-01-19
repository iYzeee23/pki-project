import * as React from "react";
import { Pressable } from "./pressable";
import { commonTexts } from "../i18n/i18n-builder";

export function ImagePreview({
  isOpen,
  src,
  alt,
  onClose,
}: {
  isOpen: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
}) {
  const com = commonTexts();

  React.useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 12,
          maxWidth: 720,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Pressable type="button" variant="secondary" onClick={onClose}>
            {com.Close}
          </Pressable>
        </div>

        <img
          src={src}
          alt={alt ?? "Preview"}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 14,
            display: "block",
            border: "1px solid #e5e5e5",
          }}
        />
      </div>
    </div>
  );
}
