/**
 * Customers Module Repository
 * OWNER: Dev B (@devB)
 */

import { db } from "@/lib/db";
import { Customer } from "@prisma/client";

export class CustomerRepository {
  async listAll(): Promise<Customer[]> {
    return await db.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<Customer | null> {
    return await db.customer.findUnique({
      where: { id },
      include: {
        subscriptions: true,
        payments: true,
      },
    });
  }

  async create(data: {
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    address?: string | null;
    taxId?: string | null;
  }): Promise<Customer> {
    return await db.customer.create({
      data,
    });
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    return await db.customer.update({
      where: { id },
      data,
    });
  }
}

export const customerRepo = new CustomerRepository();
