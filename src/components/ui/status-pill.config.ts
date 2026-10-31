export interface StatusPillConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  iconDotColor: string;
}

export const STATUS_PILL_CONFIG: Record<string, StatusPillConfig> = {
  // Subscriptions
  active: {
    label: "Active",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.25)",
    iconDotColor: "#10b981",
  },
  confirmed: {
    label: "Confirmed",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.12)",
    border: "rgba(59, 130, 246, 0.25)",
    iconDotColor: "#3b82f6",
  },
  quotation: {
    label: "Quotation",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.25)",
    iconDotColor: "#f59e0b",
  },
  draft: {
    label: "Draft",
    color: "#94a3b8",
    bg: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.25)",
    iconDotColor: "#94a3b8",
  },
  closed: {
    label: "Closed",
    color: "#64748b",
    bg: "rgba(100, 116, 139, 0.12)",
    border: "rgba(100, 116, 139, 0.25)",
    iconDotColor: "#64748b",
  },

  // Invoices
  paid: {
    label: "Paid",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.25)",
    iconDotColor: "#10b981",
  },
  overdue: {
    label: "Overdue",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.25)",
    iconDotColor: "#ef4444",
  },
  cancelled: {
    label: "Cancelled",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.08)",
    border: "rgba(239, 68, 68, 0.2)",
    iconDotColor: "#ef4444",
  },

  // Roles
  admin: {
    label: "Administrator",
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.12)",
    border: "rgba(139, 92, 246, 0.25)",
    iconDotColor: "#8b5cf6",
  },
  staff: {
    label: "Staff",
    color: "#38bdf8",
    bg: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.25)",
    iconDotColor: "#38bdf8",
  },
  customer: {
    label: "Customer",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.25)",
    iconDotColor: "#10b981",
  },
};
