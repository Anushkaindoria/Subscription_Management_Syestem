/**
 * Reports Module Repository
 * OWNER: Dev A (@devA)
 * Optimized SQL aggregation queries for fast analytical execution (<2s target).
 */

import { db } from "@/lib/db";

export class ReportRepository {
  async countActiveSubscriptions(): Promise<number> {
    return await db.subscription.count({ where: { status: "ACTIVE" } });
  }

  async activeSubscriptionLines() {
    return await db.subscription.findMany({
      where: { status: "ACTIVE" },
      select: {
        renewalInterval: true,
        lines: {
          select: { quantity: true, unitPrice: true, variant: { select: { priceExtra: true } } },
        },
      },
    });
  }

  /** Confirmed invoices that still have money outstanding. */
  async openInvoices() {
    const rows = await db.invoice.findMany({
      where: { status: "CONFIRMED" },
      select: {
        id: true,
        invoiceNumber: true,
        totalAmount: true,
        paidAmount: true,
        dueDate: true,
        subscription: { select: { customer: { select: { name: true } } } },
      },
    });
    return rows.filter((r) => r.totalAmount > r.paidAmount);
  }

  async sumPaymentsSince(from: Date): Promise<number> {
    const res = await db.payment.aggregate({
      where: { status: "SUCCEEDED", createdAt: { gte: from } },
      _sum: { amount: true },
    });
    return res._sum.amount ?? 0;
  }
}

export const reportRepo = new ReportRepository();