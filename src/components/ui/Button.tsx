import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "primary", size = "md", style, ...props }) => {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-sm, 10px)",
        fontWeight: 600,
        cursor: "pointer",
        padding: size === "sm" ? "4px 10px" : size === "lg" ? "12px 24px" : "8px 16px",
        fontSize: size === "sm" ? "0.75rem" : "0.875rem",
        background: variant === "primary" ? "var(--primary, #4F46E5)" : variant === "danger" ? "#ef4444" : "var(--surface, #121722)",
        color: "#ffffff",
        border: variant === "secondary" ? "1px solid var(--border, #242E42)" : "none",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
