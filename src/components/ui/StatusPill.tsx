import React from "react";
import { STATUS_PILL_CONFIG } from "./status-pill.config";
import { cn } from "@/lib/utils";

export interface StatusPillProps {
  status: string;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, className }) => {
  const normalized = (status || "").toLowerCase();
  const cfg = STATUS_PILL_CONFIG[normalized] || {
    label: status || "Unknown",
    color: "#64748b",
    bg: "rgba(100, 116, 139, 0.12)",
    border: "rgba(100, 116, 139, 0.25)",
    iconDotColor: "#64748b",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider select-none",
        className
      )}
      style={{
        color: cfg.color,
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: cfg.iconDotColor }}
      />
      {cfg.label}
    </span>
  );
};
