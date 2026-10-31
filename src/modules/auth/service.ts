/**
 * Auth Module Service
 * OWNER: Dev B (@devB)
 */

import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { SessionUserDTO } from "@/contracts";
import { AuthSession } from "./types";
import { authRepo } from "./repo";
import { signSession } from "./session";
import { createResetToken, readResetToken, fingerprint } from "./reset-token";
import { sendMail } from "./mailer";
import { config } from "@/lib/config";
import { UnauthorizedError, ValidationError, ConflictError } from "@/lib/errors";

const MOCK_ADMIN_USER: SessionUserDTO = {
  id: "usr_mock_admin",
  email: "admin@loopos.local",
  name: "Riya Sharma",
  role: "admin",
  customerId: null,
};

const MOCK_CUSTOMER_USER: SessionUserDTO = {
  id: "usr_mock_customer",
  email: "billing@acmeretail.in",
  name: "Acme Retail Admin",
  role: "customer",
  customerId: "cust_acme_retail",
};

// User jo email se na mile, tab bhi bcrypt chalta hai (response time se email guess na ho)
const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8.2sVn6O2tQ0sQ8mE1m3c9gk0oYb0e";

function toSession(user: User): AuthSession {
  const role = user.role.toLowerCase() as "admin" | "staff" | "customer";
  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role,
    customerId: user.customerId,
  } as SessionUserDTO;
  return {
    token: signSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role,
      customerId: user.customerId,
    }),
    user: sessionUser,
  };
}

export class AuthService {
  async login(dto: { email: string; password: string }): Promise<AuthSession> {
    if (config.isMockApi) {
      const user = dto.email.includes("admin") ? MOCK_ADMIN_USER : MOCK_CUSTOMER_USER;
      return { token: `mock_jwt_token_${user.id}`, user };
    }

    const user = await authRepo.findByEmail(dto.email);
    const okPassword = await bcrypt.compare(dto.password, user ? user.passwordHash : DUMMY_HASH);
    if (!user || !okPassword) {
      // Ek hi message: attacker ko pata nahi chalta email sahi tha ya password
      throw new UnauthorizedError("Invalid email or password.");
    }
    return toSession(user);
  }

  async signup(dto: { name: string; email: string; password: string; companyName?: string }): Promise<AuthSession> {
    if (config.isMockApi) {
      return {
        token: "mock_jwt_token_new_user",
        user: {
          id: "usr_mock_new",
          email: dto.email,
          name: dto.name,
          role: "customer",
          customerId: "cust_mock_new",
        },
      };
    }

    const email = dto.email.trim().toLowerCase();
    if (await authRepo.findByEmail(email)) {
      throw new ConflictError("An account with this email already exists.");
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    // Role body se kabhi nahi liya jata: signup = hamesha customer
    const created = await authRepo.createUserWithCustomer({
      email,
      name: dto.name.trim(),
      passwordHash,
      companyName: dto.companyName,
    });
    return toSession(created);
  }

  async requestPasswordReset(dto: { email: string }): Promise<{ message: string }> {
    if (config.isMockApi) {
      return { message: "Mock password reset link sent to " + dto.email };
    }
    const generic = { message: "If an account exists, a reset link has been dispatched." };
    const user = await authRepo.findByEmail(dto.email);
    if (!user) return generic; // email exist karta hai ya nahi, ye nahi batate

    const token = createResetToken(user.id, user.passwordHash);
    const base = process.env.APP_URL || "http://localhost:3000";
    await sendMail(
      user.email,
      "Reset your LoopOS password",
      `Hi ${user.name},\n\nReset your password (valid for 30 minutes):\n${base}/reset-password?token=${token}\n\nIf you did not ask for this, ignore this email.`
    );
    return generic;
  }

  async confirmPasswordReset(dto: { token: string; newPassword: string }): Promise<{ success: boolean }> {
    if (config.isMockApi) {
      return { success: true };
    }
    const invalid = new ValidationError("Reset link is invalid or has expired.");
    const parsed = readResetToken(dto.token);
    if (!parsed) throw invalid;
    const user = await authRepo.findById(parsed.userId);
    // Fingerprint match nahi = password pehle hi badal chuka = token already used
    if (!user || fingerprint(user.passwordHash) !== parsed.fp) throw invalid;

    await authRepo.updatePassword(user.id, await bcrypt.hash(dto.newPassword, 10));
    return { success: true };
  }
}

export const authService = new AuthService();
