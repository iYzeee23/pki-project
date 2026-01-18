import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type PressableProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Pressable({
  variant = "secondary",
  disabled,
  style,
  children,
  type,
  ...rest
}: PropsWithChildren<PressableProps>) {
  const base: React.CSSProperties = {
    display: "block",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 900,
    cursor: disabled ? "not-allowed" : "pointer",
    userSelect: "none",
    transition: "transform 80ms ease, opacity 80ms ease, background 120ms ease",
    opacity: disabled ? 0.6 : 1,
    border: "1px solid #e5e5e5",
    background: variant === "primary" ? "#111" : "#fff",
    color: variant === "primary" ? "#fff" : "#111"
  };

  return (
    <button
      {...rest}
      type={type ?? "button"}
      disabled={disabled}
      style={{ ...base, ...style }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = "scale(0.97)";
        rest.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        rest.onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}
