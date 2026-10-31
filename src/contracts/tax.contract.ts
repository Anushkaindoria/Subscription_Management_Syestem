import { z } from "zod";

export const TaxRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  rateBasisPoints: z.number().int(), // e.g. 1800 = 18.00%
  isGst: z.boolean(),
  cgstRateBasisPoints: z.number().int().nullable().optional(),
  sgstRateBasisPoints: z.number().int().nullable().optional(),
  igstRateBasisPoints: z.number().int().nullable().optional(),
  active: z.boolean(),
});
export type TaxRuleDTO = z.infer<typeof TaxRuleSchema>;

export const CalculateTaxSchema = z.object({
  taxableAmountMinor: z.number().int(),
  taxRuleId: z.string(),
  isInterState: z.boolean().default(false),
});
export type CalculateTaxDTO = z.infer<typeof CalculateTaxSchema>;

export interface TaxBreakdownDTO {
  taxRuleId: string;
  rateBasisPoints: number;
  cgstAmountMinor: number;
  sgstAmountMinor: number;
  igstAmountMinor: number;
  totalTaxAmountMinor: number;
}
