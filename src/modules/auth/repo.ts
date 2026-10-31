/**
 * Auth Module Repository
 * OWNER: Dev B (@devB)
 * Interacts with database via Prisma Client.
 */

import { db } from "@/lib/db";
import { User, Role } from "@prisma/client";

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await db.user.findUnique({ where: { email } });
    } catch {
      return null;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await db.user.findUnique({ where: { id } });
    } catch {
      return null;
    }
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
    name: string;
    role?: Role;
    customerId?: string;
  }): Promise<User> {
    return await db.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        role: data.role ?? Role.CUSTOMER,
        customerId: data.customerId,
      },
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}

export const authRepo = new AuthRepository();
