import { z } from "zod";

export const StaffMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  role: z.literal("STAFF"),
  active: z.boolean().default(true),
  department: z.string().optional(),
  createdAt: z.string().optional(),
});
export type StaffMemberDTO = z.infer<typeof StaffMemberSchema>;

export const CreateStaffMemberSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  department: z.string().optional(),
});
export type CreateStaffMemberDTO = z.infer<typeof CreateStaffMemberSchema>;

export const UpdateStaffMemberSchema = z.object({
  active: z.boolean().optional(),
  department: z.string().optional(),
  name: z.string().min(2).optional(),
});
export type UpdateStaffMemberDTO = z.infer<typeof UpdateStaffMemberSchema>;
