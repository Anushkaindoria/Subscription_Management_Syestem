import { z } from "zod";
import { PaymentMethodValues } from "./enums";
import { SubscriptionSchema } from "./subscription";
import { InvoiceSchema } from "./invoice";

export const PortalSummarySchema = z.object({
  customerId: z.string(),
  customerName: z.string(),
  activeSubscriptionsCount: z.number().int(),
  totalMonthlySpendMinor: z.number().int(),
  outstandingInvoicesCount: z.number().int(),
  totalOutstandingMinor: z.number().int(),
  recentInvoices: z.array(InvoiceSchema).default([]),
  subscriptions: z.array(SubscriptionSchema).default([]),
});
export type PortalSummary = z.infer<typeof PortalSummarySchema>;

export const PortalTransitionActionValues = ["renew", "pause", "close"] as const;
export type PortalTransitionAction = (typeof PortalTransitionActionValues)[number];

export const PortalTransitionSchema = z.object({
  action: z.enum(PortalTransitionActionValues),
  reason: z.string().optional(),
});
export type PortalTransition = z.infer<typeof PortalTransitionSchema>;

export const PortalPayInvoiceSchema = z.object({
  method: z.enum(PaymentMethodValues),
  amount: z.number().int().positive(),
  note: z.string().optional(),
});
export type PortalPayInvoice = z.infer<typeof PortalPayInvoiceSchema>;
