import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  taxId: z.string().nullable().optional(), // GSTIN e.g. 07AABCA1234F1Z5
  createdAt: z.string().optional(),
});
export type Customer = z.infer<typeof CustomerSchema>;

export const CreateCustomerSchema = CustomerSchema.omit({ id: true, createdAt: true });
export type CreateCustomer = z.infer<typeof CreateCustomerSchema>;

export const UpdateCustomerSchema = CreateCustomerSchema.partial();
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>;
