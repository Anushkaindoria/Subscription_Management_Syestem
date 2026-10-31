"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/format";
import { KpiCard } from "@/components/ui/KpiCard";
import { MOCK_REPORT_SUMMARY } from "@/mocks";
import { BarChart3, TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react";

export function ReportsAnalytics() {
  const agingReceivables = [
    { bucket: "Current (Within Term)", amount: 384000, count: 28, pct: 62 },
    { bucket: "1 - 15 Days Overdue", amount: 142000, count: 8, pct: 23 },
    { bucket: "16 - 30 Days Overdue", amount: 62450, count: 3, pct: 10 },
    { bucket: "30+ Days Overdue", amount: 24000, count: 1, pct: 5 },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Financial Analytics & Revenue Operations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Forensic reporting on recurring run-rates, GST tax liability, and collection aging.
        </p>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Revenue"
          value={formatINR(MOCK_REPORT_SUMMARY.revenueTotalMinor)}
          trend={{ value: "+8.2% vs target", isPositive: true }}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <KpiCard
          label="Monthly Run-Rate (MRR)"
          value={formatINR(MOCK_REPORT_SUMMARY.monthlyRecurringRevenueMinor)}
          trend={{ value: "+14.2% YoY", isPositive: true }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KpiCard
          label="Outstanding Receivables"
          value={formatINR(MOCK_REPORT_SUMMARY.totalOutstandingMinor)}
          subtext="14 days DSO average"
          icon={<Clock className="w-4 h-4" />}
        />
        <KpiCard
          label="Collection Efficiency"
          value="96.4%"
          trend={{ value: "Healthy", isPositive: true }}
          icon={<CheckCircle className="w-4 h-4" />}
        />
      </div>

      {/* Aging Receivables Breakdown Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Aging Receivables Ledger (DSO)
            </h3>
            <p className="text-xs text-slate-500">
              Outstanding balances bucketed by due date maturity.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 tabular-nums">
            Total: {formatINR(MOCK_REPORT_SUMMARY.totalOutstandingMinor)}
          </span>
        </div>

        <div className="space-y-4">
          {agingReceivables.map((bucket, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {bucket.bucket} ({bucket.count} invoices)
                </span>
                <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                  {formatINR(bucket.amount)} ({bucket.pct}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    i === 0
                      ? "bg-indigo-600"
                      : i === 1
                      ? "bg-amber-500"
                      : i === 2
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${bucket.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
