import { ReportSummary, RevenueTimeSeries, OverdueReportItem } from "@/contracts/report";

export const MOCK_REPORT_SUMMARY: ReportSummary = {
  activeSubscriptionsCount: 1284,
  monthlyRecurringRevenueMinor: 186400000, // ₹18,64,000.00
  totalOutstandingMinor: 61245000, // ₹6,12,450.00
  overdueInvoicesCount: 37,
  revenueTotalMinor: 245630000, // ₹24,56,300.00
  queryLatencyMs: 38,
};

export const MOCK_REVENUE_TIME_SERIES: RevenueTimeSeries[] = [
  { period: "2026-06", collectedMinor: 184000000, projectedMinor: 190000000, churnMinor: 4000000 },
  { period: "2026-07", collectedMinor: 198000000, projectedMinor: 205000000, churnMinor: 3500000 },
  { period: "2026-08", collectedMinor: 215000000, projectedMinor: 220000000, churnMinor: 3000000 },
  { period: "2026-09", collectedMinor: 231000000, projectedMinor: 235000000, churnMinor: 2800000 },
  { period: "2026-10", collectedMinor: 245630000, projectedMinor: 250000000, churnMinor: 2500000 },
];

export const MOCK_OVERDUE_INVOICES: OverdueReportItem[] = [
  {
    invoiceId: "inv_2026_0044",
    invoiceNumber: "INV-2026-0044",
    customerName: "Nova Logistics",
    amountMinor: 1972960,
    overdueDays: 12,
    dueDate: "2026-10-19T00:00:00.000Z",
  },
  {
    invoiceId: "inv_2026_0038",
    invoiceNumber: "INV-2026-0038",
    customerName: "Summit Global Tech",
    amountMinor: 2498000,
    overdueDays: 19,
    dueDate: "2026-10-12T00:00:00.000Z",
  },
];
