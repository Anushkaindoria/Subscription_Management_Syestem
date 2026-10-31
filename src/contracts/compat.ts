import { z } from "zod";
import {
  Role,
  RoleEnum,
  SubscriptionStatus,
  SubscriptionStatusEnum,
  PaymentMethod,
  PaymentMethodEnum,
  InvoiceStatus,
  InvoiceStatusEnum,
  BillingPeriod,
  BillingPeriodEnum,
} from "./enums";
import { Invoice, InvoiceLine, InvoiceSchema, InvoiceLineSchema } from "./invoice";
import { Payment, PaymentSchema } from "./payment";
import { Subscription, SubscriptionLineItem, SubscriptionSchema, SubscriptionLineItemSchema, SubscriptionTransition, SubscriptionTransitionSchema } from "./subscription";
import { TaxRule, TaxRuleSchema } from "./tax";
import { Product } from "./product";
import { Plan } from "./plan";
import { QuotationTemplate } from "./template";
import { Discount } from "./discount";
import {
  PasswordRuleSchema,
  LoginRequestSchema,
  SignupRequestSchema,
  ResetPasswordRequestSchema,
  LoginRequest,
  SignupRequest,
  ResetPasswordRequest,
  ForgotPasswordRequest,
  SessionUser,
} from "./auth";
import { BillingRunRequest } from "./billing";

// Auth aliases
export const PasswordPolicySchema = PasswordRuleSchema;
export const LoginSchema = LoginRequestSchema;
export const SignupSchema = SignupRequestSchema;
export const ResetPasswordConfirmSchema = ResetPasswordRequestSchema;
export type LoginDTO = LoginRequest;
export type SignupDTO = SignupRequest;
export type ResetPasswordRequestDTO = ForgotPasswordRequest;
export type ResetPasswordConfirmDTO = ResetPasswordRequest;
export type SessionUserDTO = SessionUser;

// Billing aliases
export type BillingRunRequestDTO = BillingRunRequest;
export type BillingRunResultDTO = any;

// Catalog aliases
export const BillingIntervalEnum = BillingPeriodEnum;
export type BillingIntervalType = BillingPeriod;
export const VariantSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  priceExtraMinor: z.number().optional(),
});
export type VariantDTO = any;
export type ProductDTO = any;
export type PlanDTO = any;
export type QuotationTemplateDTO = any;

// Discount aliases
export const DiscountTypeEnum = z.enum(["PERCENTAGE", "FIXED"]);
export type DiscountType = "PERCENTAGE" | "FIXED";
export type DiscountDTO = any;
export const ValidateDiscountSchema = z.object({
  code: z.string(),
  purchaseAmountMinor: z.number().optional(),
});
export type ValidateDiscountDTO = any;
export type DiscountApplicationResultDTO = any;

// Invoice aliases
export type InvoiceStatusType = InvoiceStatus | string;
export type InvoiceLineDTO = any;
export type InvoiceDTO = any;
export const CreateInvoiceSchema = InvoiceSchema;
export type CreateInvoiceDTO = any;
export type InvoicePdfDataDTO = {
  invoice: any;
  qrCode?: string;
  companyInfo?: any;
  paymentInstructions?: any;
  [key: string]: any;
};

// Payment aliases
export type PaymentMethodType = PaymentMethod | string;
export const PaymentStatusEnum = z.enum(["pending", "completed", "failed"]);
export type PaymentStatusType = "pending" | "completed" | "failed";
export type RecordPaymentDTO = any;
export type PaymentDTO = any;

// RBAC aliases
export type RoleType = Role | "ADMIN" | "STAFF" | "CUSTOMER";
export type Permission = string;
export type RbacContext = { role: RoleType; userId: string; customerId?: string };

// Report aliases
export const ReportDateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
export type ReportDateRangeDTO = z.infer<typeof ReportDateRangeSchema>;
export type DashboardMetricsDTO = any;
export type RevenueReportDTO = any;
export type OutstandingReportDTO = any;
export type RevenueBreakdownItemDTO = any;
export type OverdueInvoiceSummaryDTO = any;

// Subscription aliases
export type SubscriptionStatusType = SubscriptionStatus | string;
export const SubscriptionLineSchema = SubscriptionLineItemSchema;
export type SubscriptionLineDTO = any;
export type SubscriptionDTO = any;
export type CreateSubscriptionDTO = any;
export const TransitionSubscriptionStatusSchema = SubscriptionTransitionSchema;
export type TransitionSubscriptionStatusDTO = SubscriptionTransition;

// Tax aliases
export type TaxRuleDTO = any;
export const CalculateTaxSchema = z.object({
  amount: z.number().optional(),
  taxableAmountMinor: z.number().optional(),
  taxRuleId: z.string().optional(),
  isInterState: z.boolean().optional(),
  state: z.string().optional(),
});
export type CalculateTaxDTO = {
  amount?: number;
  taxableAmountMinor?: number;
  taxRuleId?: string;
  isInterState?: boolean;
  state?: string;
  [key: string]: any;
};
export type TaxBreakdownDTO = {
  taxRuleId?: string;
  rateBasisPoints?: number;
  cgstAmountMinor?: number;
  sgstAmountMinor?: number;
  igstAmountMinor?: number;
  totalTaxAmountMinor?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  totalTax?: number;
  [key: string]: any;
};
