import { z } from "zod";
import { SubscriptionStatusValues } from "./enums";

export const SubscriptionActionValues = [
  "send_quotation",
  "confirm",
  "activate",
  "pause",
  "resume",
  "renew",
  "close",
] as const;
export type SubscriptionAction = (typeof SubscriptionActionValues)[number];

export const SubscriptionLineItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  productName: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
  unitPrice: z.number().int(), // Minor units (paise)
  discountPercent: z.number().int().default(0),
});
export type SubscriptionLineItem = z.infer<typeof SubscriptionLineItemSchema>;

export const SubscriptionSchema = z.object({
  id: z.string(),
  number: z.string(), // e.g. SUB-2026-0001
  customerId: z.string(),
  customerName: z.string().optional(),
  planId: z.string(),
  planName: z.string().optional(),
  startDate: z.string(),
  expiryDate: z.string().nullable().optional(),
  paymentTerms: z.string().default("Immediate"),
  status: z.enum(SubscriptionStatusValues),
  nextBillingDate: z.string().nullable().optional(),
  lines: z.array(SubscriptionLineItemSchema).default([]),
  totalRecurringMinor: z.number().int().optional(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

export const CreateSubscriptionSchema = z.object({
  customerId: z.string(),
  planId: z.string(),
  startDate: z.string(),
  expiryDate: z.string().optional(),
  paymentTerms: z.string().default("Immediate"),
  lines: z.array(SubscriptionLineItemSchema).min(1),
});
export type CreateSubscription = z.infer<typeof CreateSubscriptionSchema>;

export const SubscriptionTransitionSchema = z.object({
  action: z.enum(SubscriptionActionValues),
  note: z.string().optional(),
});
export type SubscriptionTransition = z.infer<typeof SubscriptionTransitionSchema>;
