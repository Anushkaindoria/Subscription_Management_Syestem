import React from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "560px", padding: "2rem", background: "var(--surface, #121722)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ color: "var(--text-muted, #94A3B8)" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};
