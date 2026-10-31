import React from "react";
import { STATUS_PILL_CONFIG } from "./status-pill.config";

export interface StatusPillProps {
  status: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const cfg = STATUS_PILL_CONFIG[status.toLowerCase()] || {
    label: status,
    color: "#94a3b8",
    bg: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.25)",
    iconDotColor: "#94a3b8",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "3px 10px",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.iconDotColor }} />
      {cfg.label}
    </span>
  );
};
