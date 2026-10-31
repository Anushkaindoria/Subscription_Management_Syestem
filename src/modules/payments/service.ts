/**
 * Payments Module Service
 * OWNER: Dev B (@devB)
 */

import { RecordPaymentDTO, PaymentDTO } from "@/contracts";
import { PaymentReceipt } from "./types";
import { config } from "@/lib/config";
import { clock } from "@/lib/clock";

export class PaymentService {
  async recordPayment(dto: RecordPaymentDTO): Promise<PaymentReceipt> {
    if (config.isMockApi) {
      const payment: PaymentDTO = {
        id: `pay_mock_${Date.now()}`,
        invoiceId: dto.invoiceId,
        customerId: "cust_acme_corp",
        amount: dto.amount,
        method: dto.method,
        status: "SUCCEEDED",
        transactionRef: dto.transactionRef || `txn_mock_${Date.now()}`,
        createdAt: clock.now().toISOString(),
      };
      return {
        payment,
        invoiceFullyPaid: true,
        remainingBalanceMinor: 0,
      };
    }

    // Dev B: database transaction recording payment & updating invoice status
    return {
      payment: {
        id: "pay_placeholder",
        invoiceId: dto.invoiceId,
        customerId: "cust_placeholder",
        amount: dto.amount,
        method: dto.method,
        status: "SUCCEEDED",
        transactionRef: dto.transactionRef,
        createdAt: clock.now().toISOString(),
      },
      invoiceFullyPaid: true,
      remainingBalanceMinor: 0,
    };
  }
}

export const paymentService = new PaymentService();
