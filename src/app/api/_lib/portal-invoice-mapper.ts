import type { InvoiceDTO } from "@/contracts";
import type { Invoice, InvoiceLine } from "@/contracts/invoice";

type PortalStatus = Invoice["status"];
type DtoLine = InvoiceDTO["lines"][number];

// Dev A ka status -> portal contract status.
// "overdue" UI-derived hai (contract rule), isliye portal mein confirmed hi rehta hai.
const STATUS_MAP: Record<string, PortalStatus> = {
  DRAFT: "draft",
  CONFIRMED: "confirmed",
  OVERDUE: "confirmed",
  PAID: "paid",
  VOID: "cancelled",
};

/** Customer ko Draft invoice nahi dikhte. */
export function isCustomerVisible(inv: InvoiceDTO): boolean {
  return inv.status !== "DRAFT";
}

export function toPortalInvoice(inv: InvoiceDTO, customerId: string): Invoice {
  const cancelled = inv.status === "VOID";
  const balance = cancelled ? 0 : Math.max(0, inv.totalAmount - inv.paidAmount);

  // DB lines mein type nahi hota: har line "charge". Discount/tax totals invoice level par hain.
  const lines: InvoiceLine[] = inv.lines.map((l: DtoLine, i: number) => ({
    id: `${inv.id}_line_${i + 1}`,
    type: "charge" as const,
    description: l.description,
    quantity: l.quantity,
    unitPrice: l.unitPrice,
    amountMinor: l.quantity * l.unitPrice,
  }));

  return {
    id: inv.id,
    number: inv.invoiceNumber,
    subscriptionId: inv.subscriptionId,
    customerId,
    customerName: inv.customerName,
    customerEmail: inv.customerEmail,
    periodStart: inv.periodStart,
    periodEnd: inv.periodEnd,
    status: STATUS_MAP[inv.status] ?? "confirmed",
    dueDate: inv.dueDate,
    subtotalMinor: inv.subtotal,
    discountAmountMinor: inv.discountAmount,
    taxAmountMinor: inv.taxAmount,
    totalAmountMinor: inv.totalAmount,
    paidAmountMinor: inv.paidAmount,
    balanceMinor: balance,
    lines,
    createdAt: inv.createdAt,
  };
}

/** Outstanding = confirmed aur balance baaki. */
export function isOutstanding(inv: Invoice): boolean {
  return inv.status === "confirmed" && inv.balanceMinor > 0;
}