import { z } from "zod";
import { PaymentMethodValues } from "./enums";

export const PaymentSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  invoiceNumber: z.string().optional(),
  customerId: z.string(),
  customerName: z.string().optional(),
  method: z.enum(PaymentMethodValues),
  amount: z.number().int().positive(), // Minor units
  paidOn: z.string(),
  note: z.string().nullable().optional(),
  status: z.enum(["PENDING", "SUCCEEDED", "FAILED"]).default("SUCCEEDED"),
  createdAt: z.string().optional(),
});
export type Payment = z.infer<typeof PaymentSchema>;

export const RecordPaymentSchema = z.object({
  invoiceId: z.string(),
  method: z.enum(PaymentMethodValues),
  amount: z.number().int().positive(),
  paidOn: z.string().default(() => new Date().toISOString().slice(0, 10)),
  note: z.string().optional(),
});
export type RecordPayment = z.infer<typeof RecordPaymentSchema>;
