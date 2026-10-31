/**
 * Subscriptions Module Repository
 * OWNER: Dev B (@devB)
 */

import { db } from "@/lib/db";
import { Prisma, Subscription, SubscriptionStatus } from "@prisma/client";

const withRelations = {
  customer: true,
  lines: {
    include: {
      product: true,
      variant: true,
      plan: true,
    },
  },
} satisfies Prisma.SubscriptionInclude;

export type SubscriptionRecord = Prisma.SubscriptionGetPayload<{
  include: typeof withRelations;
}>;

export class SubscriptionRepository {
  async findById(id: string) {
    return await db.subscription.findUnique({
      where: { id },
      include: withRelations,
    });
  }

  async listByCustomer(customerId: string) {
    return await db.subscription.findMany({
      where: { customerId },
      include: withRelations,
    });
  }

  async updateStatus(id: string, status: SubscriptionStatus): Promise<Subscription> {
    return await db.subscription.update({
      where: { id },
      data: { status },
    });
  }

  async listPage(opts: {
    customerId?: string;
    status?: SubscriptionStatus;
    page: number;
    pageSize: number;
  }) {
    const where: Prisma.SubscriptionWhereInput = {};
    if (opts.customerId) where.customerId = opts.customerId;
    if (opts.status) where.status = opts.status;

    const [rows, total] = await Promise.all([
      db.subscription.findMany({
        where,
        skip: (opts.page - 1) * opts.pageSize,
        take: opts.pageSize,
        orderBy: { createdAt: "desc" },
        include: withRelations,
      }),
      db.subscription.count({ where }),
    ]);
    return { rows, total };
  }

  async findCustomer(id: string) {
    return await db.customer.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
  }

  async findPlan(id: string) {
    return await db.plan.findUnique({
      where: { id },
      select: { id: true, name: true, active: true },
    });
  }

  async findProducts(ids: string[]) {
    return await db.product.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
  }

  async createDraft(d: {
    customerId: string;
    startDate: Date;
    endDate: Date | null;
    lines: { productId: string; planId: string; quantity: number; unitPrice: number }[];
  }): Promise<SubscriptionRecord> {
    return await db.subscription.create({
      data: {
        customerId: d.customerId,
        status: "DRAFT",
        startDate: d.startDate,
        endDate: d.endDate,
        lines: { create: d.lines },
      },
      include: withRelations,
    });
  }

  // Status badlo sirf tab jab abhi bhi "from" status hi ho (race se bachne ke liye).
  // Return: kitni rows badli (0 matlab kisi aur request ne pehle badal diya).
  async transitionStatus(d: {
    id: string;
    from: SubscriptionStatus;
    to: SubscriptionStatus;
    data?: { nextBillingDate?: Date | null; cancelledAt?: Date | null };
  }): Promise<number> {
    const res = await db.subscription.updateMany({
      where: { id: d.id, status: d.from },
      data: { status: d.to, ...d.data },
    });
    return res.count;
  }
}

export const subscriptionRepo = new SubscriptionRepository();