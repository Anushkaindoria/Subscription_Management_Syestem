import { z } from "zod";

export const DiscountTypeEnum = z.enum(["PERCENTAGE", "FIXED"]);
export type DiscountType = z.infer<typeof DiscountTypeEnum>;

export const DiscountSchema = z.object({
  id: z.string(),
  code: z.string(),
  description: z.string().nullable().optional(),
  type: DiscountTypeEnum,
  value: z.number().int(), // Basis points or fixed minor units
  maxUsageLimit: z.number().int().nullable().optional(),
  usageCount: z.number().int(),
  minOrderValue: z.number().int().nullable().optional(),
  validFrom: z.string().nullable().optional(),
  validUntil: z.string().nullable().optional(),
  active: z.boolean(),
});
export type DiscountDTO = z.infer<typeof DiscountSchema>;

export const ValidateDiscountSchema = z.object({
  code: z.string(),
  orderSubtotalMinor: z.number().int(),
  customerId: z.string().optional(),
});
export type ValidateDiscountDTO = z.infer<typeof ValidateDiscountSchema>;

export interface DiscountApplicationResultDTO {
  isValid: boolean;
  discountId?: string;
  discountAmountMinor: number;
  netAmountMinor: number;
  rejectionReason?: string;
}
