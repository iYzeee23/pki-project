import type { PropsWithChildren } from "react";

type CenterLayoutProps = PropsWithChildren<{
  centerX?: boolean;
  centerY?: boolean;
}>;

export function CenterLayout({ children, centerX = true, centerY = true }: CenterLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: centerX ? "center" : "flex-start",
        alignItems: centerY ? "center" : "flex-start",
        padding: 16
      }}
    >
        {children}
    </div>
  );
}
