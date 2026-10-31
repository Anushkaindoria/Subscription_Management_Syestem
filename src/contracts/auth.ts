import { z } from "zod";
import { RoleValues } from "./enums";

export const PasswordRuleSchema = z
  .string()
  .min(9, "Password must be at least 9 characters long (length > 8)")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const SignupRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: PasswordRuleSchema,
  companyName: z.string().optional(),
});
export type SignupRequest = z.infer<typeof SignupRequestSchema>;

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1),
  newPassword: PasswordRuleSchema,
});
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

export const SessionUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(RoleValues),
  customerId: z.string().nullable().optional(),
});
export type SessionUser = z.infer<typeof SessionUserSchema>;

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: PasswordRuleSchema.optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
});
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
