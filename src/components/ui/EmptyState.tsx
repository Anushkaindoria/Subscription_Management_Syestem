import React from "react";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onAction }) => {
  return (
    <div className="glass-panel" style={{ padding: "3rem", textAlign: "center" }}>
      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ color: "var(--text-muted, #94A3B8)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{description}</p>
      {actionLabel && (
        <button onClick={onAction} style={{ padding: "8px 16px", background: "var(--primary, #4F46E5)", color: "#fff", borderRadius: "8px" }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};
