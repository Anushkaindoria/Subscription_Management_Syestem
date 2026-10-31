import { z } from "zod";

export const InvoiceStatusEnum = z.enum([
  "DRAFT",
  "CONFIRMED",
  "PAID",
  "OVERDUE",
  "VOID",
]);
export type InvoiceStatusType = z.infer<typeof InvoiceStatusEnum>;

export const InvoiceLineSchema = z.object({
  id: z.string().optional(),
  description: z.string(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().int(), // Minor units
  taxAmount: z.number().int(),
  discountAmount: z.number().int(),
  totalAmount: z.number().int(),
});
export type InvoiceLineDTO = z.infer<typeof InvoiceLineSchema>;

export const InvoiceSchema = z.object({
  id: z.string(),
  subscriptionId: z.string(),
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),
  invoiceNumber: z.string(),
  status: InvoiceStatusEnum,
  periodStart: z.string(), // ISO date
  periodEnd: z.string(), // ISO date
  subtotal: z.number().int(),
  taxAmount: z.number().int(),
  discountAmount: z.number().int(),
  totalAmount: z.number().int(),
  paidAmount: z.number().int(),
  dueDate: z.string(),
  paidAt: z.string().nullable().optional(),
  pdfUrl: z.string().nullable().optional(),
  createdAt: z.string(),
  lines: z.array(InvoiceLineSchema).optional(),
});
export type InvoiceDTO = z.infer<typeof InvoiceSchema>;

export const CreateInvoiceSchema = z.object({
  subscriptionId: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  dueDate: z.string(),
  lines: z.array(InvoiceLineSchema).min(1),
});
export type CreateInvoiceDTO = z.infer<typeof CreateInvoiceSchema>;

export interface InvoicePdfDataDTO {
  invoice: InvoiceDTO;
  companyInfo: {
    name: string;
    address: string;
    taxId: string;
    supportEmail: string;
  };
  paymentInstructions: {
    bankName: string;
    accountNumber: string;
    ifscSwift: string;
  };
}
