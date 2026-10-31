/**
 * Reports Module Repository
 * OWNER: Dev A (@devA)
 * Optimized SQL aggregation queries for fast analytical execution (<2s target).
 */

import { db } from "@/lib/db";

export class ReportRepository {
  async countActiveSubscriptions(): Promise<number> {
    try {
      return await db.subscription.count({
        where: { status: "ACTIVE" },
      });
    } catch {
      return 0;
    }
  }

  async sumOutstandingInvoices(): Promise<number> {
    try {
      const result = await db.invoice.aggregate({
        where: { status: "CONFIRMED" },
        _sum: { totalAmount: true, paidAmount: true },
      });
      const total = result._sum?.totalAmount || 0;
      const paid = result._sum?.paidAmount || 0;
      return total - paid;
    } catch {
      return 0;
    }
  }
}

export const reportRepo = new ReportRepository();
