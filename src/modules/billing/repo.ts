/**
 * Billing Module Repository
 * OWNER: Dev A (@devA)
 */

import { db } from "@/lib/db";
import { Prisma, TaxRule } from "@prisma/client";

const dueInclude = Prisma.validator<Prisma.SubscriptionInclude>()({
  lines: { include: { product: true, variant: true, plan: true, discount: true } },
  customer: true,
});

export type DueSubscription = Prisma.SubscriptionGetPayload<{
  include: typeof dueInclude;
}>;

export interface NewInvoiceInput {
  subscriptionId: string;
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  discountIds: string[];
  lines: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
  }[];
}

/** Thrown inside the transaction when a discount hit its limit; the whole transaction rolls back. */
export class DiscountLimitError extends Error {
  constructor(public discountId: string) {
    super(`Discount ${discountId} is exhausted or inactive`);
  }
}

export class BillingRepository {
  async findDueSubscriptions(asOfDate: Date): Promise<DueSubscription[]> {
    return await db.subscription.findMany({
      where: {
        status: "ACTIVE",
        isPaused: false,
        nextBillingDate: { lte: asOfDate },
      },
      include: dueInclude,
    });
  }

  async findTaxRuleByCode(code: string): Promise<TaxRule | null> {
    return await db.taxRule.findFirst({ where: { code, active: true } });
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

  async advanceNextBillingDate(subscriptionId: string, next: Date): Promise<void> {
    await db.subscription.update({
      where: { id: subscriptionId },
      data: { nextBillingDate: next },
    });
  }

  private async nextInvoiceNumber(tx: Prisma.TransactionClient, year: number): Promise<string> {
    const prefix = `INV-${year}-`;
    const last = await tx.invoice.findFirst({
      where: { invoiceNumber: { startsWith: prefix } },
      orderBy: { invoiceNumber: "desc" },
      select: { invoiceNumber: true },
    });
    const lastSeq = last ? parseInt(last.invoiceNumber.slice(prefix.length), 10) : 0;
    return `${prefix}${String(lastSeq + 1).padStart(4, "0")}`;
  }

  /**
   * One transaction: consume discount usage + create invoice and lines + advance nextBillingDate.
   * All or nothing.
   */
  async createInvoiceAndAdvance(
    input: NewInvoiceInput,
    year: number,
  ): Promise<{ id: string; totalAmount: number }> {
    return await db.$transaction(async (tx) => {
      // Consume discount usage safely: compare-and-swap on usageCount
      for (const discountId of input.discountIds) {
        const d = await tx.discount.findUnique({ where: { id: discountId } });
        if (!d || !d.active || (d.maxUsageLimit !== null && d.usageCount >= d.maxUsageLimit)) {
          throw new DiscountLimitError(discountId);
        }
        const res = await tx.discount.updateMany({
          where: { id: discountId, usageCount: d.usageCount },
          data: { usageCount: { increment: 1 } },
        });
        if (res.count === 0) throw new DiscountLimitError(discountId);
      }

      const invoiceNumber = await this.nextInvoiceNumber(tx, year);
      const invoice = await tx.invoice.create({
        data: {
          subscriptionId: input.subscriptionId,
          invoiceNumber,
          status: "DRAFT",
          periodStart: input.periodStart,
          periodEnd: input.periodEnd,
          subtotal: input.subtotal,
          taxAmount: input.taxAmount,
          discountAmount: input.discountAmount,
          totalAmount: input.totalAmount,
          dueDate: input.dueDate, discountIds: input.discountIds,
          lines: { create: input.lines },
        },
        select: { id: true, totalAmount: true },
      });
      await tx.subscription.update({
        where: { id: input.subscriptionId },
        data: { nextBillingDate: input.periodEnd },
      });
      return invoice;
    });
  }
}

export const billingRepo = new BillingRepository();
