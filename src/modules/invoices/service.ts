/**
 * Invoices Module Service
 * OWNER: Dev A (@devA)
 *
 * Implements:
 * 1. Invoice lifecycle: DRAFT -> CONFIRMED -> PAID (or VOID = cancelled)
 * 2. PDF data generation for Dev C
 * 3. Send & Print triggers
 * Overdue is derived (due date passed and money outstanding), never stored.
 */

import { InvoiceDTO, InvoicePdfDataDTO, InvoiceStatusType } from "@/contracts";
import { config } from "@/lib/config";
import { clock } from "@/lib/clock";
import { BusinessRuleError, NotFoundError } from "@/lib/errors";
import { invoiceRepo, InvoiceDetail } from "./repo";

const ALLOWED_INVOICE_TRANSITIONS: Record<InvoiceStatusType, InvoiceStatusType[]> = {
  DRAFT: ["CONFIRMED", "VOID"],
  CONFIRMED: ["PAID", "OVERDUE", "VOID"],
  PAID: [],
  OVERDUE: ["PAID", "VOID"],
  VOID: [],
};

const MOCK_INVOICES: InvoiceDTO[] = [
  {
    id: "inv_mock_001",
    subscriptionId: "sub_mock_001",
    customerName: "Acme Industrial Corp",
    customerEmail: "billing@acmecorp.com",
    invoiceNumber: "INV-2026-0001",
    status: "CONFIRMED",
    periodStart: "2026-10-01T00:00:00.000Z",
    periodEnd: "2026-10-31T23:59:59.000Z",
    subtotal: 9900,
    discountAmount: 0,
    taxAmount: 1782, // 18% GST
    totalAmount: 11682,
    paidAmount: 0,
    dueDate: "2026-11-15T00:00:00.000Z",
    paidAt: null,
    pdfUrl: "/api/invoices/inv_mock_001/pdf",
    createdAt: "2026-10-01T00:00:00.000Z",
    lines: [
      {
        description: "LoopCRM Enterprise - Monthly Subscription (Oct 2026)",
        quantity: 1,
        unitPrice: 9900,
        taxAmount: 1782,
        discountAmount: 0,
        totalAmount: 11682,
      },
    ],
  },
  {
    id: "inv_mock_002",
    subscriptionId: "sub_mock_001",
    customerName: "Acme Industrial Corp",
    customerEmail: "billing@acmecorp.com",
    invoiceNumber: "INV-2026-0002",
    status: "PAID",
    periodStart: "2026-09-01T00:00:00.000Z",
    periodEnd: "2026-09-30T23:59:59.000Z",
    subtotal: 9900,
    discountAmount: 0,
    taxAmount: 1782,
    totalAmount: 11682,
    paidAmount: 11682,
    dueDate: "2026-10-15T00:00:00.000Z",
    paidAt: "2026-10-10T14:32:00.000Z",
    pdfUrl: "/api/invoices/inv_mock_002/pdf",
    createdAt: "2026-09-01T00:00:00.000Z",
    lines: [
      {
        description: "LoopCRM Enterprise - Monthly Subscription (Sep 2026)",
        quantity: 1,
        unitPrice: 9900,
        taxAmount: 1782,
        discountAmount: 0,
        totalAmount: 11682,
      },
    ],
  },
];

function toDTO(inv: InvoiceDetail, now: Date): InvoiceDTO {
  let status: InvoiceStatusType = inv.status === "CANCELLED" ? "VOID" : inv.status;
  if (inv.status === "CONFIRMED" && inv.dueDate < now && inv.totalAmount > inv.paidAmount) {
    status = "OVERDUE";
  }
  return {
    id: inv.id,
    subscriptionId: inv.subscriptionId,
    customerName: inv.subscription.customer.name,
    customerEmail: inv.subscription.customer.email,
    invoiceNumber: inv.invoiceNumber,
    status,
    periodStart: inv.periodStart.toISOString(),
    periodEnd: inv.periodEnd.toISOString(),
    subtotal: inv.subtotal,
    discountAmount: inv.discountAmount,
    taxAmount: inv.taxAmount,
    totalAmount: inv.totalAmount,
    paidAmount: inv.paidAmount,
    dueDate: inv.dueDate.toISOString(),
    paidAt: inv.paidAt ? inv.paidAt.toISOString() : null,
    pdfUrl: inv.pdfUrl ?? `/api/invoices/${inv.id}/pdf`,
    createdAt: inv.createdAt.toISOString(),
    lines: inv.lines.map((l) => ({
      description: l.description,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      taxAmount: l.taxAmount,
      discountAmount: l.discountAmount,
      totalAmount: l.totalAmount,
    })),
  };
}

export class InvoiceService {
  async listInvoices(customerId?: string): Promise<InvoiceDTO[]> {
    if (config.isMockApi) {
      return MOCK_INVOICES;
    }
    const now = clock.now();
    const rows = customerId
      ? await invoiceRepo.listByCustomer(customerId)
      : await invoiceRepo.listAll();
    return rows.map((r) => toDTO(r, now));
  }

  async getInvoiceById(id: string): Promise<InvoiceDTO> {
    if (config.isMockApi) {
      const inv = MOCK_INVOICES.find((i) => i.id === id);
      if (!inv) throw new NotFoundError("Invoice", id);
      return inv;
    }
    const inv = await invoiceRepo.findById(id);
    if (!inv) throw new NotFoundError("Invoice", id);
    return toDTO(inv, clock.now());
  }

  async transitionStatus(invoiceId: string, targetStatus: InvoiceStatusType): Promise<InvoiceDTO> {
    if (config.isMockApi) {
      const invoice = await this.getInvoiceById(invoiceId);
      const allowed = ALLOWED_INVOICE_TRANSITIONS[invoice.status] || [];
      if (!allowed.includes(targetStatus)) {
        throw new BusinessRuleError(
          `Cannot transition invoice from '${invoice.status}' to '${targetStatus}'. Allowed: [${allowed.join(", ")}]`,
        );
      }
      invoice.status = targetStatus;
      if (targetStatus === "PAID") {
        invoice.paidAt = clock.now().toISOString();
        invoice.paidAmount = invoice.totalAmount;
      }
      return invoice;
    }

    const inv = await invoiceRepo.findById(invoiceId);
    if (!inv) throw new NotFoundError("Invoice", invoiceId);

    const stored: InvoiceStatusType = inv.status === "CANCELLED" ? "VOID" : inv.status;
    const allowed = ALLOWED_INVOICE_TRANSITIONS[stored] || [];
    if (!allowed.includes(targetStatus)) {
      throw new BusinessRuleError(
        `Cannot transition invoice from '${stored}' to '${targetStatus}'. Allowed: [${allowed.join(", ")}]`,
      );
    }

    if (targetStatus === "OVERDUE") {
      throw new BusinessRuleError("Overdue is derived from the due date and cannot be set manually");
    }
    if (targetStatus === "CONFIRMED") {
      await invoiceRepo.updateStatus(invoiceId, "CONFIRMED");
    } else if (targetStatus === "VOID") {
      await invoiceRepo.cancelInvoice(invoiceId);
    } else if (targetStatus === "PAID") {
      if (inv.paidAmount < inv.totalAmount) {
        throw new BusinessRuleError(
          "Invoice becomes Paid automatically once payments cover the total; record a payment instead",
        );
      }
      await invoiceRepo.updateStatus(invoiceId, "PAID");
    }
    return await this.getInvoiceById(invoiceId);
  }

  /** Call after a payment is recorded: recomputes paidAmount and auto-marks PAID. */
  async recomputePaid(invoiceId: string): Promise<InvoiceDTO> {
    if (!config.isMockApi) {
      await invoiceRepo.recomputePaid(invoiceId, clock.now());
    }
    return await this.getInvoiceById(invoiceId);
  }

  async getPdfData(invoiceId: string): Promise<InvoicePdfDataDTO> {
    const invoice = await this.getInvoiceById(invoiceId);

    return {
      invoice,
      companyInfo: {
        name: "Brightloop Software",
        address: "742 Evergreen Terrace, Suite 100, Bengaluru 560001",
        taxId: "GSTIN-29AAACA9999Z1ZX",
        supportEmail: "billing@loopos.local",
      },
      paymentInstructions: {
        bankName: "First National Cloud Bank",
        accountNumber: "987654321098",
        ifscSwift: "FNCB0001234",
      },
    };
  }

  async sendInvoiceEmail(invoiceId: string): Promise<{ success: boolean; recipient: string }> {
    const invoice = await this.getInvoiceById(invoiceId);
    // Dev A: Mailpit SMTP dispatch
    return {
      success: true,
      recipient: invoice.customerEmail || "customer@example.com",
    };
  }
}

export const invoiceService = new InvoiceService();