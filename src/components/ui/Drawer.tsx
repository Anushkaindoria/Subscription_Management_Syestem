import React from "react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
      <div style={{ width: "420px", height: "100%", background: "var(--surface, #121722)", padding: "2rem", borderLeft: "1px solid var(--border, #242E42)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <h4>{title}</h4>
          <button onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};
