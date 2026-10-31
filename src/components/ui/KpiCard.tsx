import React from "react";

export interface KpiCardProps {
  label: string;
  value: string;
  subtext?: string;
  badge?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, subtext, badge }) => {
  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-dim, #64748B)", fontWeight: 700 }}>{label}</span>
        {badge && <span style={{ fontSize: "0.7rem", color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 6px", borderRadius: "4px" }}>{badge}</span>}
      </div>
      <div className="tabular-nums" style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-main, #F1F5F9)" }}>
        {value}
      </div>
      {subtext && <div style={{ fontSize: "0.75rem", color: "var(--text-muted, #94A3B8)", marginTop: "0.25rem" }}>{subtext}</div>}
    </div>
  );
};
