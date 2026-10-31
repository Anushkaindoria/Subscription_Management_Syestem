import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", width: "100%" }}>
      {label && <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-dim, #64748B)", fontWeight: 600 }}>{label}</label>}
      <input
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "var(--radius-sm, 10px)",
          border: error ? "1px solid #ef4444" : "1px solid var(--border, #242E42)",
          background: "var(--surface, #121722)",
          color: "var(--text-main, #F1F5F9)",
          outline: "none",
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{error}</span>}
    </div>
  );
};
