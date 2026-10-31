/**
 * Invoices Module Repository
 * OWNER: Dev A (@devA)
 */

import { db } from "@/lib/db";
import { Invoice, InvoiceStatus, Prisma } from "@prisma/client";
import { BusinessRuleError } from "@/lib/errors";

const detailInclude = Prisma.validator<Prisma.InvoiceInclude>()({
  subscription: { include: { customer: true } },
  lines: true,
  payments: true,
});

export type InvoiceDetail = Prisma.InvoiceGetPayload<{ include: typeof detailInclude }>;

export class InvoiceRepository {
  async findById(id: string): Promise<InvoiceDetail | null> {
    return await db.invoice.findUnique({ where: { id }, include: detailInclude });
  }

  async listAll(): Promise<InvoiceDetail[]> {
    return await db.invoice.findMany({
      include: detailInclude,
      orderBy: { createdAt: "desc" },
      take: 500,
    });
  }

  async listByCustomer(customerId: string): Promise<InvoiceDetail[]> {
    return await db.invoice.findMany({
      where: { subscription: { customerId } },
      include: detailInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    return await db.invoice.update({ where: { id }, data: { status } });
  }

  /** Cancel: only DRAFT, or CONFIRMED with no payments. Returns discount usage. One transaction. */
  async cancelInvoice(id: string): Promise<void> {
    await db.$transaction(async (tx) => {
      const inv = await tx.invoice.findUnique({
        where: { id },
        include: { payments: { select: { id: true } } },
      });
      if (!inv) throw new BusinessRuleError(`Invoice ${id} not found`);
      const cancellable = inv.status === "DRAFT" || inv.status === "CONFIRMED";
      if (!cancellable || inv.paidAmount > 0 || inv.payments.length > 0) {
        throw new BusinessRuleError(
          "Only a Draft invoice, or a Confirmed invoice with no payments, can be cancelled",
        );
      }
      for (const discountId of inv.discountIds) {
        await tx.discount.updateMany({
          where: { id: discountId, usageCount: { gt: 0 } },
          data: { usageCount: { decrement: 1 } },
        });
      }
      await tx.invoice.update({ where: { id }, data: { status: "CANCELLED" } });
    });
  }

  /** Recompute paidAmount from SUCCEEDED payments; auto-mark PAID when fully paid. */
  async recomputePaid(id: string, now: Date): Promise<Invoice> {
    return await db.$transaction(async (tx) => {
      const sum = await tx.payment.aggregate({
        where: { invoiceId: id, status: "SUCCEEDED" },
        _sum: { amount: true },
      });
      const paid = sum._sum.amount ?? 0;
      const inv = await tx.invoice.findUniqueOrThrow({ where: { id } });
      const fullyPaid = inv.status === "CONFIRMED" && paid >= inv.totalAmount;
      return await tx.invoice.update({
        where: { id },
        data: fullyPaid
          ? { paidAmount: paid, status: "PAID", paidAt: now }
          : { paidAmount: paid },
      });
    });
  }
}

export const invoiceRepo = new InvoiceRepository();