/**
 * RBAC Module Repository
 * OWNER: Dev B (@devB)
 */

import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export class RbacRepository {
  async getUserRole(userId: string): Promise<Role | null> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      return user?.role ?? null;
    } catch {
      return null;
    }
  }
}

export const rbacRepo = new RbacRepository();
