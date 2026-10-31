import { z } from "zod";

export const ReportSummarySchema = z.object({
  activeSubscriptionsCount: z.number().int(),
  monthlyRecurringRevenueMinor: z.number().int(),
  totalOutstandingMinor: z.number().int(),
  overdueInvoicesCount: z.number().int(),
  revenueTotalMinor: z.number().int(),
  queryLatencyMs: z.number(),
});
export type ReportSummary = z.infer<typeof ReportSummarySchema>;

export const RevenueTimeSeriesSchema = z.object({
  period: z.string(), // "2026-10"
  collectedMinor: z.number().int(),
  projectedMinor: z.number().int(),
  churnMinor: z.number().int(),
});
export type RevenueTimeSeries = z.infer<typeof RevenueTimeSeriesSchema>;

export const OverdueReportItemSchema = z.object({
  invoiceId: z.string(),
  invoiceNumber: z.string(),
  customerName: z.string(),
  amountMinor: z.number().int(),
  overdueDays: z.number().int(),
  dueDate: z.string(),
});
export type OverdueReportItem = z.infer<typeof OverdueReportItemSchema>;
