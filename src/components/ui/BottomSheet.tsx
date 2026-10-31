import React from "react";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
      <div style={{ width: "100%", maxHeight: "80vh", background: "var(--surface, #121722)", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", padding: "1.5rem" }}>
        <button onClick={onClose} style={{ float: "right" }}>✕</button>
        {children}
      </div>
    </div>
  );
};
