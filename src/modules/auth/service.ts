/**
 * Auth Module Service
 * OWNER: Dev B (@devB)
 */

import { LoginDTO, SignupDTO, ResetPasswordRequestDTO, ResetPasswordConfirmDTO, SessionUserDTO } from "@/contracts";
import { AuthSession } from "./types";
import { authRepo } from "./repo";
import { config } from "@/lib/config";
import { UnauthorizedError, ValidationError } from "@/lib/errors";

const MOCK_ADMIN_USER: SessionUserDTO = {
  id: "usr_mock_admin",
  email: "admin@loopos.local",
  name: "Admin Operator",
  role: "admin",
  customerId: null,
};

const MOCK_CUSTOMER_USER: SessionUserDTO = {
  id: "usr_mock_customer",
  email: "billing@acmecorp.com",
  name: "Alice Acme",
  role: "customer",
  customerId: "cust_acme_corp",
};

export class AuthService {
  async login(dto: LoginDTO): Promise<AuthSession> {
    if (config.isMockApi) {
      const user = dto.email.includes("admin") ? MOCK_ADMIN_USER : MOCK_CUSTOMER_USER;
      return {
        token: `mock_jwt_token_${user.id}`,
        user,
      };
    }

    const user = await authRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    // Dev B: Replace with bcrypt.compare when real auth is hooked up
    return {
      token: `jwt_token_${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: (user.role.toLowerCase() as any),
        customerId: user.customerId,
      },
    };
  }

  async signup(dto: SignupDTO): Promise<AuthSession> {
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

    const existing = await authRepo.findByEmail(dto.email);
    if (existing) {
      throw new ValidationError("An account with this email already exists.");
    }

    // Dev B: Hash password with bcrypt
    const created = await authRepo.createUser({
      email: dto.email,
      name: dto.name,
      passwordHash: `hash_${dto.password}`,
      role: "CUSTOMER",
    });

    return {
      token: `jwt_token_${created.id}`,
      user: {
        id: created.id,
        email: created.email,
        name: created.name,
        role: (created.role.toLowerCase() as any),
        customerId: created.customerId,
      },
    };
  }

  async requestPasswordReset(dto: ResetPasswordRequestDTO): Promise<{ message: string }> {
    if (config.isMockApi) {
      return { message: "Mock password reset link sent to " + dto.email };
    }
    // Dev B: generate crypto token and email via mailpit
    return { message: "If an account exists, a reset link has been dispatched." };
  }

  async confirmPasswordReset(dto: ResetPasswordConfirmDTO): Promise<{ success: boolean }> {
    if (config.isMockApi) {
      return { success: true };
    }
    // Dev B: verify token and update password in repo
    return { success: true };
  }
}

export const authService = new AuthService();
