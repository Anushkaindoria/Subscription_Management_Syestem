import { z } from "zod";
export {
  PasswordPolicySchema,
  LoginSchema,
  SignupSchema,
  ResetPasswordRequestSchema,
  ResetPasswordConfirmSchema,
} from "@/contracts";

export const AuthTokenPayloadSchema = z.object({
  sub: z.string(),
  email: z.string(),
  role: z.enum(["ADMIN", "STAFF", "CUSTOMER"]),
  customerId: z.string().nullable().optional(),
});
export type AuthTokenPayload = z.infer<typeof AuthTokenPayloadSchema>;
