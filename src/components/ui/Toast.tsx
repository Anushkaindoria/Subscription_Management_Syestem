import React from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onDismiss?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = "info", onDismiss }) => {
  const bg = type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6";
  return (
    <div style={{ padding: "0.75rem 1.25rem", borderRadius: "8px", background: bg, color: "#fff", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)" }}>
      <span>{message}</span>
      {onDismiss && <button onClick={onDismiss} style={{ color: "#fff", fontWeight: 700 }}>✕</button>}
    </div>
  );
};
