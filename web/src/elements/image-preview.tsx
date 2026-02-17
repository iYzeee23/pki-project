import * as React from "react";
import { createPortal } from "react-dom";

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
  React.useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "zoom-out",
      }}
    >
      <img
        src={src}
        alt={alt ?? "Preview"}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "85vw",
          maxHeight: "85vh",
          borderRadius: 14,
          objectFit: "contain",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          cursor: "default",
        }}
      />
    </div>,
    document.body
  );
}
