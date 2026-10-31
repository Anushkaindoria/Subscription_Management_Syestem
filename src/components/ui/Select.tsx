import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options = [], children, style, ...props }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", width: "100%" }}>
      {label && <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-dim, #64748B)", fontWeight: 600 }}>{label}</label>}
      <select
        style={{
          padding: "0.75rem",
          borderRadius: "var(--radius-sm, 10px)",
          border: "1px solid var(--border, #242E42)",
          background: "var(--surface, #121722)",
          color: "var(--text-main, #F1F5F9)",
          ...style,
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
        {children}
      </select>
    </div>
  );
};
