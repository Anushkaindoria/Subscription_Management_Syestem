"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { MOCK_SUBSCRIPTIONS, MOCK_INVOICES, MOCK_REPORT_SUMMARY } from "@/mocks";
import {
  Users,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Plus,
  Zap,
  ArrowRight,
  FastForward,
  Clock,
  Sparkles,
} from "lucide-react";

export function DashboardOverview() {
  const [clockDate, setClockDate] = useState("2026-10-31");
  const [fastForwarding, setFastForwarding] = useState(false);

  const handleFastForward = (days: number) => {
    setFastForwarding(true);
    setTimeout(() => {
      const current = new Date(clockDate);
      current.setDate(current.getDate() + days);
      setClockDate(current.toISOString().split("T")[0]);
      setFastForwarding(false);
    }, 400);
  };

  const subscriptionColumns = [
    {
      key: "number",
      header: "Agreement #",
      render: (sub: any) => (
        <Link
          href={`/admin/subscriptions/${sub.id}`}
          className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {sub.number}
        </Link>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      render: (sub: any) => (
        <span className="font-medium text-slate-900 dark:text-white">
          {sub.customerName}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (sub: any) => <StatusPill status={sub.status} />,
    },
    {
      key: "nextBillingDate",
      header: "Next Billing",
      render: (sub: any) => formatDate(sub.nextBillingDate),
    },
    {
      key: "amount",
      header: "Recurring Amount",
      align: "right" as const,
      render: (sub: any) => {
        const total = (sub.lines || []).reduce(
          (acc: number, l: any) => acc + (l.unitPrice || 0) * (l.quantity || 1),
          0
        );
        return <span className="font-semibold tabular-nums">{formatINR(total)}</span>;
      },
    },
  ];

  const invoiceColumns = [
    {
      key: "number",
      header: "Invoice #",
      render: (inv: any) => (
        <Link
          href={`/admin/invoices/${inv.id}`}
          className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {inv.number}
        </Link>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      render: (inv: any) => (
        <span className="font-medium text-slate-900 dark:text-white">
          {inv.customerName}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (inv: any) => <StatusPill status={inv.status} />,
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (inv: any) => formatDate(inv.dueDate),
    },
    {
      key: "totalAmount",
      header: "Total (inc. GST)",
      align: "right" as const,
      render: (inv: any) => (
        <span className="font-semibold tabular-nums">{formatINR(inv.totalAmount)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner with Clock Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Executive Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time revenue performance, automated recurring billing, and dunning ledger.
          </p>
        </div>

        {/* Time-Travel Simulator Box */}
        <div className="flex items-center gap-2 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 p-2 rounded-[10px]">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Clock className="w-3.5 h-3.5" />
            <span>Simulated Date:</span>
            <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
              {clockDate}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleFastForward(1)}
              disabled={fastForwarding}
              className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition flex items-center gap-1"
              title="Fast forward simulated time by 1 day"
            >
              <FastForward className="w-3 h-3" /> +1d
            </button>
            <button
              onClick={() => handleFastForward(7)}
              disabled={fastForwarding}
              className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition"
              title="Fast forward simulated time by 7 days"
            >
              +7d
            </button>
            <button
              onClick={() => handleFastForward(30)}
              disabled={fastForwarding}
              className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition"
              title="Fast forward simulated time by 30 days"
            >
              +30d
            </button>
          </div>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Active Subscriptions"
          value={MOCK_REPORT_SUMMARY.activeSubscriptionsCount.toLocaleString("en-IN")}
          trend={{ value: "+12.4% MoM", isPositive: true }}
          icon={<Users className="w-4 h-4" />}
        />
        <KpiCard
          label="Total Revenue"
          value={formatINR(MOCK_REPORT_SUMMARY.revenueTotalMinor)}
          trend={{ value: "+8.2% vs target", isPositive: true }}
          icon={<IndianRupee className="w-4 h-4" />}
        />
        <KpiCard
          label="Outstanding"
          value={formatINR(MOCK_REPORT_SUMMARY.totalOutstandingMinor)}
          subtext="14 days DSO average"
          icon={<CreditCard className="w-4 h-4" />}
        />
        <KpiCard
          label="Overdue Invoices"
          value={MOCK_REPORT_SUMMARY.overdueInvoicesCount.toString()}
          trend={{ value: "Action Required", isPositive: false }}
          badge="High Priority"
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <KpiCard
          label="MRR Run-rate"
          value={formatINR(MOCK_REPORT_SUMMARY.monthlyRecurringRevenueMinor)}
          trend={{ value: "+14.2% ARR", isPositive: true }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      {/* Quick Operational Actions Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Quick Actions</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/billing">
            <Button variant="primary" size="sm" leftIcon={<Zap className="w-3.5 h-3.5" />}>
              Run Billing Batch
            </Button>
          </Link>
          <Link href="/admin/subscriptions">
            <Button variant="secondary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              New Subscription
            </Button>
          </Link>
          <Link href="/admin/payments">
            <Button variant="secondary" size="sm" leftIcon={<CreditCard className="w-3.5 h-3.5" />}>
              Record Payment
            </Button>
          </Link>
        </div>
      </div>

      {/* Tables Grid: Subscriptions & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Subscriptions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Active Agreements
            </h2>
            <Link
              href="/admin/subscriptions"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <DataTable
            columns={subscriptionColumns}
            data={MOCK_SUBSCRIPTIONS.slice(0, 4)}
            emptyTitle="No active subscriptions"
          />
        </div>

        {/* Recent Invoices */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Recent Invoices & Receivables
            </h2>
            <Link
              href="/admin/invoices"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <DataTable
            columns={invoiceColumns}
            data={MOCK_INVOICES}
            emptyTitle="No recent invoices"
          />
        </div>
      </div>
    </div>
  );
}
