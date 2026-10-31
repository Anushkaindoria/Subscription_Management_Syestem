import { describe, it, expect } from "vitest";
import type { InvoiceDTO } from "@/contracts";
import { isCustomerVisible, isOutstanding, toPortalInvoice } from "../portal-invoice-mapper";

const base: InvoiceDTO = {
  id: "inv43",
  subscriptionId: "sub2",
  customerName: "Nova Logistics",
  customerEmail: "accounts@nova.in",
  invoiceNumber: "INV-2026-0043",
  status: "CONFIRMED",
  periodStart: "2026-10-01T00:00:00.000Z",
  periodEnd: "2026-10-31T23:59:59.000Z",
  subtotal: 149900,
  discountAmount: 0,
  taxAmount: 26982,
  totalAmount: 176882,
  paidAmount: 100000,
  dueDate: "2026-11-15T00:00:00.000Z",
  paidAt: null,
  pdfUrl: "/api/invoices/inv43/pdf",
  createdAt: "2026-10-01T00:00:00.000Z",
  lines: [
    {
      description: "Starter Monthly",
      quantity: 2,
      unitPrice: 74950,
      taxAmount: 26982,
      discountAmount: 0,
      totalAmount: 176882,
    },
  ],
};

function make(over: Partial<InvoiceDTO>): InvoiceDTO {
  return { ...base, ...over };
}

describe("portal invoice mapper", () => {
  it("renames fields and computes balance", () => {
    const p = toPortalInvoice(base, "cust_nova");
    expect(p.number).toBe("INV-2026-0043");
    expect(p.customerId).toBe("cust_nova");
    expect(p.totalAmountMinor).toBe(176882);
    expect(p.paidAmountMinor).toBe(100000);
    expect(p.balanceMinor).toBe(76882);
    expect(p.status).toBe("confirmed");
  });

  it("maps statuses to contract values", () => {
    expect(toPortalInvoice(make({ status: "PAID", paidAmount: 176882 }), "c").status).toBe("paid");
    expect(toPortalInvoice(make({ status: "OVERDUE" }), "c").status).toBe("confirmed");
    expect(toPortalInvoice(make({ status: "VOID" }), "c").status).toBe("cancelled");
  });

  it("cancelled invoice has zero balance", () => {
    expect(toPortalInvoice(make({ status: "VOID" }), "c").balanceMinor).toBe(0);
  });

  it("builds charge lines with amountMinor = quantity x unitPrice", () => {
    const line = toPortalInvoice(base, "c").lines[0];
    expect(line.type).toBe("charge");
    expect(line.amountMinor).toBe(149900);
    expect(line.description).toBe("Starter Monthly");
  });

  it("hides Draft invoices from customers", () => {
    expect(isCustomerVisible(make({ status: "DRAFT" }))).toBe(false);
    expect(isCustomerVisible(base)).toBe(true);
    expect(isCustomerVisible(make({ status: "VOID" }))).toBe(true);
  });

  it("outstanding = confirmed with balance left", () => {
    expect(isOutstanding(toPortalInvoice(base, "c"))).toBe(true);
    expect(isOutstanding(toPortalInvoice(make({ status: "PAID", paidAmount: 176882 }), "c"))).toBe(false);
    expect(isOutstanding(toPortalInvoice(make({ status: "VOID" }), "c"))).toBe(false);
  });
});