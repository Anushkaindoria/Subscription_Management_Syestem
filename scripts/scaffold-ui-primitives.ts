import fs from "fs";
import path from "path";

const UI_DIR = path.resolve(__dirname, "..", "src", "components", "ui");
fs.mkdirSync(UI_DIR, { recursive: true });

function writeUI(fileName: string, content: string) {
  fs.writeFileSync(path.join(UI_DIR, fileName), content.trim() + "\n");
  console.log(`Created: src/components/ui/${fileName}`);
}

writeUI("Button.tsx", `
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
`);

writeUI("Input.tsx", `
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
`);

writeUI("Select.tsx", `
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
`);

writeUI("DatePicker.tsx", `
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
`);

writeUI("Toggle.tsx", `
import React from "react";

export interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label && <span>{label}</span>}
    </label>
  );
};
`);

writeUI("DataTable.tsx", `
import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, any>>({ columns, data, onRowClick }: DataTableProps<T>) {
  return (
    <div className="glass-panel" style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border, #242E42)", background: "rgba(255,255,255,0.02)" }}>
            {columns.map((col) => (
              <th key={col.key} style={{ padding: "1rem" }}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} onClick={() => onRowClick?.(row)} style={{ borderBottom: "1px solid var(--border, #242E42)", cursor: onRowClick ? "pointer" : "default" }}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: "1rem" }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`);

writeUI("StatusPill.tsx", `
import React from "react";
import { STATUS_PILL_CONFIG } from "./status-pill.config";

export interface StatusPillProps {
  status: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const cfg = STATUS_PILL_CONFIG[status.toLowerCase()] || {
    label: status,
    color: "#94a3b8",
    bg: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.25)",
    iconDotColor: "#94a3b8",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "3px 10px",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        color: cfg.color,
        background: cfg.bg,
        border: \`1px solid \${cfg.border}\`,
      }}
    >
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.iconDotColor }} />
      {cfg.label}
    </span>
  );
};
`);

writeUI("KpiCard.tsx", `
import React from "react";

export interface KpiCardProps {
  label: string;
  value: string;
  subtext?: string;
  badge?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, subtext, badge }) => {
  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-dim, #64748B)", fontWeight: 700 }}>{label}</span>
        {badge && <span style={{ fontSize: "0.7rem", color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 6px", borderRadius: "4px" }}>{badge}</span>}
      </div>
      <div className="tabular-nums" style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-main, #F1F5F9)" }}>
        {value}
      </div>
      {subtext && <div style={{ fontSize: "0.75rem", color: "var(--text-muted, #94A3B8)", marginTop: "0.25rem" }}>{subtext}</div>}
    </div>
  );
};
`);

writeUI("Stepper.tsx", `
import React from "react";

export interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {steps.map((s, idx) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: idx <= currentStep ? "#4F46E5" : "#64748B" }}>
          <span>{idx + 1}.</span>
          <span>{s}</span>
        </div>
      ))}
    </div>
  );
};
`);

writeUI("Tabs.tsx", `
import React from "react";

export interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid var(--border, #242E42)", gap: "1rem" }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: "0.75rem 1rem",
            borderBottom: activeTab === tab.id ? "2px solid #4F46E5" : "none",
            color: activeTab === tab.id ? "#ffffff" : "var(--text-muted, #94A3B8)",
            fontWeight: 600,
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
`);

writeUI("Modal.tsx", `
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
`);

writeUI("Drawer.tsx", `
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
`);

writeUI("BottomSheet.tsx", `
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
`);

writeUI("Toast.tsx", `
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
`);

writeUI("EmptyState.tsx", `
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
`);

writeUI("Skeleton.tsx", `
import React from "react";

export interface SkeletonProps {
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width = "100%", height = "20px", style }) => {
  return (
    <div
      style={{
        width,
        height,
        background: "rgba(255,255,255,0.06)",
        borderRadius: "6px",
        animation: "pulse 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
};
`);

writeUI("ConfirmDialog.tsx", `
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
`);

writeUI("index.ts", `
export * from "./Button";
export * from "./Input";
export * from "./Select";
export * from "./DatePicker";
export * from "./Toggle";
export * from "./DataTable";
export * from "./StatusPill";
export * from "./status-pill.config";
export * from "./KpiCard";
export * from "./Stepper";
export * from "./Tabs";
export * from "./Modal";
export * from "./Drawer";
export * from "./BottomSheet";
export * from "./Toast";
export * from "./EmptyState";
export * from "./Skeleton";
export * from "./ConfirmDialog";
`);

console.log("All UI primitives successfully scaffolded!");
