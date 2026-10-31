import { z } from "zod";

export const TemplateLineSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  productName: z.string().optional(),
  planId: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
  discountPercent: z.number().int().min(0).max(100).default(0),
});
export type TemplateLine = z.infer<typeof TemplateLineSchema>;

export const QuotationTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  description: z.string().nullable().optional(),
  durationMonths: z.number().int().default(12),
  active: z.boolean().default(true),
  lines: z.array(TemplateLineSchema).default([]),
});
export type QuotationTemplate = z.infer<typeof QuotationTemplateSchema>;

export const CreateQuotationTemplateSchema = QuotationTemplateSchema.omit({ id: true });
export type CreateQuotationTemplate = z.infer<typeof CreateQuotationTemplateSchema>;

export const GenerateQuoteFromTemplateSchema = z.object({
  templateId: z.string(),
  customerId: z.string(),
  startDate: z.string(),
});
export type GenerateQuoteFromTemplate = z.infer<typeof GenerateQuoteFromTemplateSchema>;
