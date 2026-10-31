import { z } from "zod";
import { DiscountKindValues, DiscountAppliesToValues } from "./enums";

export const DiscountSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  kind: z.enum(DiscountKindValues),
  value: z.number().int().positive(), // Basis points (e.g. 1000 for 10%) or Minor units (paise)
  appliesTo: z.enum(DiscountAppliesToValues).default("subscription"),
  productIds: z.array(z.string()).default([]),
  minPurchase: z.number().int().default(0), // Minor units
  minQuantity: z.number().int().default(1),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  usageLimit: z.number().int().nullable().optional(),
  usedCount: z.number().int().default(0),
  active: z.boolean().default(true),
  createdAt: z.string().optional(),
});
export type Discount = z.infer<typeof DiscountSchema>;

export const CreateDiscountSchema = DiscountSchema.omit({ id: true, usedCount: true, createdAt: true });
export type CreateDiscount = z.infer<typeof CreateDiscountSchema>;

export const UpdateDiscountSchema = CreateDiscountSchema.partial();
export type UpdateDiscount = z.infer<typeof UpdateDiscountSchema>;
