import { z } from "zod";

export const BillingRunRequestSchema = z.object({
  asOfDate: z.string().optional(), // ISO date string, uses clock.now() if omitted
  dryRun: z.boolean().default(false),
  subscriptionIds: z.array(z.string()).optional(),
});
export type BillingRunRequestDTO = z.infer<typeof BillingRunRequestSchema>;

export interface BillingRunResultDTO {
  runId: string;
  asOfDate: string;
  isDryRun: boolean;
  subscriptionsEvaluated: number;
  invoicesGenerated: number;
  invoicesSkippedIdempotent: number;
  totalBilledMinor: number;
  generatedInvoiceIds: string[];
  executionTimeMs: number;
}
