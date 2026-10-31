import { z } from "zod";

export const BillingIntervalEnum = z.enum(["MONTHLY", "QUARTERLY", "ANNUALLY"]);
export type BillingIntervalType = z.infer<typeof BillingIntervalEnum>;

export const VariantSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  sku: z.string(),
  priceExtra: z.number().int(), // Minor units
  active: z.boolean(),
});
export type VariantDTO = z.infer<typeof VariantSchema>;

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullable().optional(),
  active: z.boolean(),
  variants: z.array(VariantSchema).optional(),
});
export type ProductDTO = z.infer<typeof ProductSchema>;

export const PlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  interval: BillingIntervalEnum,
  intervalCount: z.number().int().min(1),
  basePrice: z.number().int(), // Minor units
  active: z.boolean(),
});
export type PlanDTO = z.infer<typeof PlanSchema>;

export const QuotationTemplateLineSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  variantId: z.string().optional(),
  planId: z.string().optional(),
  quantity: z.number().int().min(1),
  discountPercent: z.number().int().min(0).max(100).default(0),
  sortOrder: z.number().int().default(0),
});
export type QuotationTemplateLineDTO = z.infer<typeof QuotationTemplateLineSchema>;

export const QuotationTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  durationMonths: z.number().int().nullable().optional(),
  active: z.boolean(),
  lines: z.array(QuotationTemplateLineSchema).optional(),
});
export type QuotationTemplateDTO = z.infer<typeof QuotationTemplateSchema>;
