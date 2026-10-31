/**
 * Subscriptions Module Repository
 * OWNER: Dev B (@devB)
 */

import { db } from "@/lib/db";
import { ConflictError } from "@/lib/errors";
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

  // basePrice: server-side price calculation ke liye (client ka unitPrice trust nahi hota).
  async findPlan(id: string) {
    return await db.plan.findUnique({
      where: { id },
      select: { id: true, name: true, active: true, basePrice: true },
    });
  }

  async findProducts(ids: string[]) {
    return await db.product.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
  }

  // Us saal ka agla number: SUB-2026-0001, SUB-2026-0002, ...
  private async nextNumber(year: number): Promise<string> {
    const prefix = `SUB-${year}-`;
    const last = await db.subscription.findFirst({
      where: { number: { startsWith: prefix } },
      orderBy: { number: "desc" },
      select: { number: true },
    });
    const lastSeq = last?.number ? Number.parseInt(last.number.slice(prefix.length), 10) : 0;
    const next = (Number.isFinite(lastSeq) ? lastSeq : 0) + 1;
    return `${prefix}${String(next).padStart(4, "0")}`;
  }

  // Number unique hai: do request ek saath aayein to clash par naya number lekar dobara try.
  async createDraft(d: {
    customerId: string;
    startDate: Date;
    endDate: Date | null;
    paymentTerms: number;
    year: number;
    lines: { productId: string; planId: string; quantity: number; unitPrice: number }[];
  }): Promise<SubscriptionRecord> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const number = await this.nextNumber(d.year);
      try {
        return await db.subscription.create({
          data: {
            number,
            customerId: d.customerId,
            status: "DRAFT",
            startDate: d.startDate,
            endDate: d.endDate,
            paymentTerms: d.paymentTerms,
            lines: { create: d.lines },
          },
          include: withRelations,
        });
      } catch (err) {
        const clash = err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
        if (!clash) throw err;
      }
    }
    throw new ConflictError("Could not allocate a subscription number. Please retry.");
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

  // Pause/resume: sirf ACTIVE subscription par, aur sirf jab isPaused abhi "from" ho.
  async setPaused(d: { id: string; from: boolean; to: boolean }): Promise<number> {
    const res = await db.subscription.updateMany({
      where: { id: d.id, status: "ACTIVE", isPaused: d.from },
      data: { isPaused: d.to },
    });
    return res.count;
  }
}

export const subscriptionRepo = new SubscriptionRepository();