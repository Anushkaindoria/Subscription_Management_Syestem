import React from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, children, style }) => {
  return (
    <div className="glass-panel" style={{ padding: "1.5rem", ...style }}>
      {title && <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: subtitle ? "0.25rem" : "1rem" }}>{title}</h3>}
      {subtitle && <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>{subtitle}</p>}
      {children}
    </div>
  );
};
