/**
 * Billing Module Repository
 * OWNER: Dev A (@devA)
 */

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

const dueInclude = Prisma.validator<Prisma.SubscriptionInclude>()({
  lines: { include: { product: true, variant: true, plan: true } },
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
  lines: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
  }[];
}

export class BillingRepository {
  async findDueSubscriptions(asOfDate: Date): Promise<DueSubscription[]> {
    return await db.subscription.findMany({
      where: {
        status: "ACTIVE",
        nextBillingDate: { lte: asOfDate },
      },
      include: dueInclude,
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

  /** One transaction: create invoice + lines AND advance nextBillingDate. All or nothing. */
  async createInvoiceAndAdvance(
    input: NewInvoiceInput,
    year: number,
  ): Promise<{ id: string; totalAmount: number }> {
    return await db.$transaction(async (tx) => {
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
          dueDate: input.dueDate,
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