import { z } from "zod";

export const ReportDateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
export type ReportDateRangeDTO = z.infer<typeof ReportDateRangeSchema>;

export interface DashboardMetricsDTO {
  activeSubscriptionsCount: number;
  monthlyRecurringRevenueMinor: number;
  totalOutstandingMinor: number;
  overdueInvoicesCount: number;
  paidThisMonthMinor: number;
  benchmarkQueryDurationMs: number;
}

export interface RevenueBreakdownItemDTO {
  month: string; // "YYYY-MM"
  collectedRevenueMinor: number;
  projectedRevenueMinor: number;
  churnMinor: number;
}

export interface RevenueReportDTO {
  metrics: DashboardMetricsDTO;
  monthlyBreakdown: RevenueBreakdownItemDTO[];
}

export interface OverdueInvoiceSummaryDTO {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  amountMinor: number;
  daysOverdue: number;
  dueDate: string;
}

export interface OutstandingReportDTO {
  totalOutstandingMinor: number;
  items: OverdueInvoiceSummaryDTO[];
}
