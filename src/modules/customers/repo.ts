/**
 * Customers Module Repository
 * OWNER: Dev B (@devB)
 */

import { db } from "@/lib/db";
import { Customer, Prisma } from "@prisma/client";

type CustomerWrite = {
  name?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
  taxId?: string | null;
};

export class CustomerRepository {
  async listAll(): Promise<Customer[]> {
    return await db.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async listPage(opts: { q?: string; page: number; pageSize: number }) {
    const where: Prisma.CustomerWhereInput = opts.q
      ? {
          OR: [
            { name: { contains: opts.q, mode: "insensitive" } },
            { email: { contains: opts.q, mode: "insensitive" } },
            { company: { contains: opts.q, mode: "insensitive" } },
          ],
        }
      : {};

    const [rows, total] = await Promise.all([
      db.customer.findMany({
        where,
        skip: (opts.page - 1) * opts.pageSize,
        take: opts.pageSize,
        orderBy: { createdAt: "desc" },
      }),
      db.customer.count({ where }),
    ]);
    return { rows, total };
  }

  async findById(id: string): Promise<Customer | null> {
    return await db.customer.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return await db.customer.findUnique({ where: { email } });
  }

  async create(data: {
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    address?: string | null;
    taxId?: string | null;
  }): Promise<Customer> {
    return await db.customer.create({ data });
  }

  async update(id: string, data: CustomerWrite): Promise<Customer> {
    return await db.customer.update({ where: { id }, data });
  }

  // Active subscriptions ki lines se MRR (lines ka unitPrice * quantity) aur Confirmed invoices ka baaki balance.
  async rollup(customerId: string) {
    const [subs, invoices] = await Promise.all([
      db.subscription.findMany({
        where: { customerId, status: "ACTIVE" },
        select: { lines: { select: { quantity: true, unitPrice: true } } },
      }),
      db.invoice.findMany({
        where: { status: "CONFIRMED", subscription: { customerId } },
        select: { totalAmount: true, paidAmount: true },
      }),
    ]);

    const totalMrrMinor = subs.reduce(
      (sum, s) => sum + s.lines.reduce((acc, l) => acc + l.unitPrice * l.quantity, 0),
      0,
    );
    const open = invoices.filter((i) => i.totalAmount - i.paidAmount > 0);

    return {
      activeSubscriptionsCount: subs.length,
      totalMrrMinor,
      outstandingInvoicesCount: open.length,
      totalOutstandingMinor: open.reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0),
    };
  }
}

export const customerRepo = new CustomerRepository();