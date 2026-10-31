import { z } from "zod";
import { InvoiceStatusValues, InvoiceLineTypeValues } from "./enums";

export const InvoiceLineTraceSchema = z.object({
  baseAmountMinor: z.number().int(),
  rateBps: z.number().int().optional(),
  formula: z.string(),
});
export type InvoiceLineTrace = z.infer<typeof InvoiceLineTraceSchema>;

export const InvoiceLineSchema = z.object({
  id: z.string().optional(),
  type: z.enum(InvoiceLineTypeValues),
  description: z.string(),
  quantity: z.number().int().default(1),
  unitPrice: z.number().int(),
  amountMinor: z.number().int(),
  trace: InvoiceLineTraceSchema.optional(),
});
export type InvoiceLine = z.infer<typeof InvoiceLineSchema>;

export const InvoiceSchema = z.object({
  id: z.string(),
  number: z.string(), // e.g. INV-2026-0042
  subscriptionId: z.string(),
  customerId: z.string(),
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),
  periodStart: z.string(),
  periodEnd: z.string(),
  status: z.enum(InvoiceStatusValues),
  dueDate: z.string(),
  subtotalMinor: z.number().int(),
  discountAmountMinor: z.number().int().default(0),
  taxAmountMinor: z.number().int().default(0),
  totalAmountMinor: z.number().int(),
  paidAmountMinor: z.number().int().default(0),
  balanceMinor: z.number().int(), // totalAmount - paidAmount
  lines: z.array(InvoiceLineSchema).default([]),
  createdAt: z.string().optional(),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

export const InvoiceCalculationTraceSchema = z.object({
  invoiceId: z.string(),
  invoiceNumber: z.string(),
  subtotalTrace: z.string(),
  discountTrace: z.string(),
  taxTrace: z.string(),
  grandTotalMinor: z.number().int(),
  lines: z.array(InvoiceLineSchema),
});
export type InvoiceCalculationTrace = z.infer<typeof InvoiceCalculationTraceSchema>;
