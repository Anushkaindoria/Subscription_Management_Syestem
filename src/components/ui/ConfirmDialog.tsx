import React from "react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110 }}>
      <div className="glass-panel" style={{ maxWidth: "440px", padding: "1.5rem" }}>
        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{title}</h4>
        <p style={{ color: "var(--text-muted, #94A3B8)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button onClick={onCancel} style={{ padding: "6px 12px", borderRadius: "6px", background: "transparent", color: "var(--text-muted, #94A3B8)" }}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} style={{ padding: "6px 12px", borderRadius: "6px", background: "#ef4444", color: "#fff" }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
