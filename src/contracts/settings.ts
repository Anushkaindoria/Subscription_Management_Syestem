import { z } from "zod";

export const SettingsSchema = z.object({
  companyName: z.string().min(2),
  companyAddress: z.string(),
  gstinTaxId: z.string(),
  currency: z.string().default("INR"),
  invoicePrefix: z.string().default("INV-2026-"),
  subscriptionPrefix: z.string().default("SUB-2026-"),
  defaultPaymentTermsDays: z.number().int().default(15),
  reminderScheduleDays: z.array(z.number().int()).default([7, 3, 1]),
  supportEmail: z.string().email(),
});
export type Settings = z.infer<typeof SettingsSchema>;

export const UpdateSettingsSchema = SettingsSchema.partial();
export type UpdateSettings = z.infer<typeof UpdateSettingsSchema>;
