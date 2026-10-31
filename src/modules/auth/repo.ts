import { db } from "@/lib/db";
import { User, Role } from "@prisma/client";
import { ConflictError } from "@/lib/errors";

export class AuthRepository {
  // Errors ab swallow nahi hote: DB down ho to asli error upar jayega
  async findByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  }

  async findById(id: string): Promise<User | null> {
    return db.user.findUnique({ where: { id } });
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
    name: string;
    role?: Role;
    customerId?: string;
  }): Promise<User> {
    return db.user.create({
      data: {
        email: data.email.trim().toLowerCase(),
        passwordHash: data.passwordHash,
        name: data.name,
        role: data.role ?? Role.CUSTOMER,
        customerId: data.customerId,
      },
    });
  }

  // Signup: Customer record + User ek saath (transaction: ya dono bante hain ya koi nahi)
  async createUserWithCustomer(data: {
    email: string;
    passwordHash: string;
    name: string;
    companyName?: string;
  }): Promise<User> {
    const email = data.email.trim().toLowerCase();
    return db.$transaction(async (tx) => {
      const existing = await tx.customer.findUnique({
        where: { email },
        include: { users: { select: { id: true } } },
      });
      let customerId: string;
      if (existing) {
        if (existing.users.length > 0) {
          throw new ConflictError("An account with this email already exists.");
        }
        customerId = existing.id; // admin ne pehle se banaya customer, ab link ho gaya
      } else {
        const customer = await tx.customer.create({
          data: { name: data.companyName?.trim() || data.name, email, company: data.companyName?.trim() || null },
        });
        customerId = customer.id;
      }
      return tx.user.create({
        data: {
          email,
          passwordHash: data.passwordHash,
          name: data.name,
          role: Role.CUSTOMER, // signup se hamesha customer
          customerId,
        },
      });
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await db.user.update({ where: { id: userId }, data: { passwordHash } });
  }
}

export const authRepo = new AuthRepository();
