/**
 * Invoices Module Repository
 * OWNER: Dev A (@devA)
 */

import { db } from "@/lib/db";
import { Invoice, InvoiceStatus } from "@prisma/client";

export class InvoiceRepository {
  async findById(id: string) {
    return await db.invoice.findUnique({
      where: { id },
      include: {
        subscription: { include: { customer: true } },
        lines: true,
        payments: true,
      },
    });
  }

  async listByCustomer(customerId: string) {
    return await db.invoice.findMany({
      where: {
        subscription: {
          customerId,
        },
      },
      include: {
        lines: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    return await db.invoice.update({
      where: { id },
      data: { status },
    });
  }
}

export const invoiceRepo = new InvoiceRepository();
