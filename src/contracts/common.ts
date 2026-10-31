import { z } from "zod";

export type Money = number; // Always integer minor units (paise / cents)

export interface ApiResponse<T> {
  data: T | null;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  } | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const IdParamSchema = z.object({
  id: z.string().min(1),
});
export type IdParam = z.infer<typeof IdParamSchema>;

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().refine((val) => [25, 50, 100].includes(val), {
    message: "pageSize must be 25, 50, or 100",
  }).default(25),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
  q: z.string().optional(),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
