import React from "react";
import { InvoiceDTO } from "@/contracts";
import { Badge } from "@/components/ui/Badge";
import { Money } from "@/lib/money";

interface InvoiceTableProps {
  invoices: InvoiceDTO[];
  onSelect?: (invoice: InvoiceDTO) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onSelect }) => {
  return (
    <div className="glass-panel" style={{ overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.02)" }}>
            <th style={{ padding: "1rem" }}>Invoice #</th>
            <th style={{ padding: "1rem" }}>Period</th>
            <th style={{ padding: "1rem" }}>Total</th>
            <th style={{ padding: "1rem" }}>Status</th>
            <th style={{ padding: "1rem" }}>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr
              key={inv.id}
              onClick={() => onSelect?.(inv)}
              style={{ borderBottom: "1px solid var(--border-subtle)", cursor: onSelect ? "pointer" : "default" }}
            >
              <td style={{ padding: "1rem", fontWeight: "600", color: "#60a5fa" }}>{inv.invoiceNumber}</td>
              <td style={{ padding: "1rem", color: "var(--text-muted)" }}>
                {inv.periodStart.slice(0, 10)} to {inv.periodEnd.slice(0, 10)}
              </td>
              <td style={{ padding: "1rem", fontWeight: "700" }}>{Money.format(inv.totalAmount)}</td>
              <td style={{ padding: "1rem" }}>
                <Badge status={inv.status} />
              </td>
              <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{inv.dueDate.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
