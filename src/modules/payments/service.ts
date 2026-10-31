/**
 * Payments Module Service
 * OWNER: Dev B (@devB)
 *
 * Rules: payment sirf Confirmed invoice par, overpayment reject,
 * total tak pahunchte hi invoice Paid (paidAt set).
 * Payment ke baad invoiceService.recomputePaid (Dev A) safety net ke taur par call hota hai.
 */

import { RecordPaymentDTO, PaymentDTO } from "@/contracts";
import { PaymentReceipt } from "./types";
import { config } from "@/lib/config";
import { clock } from "@/lib/clock";
import { BusinessRuleError, NotFoundError, ValidationError } from "@/lib/errors";
import { invoiceService } from "@/modules/invoices";
import { paymentRepo } from "./repo";

type DbMethod = "CHEQUE" | "CREDIT_CARD" | "BANK_TRANSFER" | "CASH" | "UPI";

// Contract (lowercase) -> database enum.
const METHOD_IN: Record<string, DbMethod> = {
  card: "CREDIT_CARD",
  credit_card: "CREDIT_CARD",
  bank_transfer: "BANK_TRANSFER",
  cheque: "CHEQUE",
  cash: "CASH",
  upi: "UPI",
};
const METHOD_OUT: Record<DbMethod, string> = {
  CHEQUE: "cheque",
  CREDIT_CARD: "card",
  BANK_TRANSFER: "bank_transfer",
  CASH: "cash",
  UPI: "upi",
};

export class PaymentService {
  async recordPayment(dto: RecordPaymentDTO): Promise<PaymentReceipt> {
    if (config.isMockApi) {
      const payment: PaymentDTO = {
        id: `pay_mock_${Date.now()}`,
        invoiceId: dto.invoiceId,
        customerId: "cust_acme_retail",
        amount: dto.amount,
        method: dto.method,
        status: "SUCCEEDED",
        transactionRef: dto.transactionRef || `txn_mock_${Date.now()}`,
        createdAt: clock.now().toISOString(),
      };
      return { payment, invoiceFullyPaid: true, remainingBalanceMinor: 0 };
    }

    const method = METHOD_IN[String(dto.method).toLowerCase()];
    if (!method) throw new ValidationError("Unsupported payment method.");

    const invoice = await paymentRepo.findInvoice(dto.invoiceId);
    if (!invoice) throw new NotFoundError("Invoice", dto.invoiceId);

    if (invoice.status !== "CONFIRMED") {
      throw new BusinessRuleError(
        `Payments can only be recorded on Confirmed invoices (this invoice is ${invoice.status.toLowerCase()}).`,
      );
    }

    const balance = invoice.totalAmount - invoice.paidAmount;
    if (dto.amount > balance) {
      throw new BusinessRuleError(
        `Overpayment rejected: amount ${dto.amount} is more than the remaining balance ${balance} (paise).`,
      );
    }

    const newPaid = invoice.paidAmount + dto.amount;
    const fullyPaid = newPaid >= invoice.totalAmount;

    const saved = await paymentRepo.recordAgainstInvoice({
      invoiceId: invoice.id,
      customerId: invoice.customerId,
      amount: dto.amount,
      method,
      transactionRef: dto.transactionRef ?? dto.note,
      recordedById: dto.recordedById,
      expectedPaid: invoice.paidAmount,
      newPaid,
      markPaid: fullyPaid,
      paidAt: clock.now(),
    });

    // Payment pehle hi save ho chuki hai; recompute fail ho to bhi payment ka response sahi rahe.
    try {
      await invoiceService.recomputePaid(invoice.id);
    } catch {
      // Safety net only: paidAmount/status upar transaction mein pehle hi set ho chuke hain.
    }

    return {
      payment: {
        id: saved.id,
        invoiceId: saved.invoiceId,
        customerId: saved.customerId,
        amount: saved.amount,
        method: METHOD_OUT[saved.method as DbMethod],
        status: saved.status,
        transactionRef: saved.transactionRef,
        createdAt: saved.createdAt.toISOString(),
      },
      invoiceFullyPaid: fullyPaid,
      remainingBalanceMinor: invoice.totalAmount - newPaid,
    };
  }

  async listPayments(page = 1, pageSize = 25) {
    const p = Math.max(1, page);
    const size = Math.min(100, Math.max(1, pageSize));
    const { rows, total } = await paymentRepo.listPage(p, size);
    return {
      items: rows.map((r) => ({
        id: r.id,
        invoiceId: r.invoiceId,
        invoiceNumber: r.invoice.invoiceNumber,
        customerId: r.customerId,
        customerName: r.customer.name,
        method: METHOD_OUT[r.method as DbMethod],
        amount: r.amount,
        paidOn: r.createdAt.toISOString().slice(0, 10),
        note: r.transactionRef,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      })),
      total,
      page: p,
      pageSize: size,
      totalPages: Math.max(1, Math.ceil(total / size)),
    };
  }
}

export const paymentService = new PaymentService();