/**
 * Invoices Module Service
 * OWNER: Dev A (@devA)
 *
 * Implements:
 * 1. Invoice lifecycle: DRAFT -> CONFIRMED -> PAID (or VOID)
 * 2. PDF data generation for Dev C
 * 3. Send & Print triggers
 */

import { InvoiceDTO, InvoicePdfDataDTO, InvoiceStatusType } from "@/contracts";
import { config } from "@/lib/config";
import { clock } from "@/lib/clock";
import { BusinessRuleError, NotFoundError } from "@/lib/errors";
import { invoiceRepo } from "./repo";

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

export class InvoiceService {
  async listInvoices(customerId?: string): Promise<InvoiceDTO[]> {
    if (config.isMockApi) {
      return MOCK_INVOICES;
    }
    // Dev A: repository query
    return MOCK_INVOICES;
  }

  async getInvoiceById(id: string): Promise<InvoiceDTO> {
    if (config.isMockApi) {
      const inv = MOCK_INVOICES.find((i) => i.id === id);
      if (!inv) throw new NotFoundError("Invoice", id);
      return inv;
    }
    const inv = await invoiceRepo.findById(id);
    if (!inv) throw new NotFoundError("Invoice", id);
    return MOCK_INVOICES[0];
  }

  async transitionStatus(invoiceId: string, targetStatus: InvoiceStatusType): Promise<InvoiceDTO> {
    const invoice = await this.getInvoiceById(invoiceId);
    const allowed = ALLOWED_INVOICE_TRANSITIONS[invoice.status] || [];

    if (!allowed.includes(targetStatus)) {
      throw new BusinessRuleError(
        `Cannot transition invoice from '${invoice.status}' to '${targetStatus}'. Allowed: [${allowed.join(", ")}]`,
      );
    }

    if (config.isMockApi) {
      invoice.status = targetStatus;
      if (targetStatus === "PAID") {
        invoice.paidAt = clock.now().toISOString();
        invoice.paidAmount = invoice.totalAmount;
      }
      return invoice;
    }

    return invoice;
  }

  async getPdfData(invoiceId: string): Promise<InvoicePdfDataDTO> {
    const invoice = await this.getInvoiceById(invoiceId);

    return {
      invoice,
      companyInfo: {
        name: "LoopOS Cloud Technologies Inc.",
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
