/**
 * Billing Module Repository
 * OWNER: Dev A (@devA)
 */

import { db } from "@/lib/db";
import { Subscription } from "@prisma/client";

export class BillingRepository {
  async findDueSubscriptions(asOfDate: Date): Promise<Subscription[]> {
    return await db.subscription.findMany({
      where: {
        status: "ACTIVE",
        autoRenew: true,
        nextBillingDate: {
          lte: asOfDate,
        },
      },
      include: {
        lines: true,
        customer: true,
      },
    });
  }

  async checkInvoiceExists(
    subscriptionId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<boolean> {
    const existing = await db.invoice.findUnique({
      where: {
        unique_subscription_billing_period: {
          subscriptionId,
          periodStart,
          periodEnd,
        },
      },
      select: { id: true },
    });
    return !!existing;
  }
}

export const billingRepo = new BillingRepository();
