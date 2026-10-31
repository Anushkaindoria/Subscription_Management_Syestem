import { z } from "zod";

export const AskQuerySchema = z.object({
  query: z.string().min(3, "Query must be at least 3 characters"),
});
export type AskQueryDTO = z.infer<typeof AskQuerySchema>;

export const FilterClauseSchema = z.object({
  field: z.string(),
  operator: z.enum(["eq", "neq", "gt", "lt", "contains", "in"]),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
});
export type FilterClause = z.infer<typeof FilterClauseSchema>;

export const AskQueryResultSchema = z.object({
  understoodAs: z.array(FilterClauseSchema),
  summary: z.string(),
  rows: z.array(z.record(z.unknown())),
  executionMs: z.number(),
});
export type AskQueryResultDTO = z.infer<typeof AskQueryResultSchema>;
