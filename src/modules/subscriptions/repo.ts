/**
 * Subscriptions Module Repository
 * OWNER: Dev B (@devB)
 */

import { db } from "@/lib/db";
import { Subscription, SubscriptionStatus } from "@prisma/client";

export class SubscriptionRepository {
  async findById(id: string) {
    return await db.subscription.findUnique({
      where: { id },
      include: {
        customer: true,
        lines: {
          include: {
            product: true,
            variant: true,
            plan: true,
          },
        },
      },
    });
  }

  async listByCustomer(customerId: string) {
    return await db.subscription.findMany({
      where: { customerId },
      include: {
        customer: true,
        lines: {
          include: {
            product: true,
            variant: true,
            plan: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: SubscriptionStatus): Promise<Subscription> {
    return await db.subscription.update({
      where: { id },
      data: { status },
    });
  }
}

export const subscriptionRepo = new SubscriptionRepository();
