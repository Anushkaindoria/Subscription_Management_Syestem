import { z } from "zod";

export const AskRequestSchema = z.object({
  query: z.string().min(3),
});
export type AskRequest = z.infer<typeof AskRequestSchema>;

export const FilterSchema = z.object({
  field: z.string(),
  operator: z.enum(["eq", "neq", "gt", "lt", "contains", "in"]),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
});
export type Filter = z.infer<typeof FilterSchema>;

export const AskResponseSchema = z.object({
  understoodAs: z.array(FilterSchema),
  rows: z.array(z.record(z.unknown())),
  summary: z.string(),
});
export type AskResponse = z.infer<typeof AskResponseSchema>;
