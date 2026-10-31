/**
 * Payments Module Repository
 * OWNER: Dev B (@devB)
 */

import { db } from "@/lib/db";
import { Payment, PaymentMethod, PaymentStatus } from "@prisma/client";

export class PaymentRepository {
  async recordPayment(data: {
    invoiceId: string;
    customerId: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionRef?: string;
    recordedById?: string;
  }): Promise<Payment> {
    return await db.payment.create({
      data: {
        invoiceId: data.invoiceId,
        customerId: data.customerId,
        amount: data.amount,
        method: data.method,
        status: data.status,
        transactionRef: data.transactionRef,
        recordedById: data.recordedById,
      },
    });
  }

  async listByInvoice(invoiceId: string): Promise<Payment[]> {
    return await db.payment.findMany({
      where: { invoiceId },
    });
  }
}

export const paymentRepo = new PaymentRepository();
