import { z } from "zod";

export const SystemSettingsSchema = z.object({
  companyName: z.string().min(2),
  companyAddress: z.string(),
  gstinTaxId: z.string(),
  currency: z.string().default("INR"),
  invoicePrefix: z.string().default("INV-"),
  subscriptionPrefix: z.string().default("SUB-"),
  defaultPaymentTermsDays: z.number().int().default(15),
  reminderScheduleDays: z.array(z.number().int()).default([7, 3, 1]), // Days before/after due
  supportEmail: z.string().email(),
});
export type SystemSettingsDTO = z.infer<typeof SystemSettingsSchema>;

export const UpdateSystemSettingsSchema = SystemSettingsSchema.partial();
export type UpdateSystemSettingsDTO = z.infer<typeof UpdateSystemSettingsSchema>;
