import { z } from "zod";

/**
 * Shared Contracts: Single Source of Truth for Enums
 *
 * CRITICAL RULE: Prisma enums, API routes, and UI status pills must align strictly
 * with these definitions.
 */

export const RoleValues = ["admin", "staff", "customer"] as const;
export type Role = (typeof RoleValues)[number];
export const RoleEnum = z.enum(RoleValues);

export const SubscriptionStatusValues = [
  "draft",
  "quotation",
  "confirmed",
  "active",
  "closed",
] as const;
export type SubscriptionStatus = (typeof SubscriptionStatusValues)[number];
export const SubscriptionStatusEnum = z.enum(SubscriptionStatusValues);

/**
 * Invoice Status:
 * Note: "overdue" is a UI-derived state computed from (dueDate < today && balance > 0).
 * It is NOT stored in the database.
 */
export const InvoiceStatusValues = [
  "draft",
  "confirmed",
  "paid",
  "cancelled",
] as const;
export type InvoiceStatus = (typeof InvoiceStatusValues)[number];
export const InvoiceStatusEnum = z.enum(InvoiceStatusValues);

export const PaymentMethodValues = [
  "bank_transfer",
  "upi",
  "card",
  "cash",
  "cheque",
] as const;
export type PaymentMethod = (typeof PaymentMethodValues)[number];
export const PaymentMethodEnum = z.enum(PaymentMethodValues);

export const BillingPeriodValues = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
] as const;
export type BillingPeriod = (typeof BillingPeriodValues)[number];
export const BillingPeriodEnum = z.enum(BillingPeriodValues);

export const DiscountKindValues = ["percentage", "fixed"] as const;
export type DiscountKind = (typeof DiscountKindValues)[number];
export const DiscountKindEnum = z.enum(DiscountKindValues);

export const DiscountAppliesToValues = ["products", "subscription"] as const;
export type DiscountAppliesTo = (typeof DiscountAppliesToValues)[number];
export const DiscountAppliesToEnum = z.enum(DiscountAppliesToValues);

export const InvoiceLineTypeValues = ["charge", "discount", "tax"] as const;
export type InvoiceLineType = (typeof InvoiceLineTypeValues)[number];
export const InvoiceLineTypeEnum = z.enum(InvoiceLineTypeValues);
