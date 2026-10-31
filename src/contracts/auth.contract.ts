import { z } from "zod";

/**
 * Strict Password Policy:
 * - At least 9 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one special symbol (@$!%*?&#^~_-)
 */
export const PasswordPolicySchema = z
  .string()
  .min(9, "Password must be at least 9 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export const SignupSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: PasswordPolicySchema,
  companyName: z.string().optional(),
});

export type SignupDTO = z.infer<typeof SignupSchema>;

export const ResetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export type ResetPasswordRequestDTO = z.infer<typeof ResetPasswordRequestSchema>;

export const ResetPasswordConfirmSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: PasswordPolicySchema,
});

export type ResetPasswordConfirmDTO = z.infer<typeof ResetPasswordConfirmSchema>;

export interface SessionUserDTO {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  customerId?: string | null;
}
