import { z } from "zod";

export const TaxRuleSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  code: z.string(),
  rateBasisPoints: z.number().int(), // e.g. 1800 for 18%
  isGst: z.boolean().default(true),
  cgstRateBasisPoints: z.number().int().nullable().optional(),
  sgstRateBasisPoints: z.number().int().nullable().optional(),
  igstRateBasisPoints: z.number().int().nullable().optional(),
  active: z.boolean().default(true),
  createdAt: z.string().optional(),
});
export type TaxRule = z.infer<typeof TaxRuleSchema>;

export const CreateTaxRuleSchema = TaxRuleSchema.omit({ id: true, createdAt: true });
export type CreateTaxRule = z.infer<typeof CreateTaxRuleSchema>;

export const UpdateTaxRuleSchema = CreateTaxRuleSchema.partial();
export type UpdateTaxRule = z.infer<typeof UpdateTaxRuleSchema>;
