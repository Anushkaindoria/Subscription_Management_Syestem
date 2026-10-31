/**
 * Ask Module Repository
 * OWNER: Dev A (@devA)
 * Note: NEVER execute raw arbitrary SQL! Only translates to predefined Prisma queries.
 */

import { db } from "@/lib/db";

export class AskRepository {
  async querySubscribers(status = "ACTIVE") {
    return await db.subscription.findMany({
      where: { status: status as "ACTIVE" },
      select: {
        id: true,
        customerId: true,
        status: true,
        renewalInterval: true,
      },
      take: 20,
    });
  }
}

export const askRepo = new AskRepository();
