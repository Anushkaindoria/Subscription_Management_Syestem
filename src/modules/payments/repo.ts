/**
 * Payments Module Repository
 * OWNER: Dev B (@devB)
 */

import { db } from "@/lib/db";
import { ConflictError } from "@/lib/errors";
import { Payment, PaymentMethod } from "@prisma/client";

export class PaymentRepository {
  async findInvoice(id: string) {
    const inv = await db.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        paidAmount: true,
        subscription: { select: { customerId: true } },
      },
    });
    if (!inv) return null;
    return {
      id: inv.id,
      status: inv.status as string,
      totalAmount: inv.totalAmount,
      paidAmount: inv.paidAmount,
      customerId: inv.subscription.customerId,
    };
  }

  // Invoice update + payment create ek transaction mein: ya dono hote hain ya koi nahi.
  // updateMany ki where condition (paidAmount same ho) se do saath aaye payments ka race rukta hai.
  async recordAgainstInvoice(d: {
    invoiceId: string;
    customerId: string;
    amount: number;
    method: PaymentMethod;
    transactionRef?: string;
    recordedById?: string;
    expectedPaid: number;
    newPaid: number;
    markPaid: boolean;
    paidAt: Date;
  }): Promise<Payment> {
    return db.$transaction(async (tx) => {
      const upd = await tx.invoice.updateMany({
        where: { id: d.invoiceId, status: "CONFIRMED", paidAmount: d.expectedPaid },
        data: d.markPaid
          ? { paidAmount: d.newPaid, status: "PAID", paidAt: d.paidAt }
          : { paidAmount: d.newPaid },
      });
      if (upd.count === 0) {
        throw new ConflictError("Invoice was changed by another request. Please retry.");
      }
      return tx.payment.create({
        data: {
          invoiceId: d.invoiceId,
          customerId: d.customerId,
          amount: d.amount,
          method: d.method,
          status: "SUCCEEDED",
          transactionRef: d.transactionRef,
          recordedById: d.recordedById,
        },
      });
    });
  }

  async listPage(page: number, pageSize: number) {
    const [rows, total] = await Promise.all([
      db.payment.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          invoice: { select: { invoiceNumber: true } },
          customer: { select: { name: true } },
        },
      }),
      db.payment.count(),
    ]);
    return { rows, total };
  }

  async listByInvoice(invoiceId: string): Promise<Payment[]> {
    return db.payment.findMany({ where: { invoiceId } });
  }
}

export const paymentRepo = new PaymentRepository();
