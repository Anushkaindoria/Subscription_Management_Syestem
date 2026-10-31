import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  phone: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  taxId: z.string().nullable().optional(), // GSTIN e.g. 07AABCA1234F1Z5
  createdAt: z.string().optional(),
});
export type CustomerDTO = z.infer<typeof CustomerSchema>;

export const CreateCustomerSchema = CustomerSchema.omit({ id: true, createdAt: true });
export type CreateCustomerDTO = z.infer<typeof CreateCustomerSchema>;

export const UpdateCustomerSchema = CreateCustomerSchema.partial();
export type UpdateCustomerDTO = z.infer<typeof UpdateCustomerSchema>;

export const PortalInviteSchema = z.object({
  customerId: z.string(),
  email: z.string().email(),
});
export type PortalInviteDTO = z.infer<typeof PortalInviteSchema>;
