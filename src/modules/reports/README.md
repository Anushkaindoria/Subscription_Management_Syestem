# Reports Module (`src/modules/reports`)

**OWNER**: Dev A (`@devA`)  
**Domain**: Executive Analytics, Revenue Projections & Financial Audit

## Responsibilities
- Aggregate key subscription metrics: Active Subscriptions, MRR, Overdue Invoices, Outstanding Receivables.
- Enforce strict query latency SLA: all queries must resolve in **< 2000ms** even when scanning 10,000+ subscription records.
- Provide time-series revenue trends (collected, projected, churn).

## Public API (`index.ts`)
Only import from this module via `@/modules/reports`.
- `reportService.getDashboardMetrics(): Promise<DashboardMetricsDTO>`
- `reportService.getRevenueReport(): Promise<RevenueReportDTO>`
- `reportService.getOutstandingReport(): Promise<OutstandingReportDTO>`

## TODOs for Dev A
1. [ ] Create database indices on `Subscription(status, nextBillingDate)` and `Invoice(status, dueDate)` to maintain sub-2s query latency at scale.
2. [ ] Test with `npm run db:seed:bulk` (10,000 subscriptions) and capture query execution plans (`EXPLAIN ANALYZE`).
