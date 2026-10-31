import { z } from "zod";

export const RoleEnum = z.enum(["ADMIN", "STAFF", "CUSTOMER"]);
export type RoleType = z.infer<typeof RoleEnum>;

export type Permission =
  | "catalog:read"
  | "catalog:write"
  | "subscriptions:read"
  | "subscriptions:write"
  | "billing:execute"
  | "invoices:read"
  | "invoices:write"
  | "payments:record"
  | "reports:view";

export interface RbacContext {
  userId: string;
  role: RoleType;
  customerId?: string | null;
}
