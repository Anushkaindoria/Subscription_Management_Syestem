import React from "react";

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, ...props }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      {label && <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-dim, #64748B)" }}>{label}</label>}
      <input type="date" style={{ padding: "0.75rem", borderRadius: "var(--radius-sm, 10px)", border: "1px solid var(--border, #242E42)", background: "var(--surface, #121722)", color: "var(--text-main, #F1F5F9)" }} {...props} />
    </div>
  );
};
