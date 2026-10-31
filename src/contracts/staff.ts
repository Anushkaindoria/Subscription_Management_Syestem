import { z } from "zod";

export const StaffSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.literal("staff"),
  active: z.boolean().default(true),
  department: z.string().optional(),
  createdAt: z.string().optional(),
});
export type Staff = z.infer<typeof StaffSchema>;

export const CreateStaffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  department: z.string().optional(),
});
export type CreateStaff = z.infer<typeof CreateStaffSchema>;

export const UpdateStaffSchema = z.object({
  name: z.string().min(2).optional(),
  active: z.boolean().optional(),
  department: z.string().optional(),
});
export type UpdateStaff = z.infer<typeof UpdateStaffSchema>;
