/**
 * Staff Module Repository
 * OWNER: Dev B (@devB)
 */

import { db } from "@/lib/db";
import { User, Role } from "@prisma/client";

export class StaffRepository {
  async listStaff(): Promise<User[]> {
    return await db.user.findMany({
      where: { role: Role.STAFF },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await db.user.findFirst({
      where: { id, role: Role.STAFF },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await db.user.findUnique({ where: { email } });
  }

  async createStaff(data: { name: string; email: string; passwordHash: string }): Promise<User> {
    return await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: Role.STAFF,
      },
    });
  }

  async updateName(id: string, name: string): Promise<User> {
    return await db.user.update({ where: { id }, data: { name } });
  }
}

export const staffRepo = new StaffRepository();