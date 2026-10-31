import React from "react";

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  accentColor = "#60a5fa",
}) => {
  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "2rem", fontWeight: "700", color: accentColor }}>
        {value}
      </div>
      {subtext && (
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
          {subtext}
        </div>
      )}
    </div>
  );
};
