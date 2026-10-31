import { z } from "zod";
import { BillingPeriodValues } from "./enums";

export const PlanSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  price: z.number().int(), // Minor units (paise)
  period: z.enum(BillingPeriodValues),
  minQuantity: z.number().int().min(1).default(1),
  availableFrom: z.string().nullable().optional(),
  availableTo: z.string().nullable().optional(),
  autoClose: z.boolean().default(false),
  closable: z.boolean().default(true),
  pausable: z.boolean().default(true),
  renewable: z.boolean().default(true),
  active: z.boolean().default(true),
  createdAt: z.string().optional(),
});
export type Plan = z.infer<typeof PlanSchema>;

export const CreatePlanSchema = PlanSchema.omit({ id: true, createdAt: true });
export type CreatePlan = z.infer<typeof CreatePlanSchema>;

export const UpdatePlanSchema = CreatePlanSchema.partial();
export type UpdatePlan = z.infer<typeof UpdatePlanSchema>;
