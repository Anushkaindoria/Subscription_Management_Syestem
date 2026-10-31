import { z } from "zod";

export const BillingPreviewRequestSchema = z.object({
  asOfDate: z.string().optional(),
  subscriptionIds: z.array(z.string()).optional(),
});
export type BillingPreviewRequest = z.infer<typeof BillingPreviewRequestSchema>;

export const BillingPreviewResultSchema = z.object({
  asOfDate: stringOrToday(),
  dueSubscriptionsCount: z.number().int(),
  projectedRevenueMinor: z.number().int(),
  items: z.array(
    z.object({
      subscriptionId: z.string(),
      customerName: z.string(),
      periodStart: z.string(),
      periodEnd: z.string(),
      amountMinor: z.number().int(),
    }),
  ),
});
export type BillingPreviewResult = z.infer<typeof BillingPreviewResultSchema>;

function stringOrToday() {
  return z.string().default(() => new Date().toISOString());
}

export const BillingRunRequestSchema = z.object({
  asOfDate: z.string().optional(),
  dryRun: z.boolean().default(false),
});
export type BillingRunRequest = z.infer<typeof BillingRunRequestSchema>;

export const BillingRunRecordSchema = z.object({
  id: z.string(),
  asOfDate: z.string(),
  dryRun: z.boolean(),
  subscriptionsEvaluated: z.number().int(),
  invoicesGenerated: z.number().int(),
  invoicesSkipped: z.number().int(),
  failedCount: z.number().int().default(0),
  totalBilledMinor: z.number().int(),
  executedAt: z.string(),
  status: z.enum(["COMPLETED", "FAILED", "PARTIAL"]),
});
export type BillingRunRecord = z.infer<typeof BillingRunRecordSchema>;
