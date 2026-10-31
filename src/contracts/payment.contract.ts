import { z } from "zod";

export const PaymentMethodEnum = z.enum([
  "CREDIT_CARD",
  "BANK_TRANSFER",
  "CASH",
  "UPI",
]);
export type PaymentMethodType = z.infer<typeof PaymentMethodEnum>;

export const PaymentStatusEnum = z.enum([
  "PENDING",
  "SUCCEEDED",
  "FAILED",
  "REFUNDED",
]);
export type PaymentStatusType = z.infer<typeof PaymentStatusEnum>;

export const RecordPaymentSchema = z.object({
  invoiceId: z.string(),
  amount: z.number().int().positive("Payment amount must be positive integer minor units"),
  method: PaymentMethodEnum,
  transactionRef: z.string().optional(),
});
export type RecordPaymentDTO = z.infer<typeof RecordPaymentSchema>;

export const PaymentSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  customerId: z.string(),
  amount: z.number().int(),
  method: PaymentMethodEnum,
  status: PaymentStatusEnum,
  transactionRef: z.string().nullable().optional(),
  createdAt: z.string(),
});
export type PaymentDTO = z.infer<typeof PaymentSchema>;
