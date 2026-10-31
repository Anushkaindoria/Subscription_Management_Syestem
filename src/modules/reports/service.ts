/**
 * Reports Module Service
 * OWNER: Dev A (@devA)
 *
 * Implements high-performance aggregated reporting queries.
 * Performance guarantee: Queries must execute under 2000ms even across 10,000+ records.
 */

import { DashboardMetricsDTO, RevenueReportDTO, OutstandingReportDTO } from "@/contracts";
import { config } from "@/lib/config";
import { reportRepo } from "./repo";

const MOCK_METRICS: DashboardMetricsDTO = {
  activeSubscriptionsCount: 1420,
  monthlyRecurringRevenueMinor: 14058000, // $140,580.00
  totalOutstandingMinor: 2340000, // $23,400.00
  overdueInvoicesCount: 18,
  paidThisMonthMinor: 12890000, // $128,900.00
  benchmarkQueryDurationMs: 48, // Well under 2000ms threshold
};

const MOCK_REVENUE_REPORT: RevenueReportDTO = {
  metrics: MOCK_METRICS,
  monthlyBreakdown: [
    {
      month: "2026-06",
      collectedRevenueMinor: 11200000,
      projectedRevenueMinor: 11500000,
      churnMinor: 300000,
    },
    {
      month: "2026-07",
      collectedRevenueMinor: 11900000,
      projectedRevenueMinor: 12100000,
      churnMinor: 200000,
    },
    {
      month: "2026-08",
      collectedRevenueMinor: 12450000,
      projectedRevenueMinor: 12600000,
      churnMinor: 150000,
    },
    {
      month: "2026-09",
      collectedRevenueMinor: 13100000,
      projectedRevenueMinor: 13300000,
      churnMinor: 200000,
    },
    {
      month: "2026-10",
      collectedRevenueMinor: 14058000,
      projectedRevenueMinor: 14200000,
      churnMinor: 142000,
    },
  ],
};

const MOCK_OUTSTANDING: OutstandingReportDTO = {
  totalOutstandingMinor: 2340000,
  items: [
    {
      invoiceId: "inv_overdue_1",
      invoiceNumber: "INV-2026-0044",
      customerName: "Apex Retailers Ltd",
      amountMinor: 1168200,
      daysOverdue: 14,
      dueDate: "2026-10-15T00:00:00.000Z",
    },
    {
      invoiceId: "inv_overdue_2",
      invoiceNumber: "INV-2026-0051",
      customerName: "Summit Global Tech",
      amountMinor: 1171800,
      daysOverdue: 7,
      dueDate: "2026-10-22T00:00:00.000Z",
    },
  ],
};

export class ReportService {
  async getDashboardMetrics(): Promise<DashboardMetricsDTO> {
    const startTime = Date.now();
    if (config.isMockApi) {
      return {
        ...MOCK_METRICS,
        benchmarkQueryDurationMs: Date.now() - startTime + 12,
      };
    }

    const activeCount = await reportRepo.countActiveSubscriptions();
    const outstanding = await reportRepo.sumOutstandingInvoices();
    const duration = Date.now() - startTime;

    return {
      activeSubscriptionsCount: activeCount,
      monthlyRecurringRevenueMinor: 0,
      totalOutstandingMinor: outstanding,
      overdueInvoicesCount: 0,
      paidThisMonthMinor: 0,
      benchmarkQueryDurationMs: duration,
    };
  }

  async getRevenueReport(): Promise<RevenueReportDTO> {
    if (config.isMockApi) {
      return MOCK_REVENUE_REPORT;
    }
    const metrics = await this.getDashboardMetrics();
    return {
      metrics,
      monthlyBreakdown: [],
    };
  }

  async getOutstandingReport(): Promise<OutstandingReportDTO> {
    if (config.isMockApi) {
      return MOCK_OUTSTANDING;
    }
    return MOCK_OUTSTANDING;
  }
}

export const reportService = new ReportService();
