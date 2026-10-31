/**
 * Tax Module Repository
 * OWNER: Dev A (@devA)
 */

import { db } from "@/lib/db";
import { TaxRule } from "@prisma/client";

export class TaxRepository {
  async findById(id: string): Promise<TaxRule | null> {
    try {
      return await db.taxRule.findUnique({ where: { id } });
    } catch {
      return null;
    }
  }

  async listActive(): Promise<TaxRule[]> {
    try {
      return await db.taxRule.findMany({ where: { active: true } });
    } catch {
      return [];
    }
  }
}

export const taxRepo = new TaxRepository();
