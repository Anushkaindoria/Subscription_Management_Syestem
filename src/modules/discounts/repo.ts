/**
 * Discounts Module Repository
 * OWNER: Dev A (@devA)
 */

import { db } from "@/lib/db";
import { Discount } from "@prisma/client";

export class DiscountRepository {
  async findByCode(code: string): Promise<Discount | null> {
    try {
      return await db.discount.findUnique({ where: { code } });
    } catch {
      return null;
    }
  }

  /**
   * Atomically increments usageCount only if usageCount < maxUsageLimit.
   * Guarantees atomic coupon cap enforcement under concurrent checkout load.
   */
  async incrementUsageAtomic(id: string): Promise<boolean> {
    try {
      // Prisma raw or update with condition
      const updated = await db.discount.updateMany({
        where: {
          id,
          active: true,
          OR: [{ maxUsageLimit: null }, { usageCount: { lt: db.discount.fields.maxUsageLimit } }],
        },
        data: {
          usageCount: { increment: 1 },
        },
      });
      return updated.count > 0;
    } catch {
      return false;
    }
  }
}

export const discountRepo = new DiscountRepository();
