import React from "react";
import { SubscriptionDTO } from "@/contracts";
import { Badge } from "@/components/ui/Badge";
import { Money } from "@/lib/money";

interface SubscriptionCardProps {
  subscription: SubscriptionDTO;
  onTransition?: (status: SubscriptionDTO["status"]) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription }) => {
  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div>
          <h4 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#60a5fa" }}>
            {subscription.customerName || subscription.customerId}
          </h4>
          <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "monospace" }}>
            ID: {subscription.id}
          </span>
        </div>
        <Badge status={subscription.status} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
        <span style={{ color: "var(--text-muted)" }}>Interval: {subscription.renewalInterval}</span>
        <span style={{ fontWeight: "700" }}>
          {subscription.totalRecurringMinor ? Money.format(subscription.totalRecurringMinor) : "Custom Rate"}
        </span>
      </div>
    </div>
  );
};
