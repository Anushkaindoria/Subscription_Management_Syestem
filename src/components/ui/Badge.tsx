import React from "react";

interface BadgeProps {
  status: "ACTIVE" | "DRAFT" | "QUOTATION" | "CONFIRMED" | "PAID" | "OVERDUE" | "CLOSED" | "VOID";
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const getBadgeClass = () => {
    switch (status) {
      case "ACTIVE":
        return "badge-active";
      case "PAID":
        return "badge-paid";
      case "OVERDUE":
        return "badge-overdue";
      case "QUOTATION":
      case "CONFIRMED":
        return "badge-quotation";
      case "DRAFT":
      case "CLOSED":
      case "VOID":
      default:
        return "badge-draft";
    }
  };

  return <span className={`badge ${getBadgeClass()}`}>{status}</span>;
};
