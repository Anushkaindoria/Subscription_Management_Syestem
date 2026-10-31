import { z } from "zod";
import { BillingIntervalEnum } from "./catalog.contract";

export const SubscriptionStatusEnum = z.enum([
  "DRAFT",
  "QUOTATION",
  "CONFIRMED",
  "ACTIVE",
  "CLOSED",
]);
export type SubscriptionStatusType = z.infer<typeof SubscriptionStatusEnum>;

export const SubscriptionLineSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  productName: z.string().optional(),
  variantId: z.string().nullable().optional(),
  variantName: z.string().nullable().optional(),
  planId: z.string().nullable().optional(),
  planName: z.string().nullable().optional(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().int(), // Minor units
  discountId: z.string().nullable().optional(),
});
export type SubscriptionLineDTO = z.infer<typeof SubscriptionLineSchema>;

export const SubscriptionSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerName: z.string().optional(),
  status: SubscriptionStatusEnum,
  startDate: z.string(), // ISO String
  endDate: z.string().nullable().optional(),
  nextBillingDate: z.string().nullable().optional(),
  renewalInterval: BillingIntervalEnum,
  autoRenew: z.boolean(),
  cancelledAt: z.string().nullable().optional(),
  lines: z.array(SubscriptionLineSchema),
  totalRecurringMinor: z.number().int().optional(),
});
export type SubscriptionDTO = z.infer<typeof SubscriptionSchema>;

export const CreateSubscriptionSchema = z.object({
  customerId: z.string(),
  startDate: z.string(),
  renewalInterval: BillingIntervalEnum.default("MONTHLY"),
  autoRenew: z.boolean().default(true),
  lines: z.array(SubscriptionLineSchema).min(1, "At least one subscription item is required"),
});
export type CreateSubscriptionDTO = z.infer<typeof CreateSubscriptionSchema>;

export const TransitionSubscriptionStatusSchema = z.object({
  targetStatus: SubscriptionStatusEnum,
  reason: z.string().optional(),
});
export type TransitionSubscriptionStatusDTO = z.infer<typeof TransitionSubscriptionStatusSchema>;
