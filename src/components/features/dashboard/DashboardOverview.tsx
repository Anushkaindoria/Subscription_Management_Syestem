"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { MOCK_SUBSCRIPTIONS, MOCK_INVOICES } from "@/mocks";
import {
  RefreshCw,
  IndianRupee,
  Clock,
  AlertTriangle,
  TrendingUp,
  FastForward,
  Zap,
  ArrowRight,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
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
    }, 300);
  };

  const handleResetClock = () => {
    setClockDate("2026-10-31");
  };

  const subscriptionColumns = [
    {
      key: "number",
      header: "Agreement #",
      render: (sub: any) => (
        <Link
          href={`/admin/subscriptions/${sub.id}`}
          className="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1.5"
        >
          <span>{sub.number}</span>
          <ArrowUpRight className="size-3 text-slate-400" />
        </Link>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      render: (sub: any) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white block">
            {sub.customerName}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            {sub.paymentTerms || "Net 30"}
          </span>
        </div>
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
      render: (sub: any) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {formatDate(sub.nextBillingDate)}
        </span>
      ),
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
        return <span className="font-bold tabular-nums text-slate-900 dark:text-white">{formatINR(total)}</span>;
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
          className="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1.5"
        >
          <span>{inv.number}</span>
          <ArrowUpRight className="size-3 text-slate-400" />
        </Link>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      render: (inv: any) => (
        <span className="font-semibold text-slate-900 dark:text-white">
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
      render: (inv: any) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {formatDate(inv.dueDate)}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Total",
      align: "right" as const,
      render: (inv: any) => (
        <span className="font-bold tabular-nums text-slate-900 dark:text-white">
          {formatINR(inv.totalAmount)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header matching Stitch Screen 05-dashboard */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <span className="size-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Live snapshot of your recurring revenue, active agreements, and billing health
          </p>
        </div>

        {/* Time Travel Simulation Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 px-2.5 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="size-4 text-indigo-500" />
            <span className="font-medium">Clock:</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{clockDate}</span>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleFastForward(30)}
              disabled={fastForwarding}
              className="text-xs font-semibold h-8"
              leftIcon={<FastForward className="size-3.5" />}
            >
              +30d
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleFastForward(60)}
              disabled={fastForwarding}
              className="text-xs font-semibold h-8"
              leftIcon={<FastForward className="size-3.5" />}
            >
              +60d
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetClock}
              className="text-xs text-slate-500 h-8"
            >
              Reset
            </Button>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <Link href="/admin/billing">
            <Button
              variant="primary"
              size="sm"
              className="text-xs font-semibold h-8"
              leftIcon={<Zap className="size-3.5" />}
            >
              Run billing
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 1: FIVE KPI CARDS (Matching Stitch Screen Exact Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Active Subscriptions */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Active subscriptions
            </span>
            <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <RefreshCw className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              1,284
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="size-3" />
              +4.2%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            vs last month
          </div>
        </div>

        {/* KPI 2: Revenue This Month */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Revenue this month
            </span>
            <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              ₹24,56,300
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="size-3" />
              +12.8%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            vs monthly target
          </div>
        </div>

        {/* KPI 3: Outstanding */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Outstanding
            </span>
            <div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              ₹6,12,450
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <ArrowDownRight className="size-3" />
              -2.1%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            collection cycle active
          </div>
        </div>

        {/* KPI 4: Overdue Invoices */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Overdue invoices
            </span>
            <div className="size-8 rounded-lg bg-red-50 dark:bg-red-950/60 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-red-600 dark:text-red-400 tabular-nums">
              37
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400">
              +5 this wk
            </span>
          </div>
          <div className="mt-2 text-[11px] text-red-600/80 dark:text-red-400/80 font-medium">
            action required
          </div>
        </div>

        {/* KPI 5: MRR Run-rate */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              MRR Run-rate
            </span>
            <div className="size-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              ₹18,64,000
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="size-3" />
              +8.4%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            QoQ compounding
          </div>
        </div>
      </div>

      {/* Row 2: ANALYTICS ROW (Revenue vs Outstanding Bar Chart & Plan Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card (7 cols): Revenue vs Outstanding Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Revenue vs Outstanding
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Monthly billed vs pending cashflow (Apr – Nov 2026)
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <span className="size-2.5 rounded-full bg-indigo-600" />
                  Billed
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <span className="size-2.5 rounded-full bg-purple-500" />
                  Outstanding
                </span>
              </div>
            </div>

            {/* SVG Visual Chart */}
            <div className="w-full mt-6">
              <svg className="w-full h-56" fill="none" viewBox="0 0 620 220">
                {/* Horizontal Grid lines */}
                <line x1="30" y1="20" x2="600" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="30" y1="65" x2="600" y2="65" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="30" y1="110" x2="600" y2="110" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="30" y1="155" x2="600" y2="155" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="30" y1="190" x2="600" y2="190" stroke="#CBD5E1" strokeWidth="1" />

                {/* Y Axis Labels */}
                <text x="24" y="24" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="end">₹30L</text>
                <text x="24" y="69" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="end">₹20L</text>
                <text x="24" y="114" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="end">₹10L</text>
                <text x="24" y="159" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="end">₹5L</text>
                <text x="24" y="193" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="end">₹0</text>

                {/* Months Bar Pairs (Apr - Nov) */}
                {/* Apr */}
                <g className="cursor-pointer group">
                  <rect x="52" y="90" width="16" height="100" rx="3" fill="#4F46E5" className="hover:opacity-80 transition-opacity" />
                  <rect x="70" y="148" width="16" height="42" rx="3" fill="#8B5CF6" className="hover:opacity-80 transition-opacity" />
                  <text x="69" y="206" fill="#64748B" fontSize="11" textAnchor="middle">Apr</text>
                </g>
                {/* May */}
                <g className="cursor-pointer group">
                  <rect x="122" y="78" width="16" height="112" rx="3" fill="#4F46E5" className="hover:opacity-80 transition-opacity" />
                  <rect x="140" y="156" width="16" height="34" rx="3" fill="#8B5CF6" className="hover:opacity-80 transition-opacity" />
                  <text x="139" y="206" fill="#64748B" fontSize="11" textAnchor="middle">May</text>
                </g>
                {/* Jun */}
                <g className="cursor-pointer group">
                  <rect x="192" y="72" width="16" height="118" rx="3" fill="#4F46E5" className="hover:opacity-80 transition-opacity" />
                  <rect x="210" y="145" width="16" height="45" rx="3" fill="#8B5CF6" className="hover:opacity-80 transition-opacity" />
                  <text x="209" y="206" fill="#64748B" fontSize="11" textAnchor="middle">Jun</text>
                </g>
                {/* Jul */}
                <g className="cursor-pointer group">
                  <rect x="262" y="60" width="16" height="130" rx="3" fill="#4F46E5" className="hover:opacity-80 transition-opacity" />
                  <rect x="280" y="152" width="16" height="38" rx="3" fill="#8B5CF6" className="hover:opacity-80 transition-opacity" />
                  <text x="279" y="206" fill="#64748B" fontSize="11" textAnchor="middle">Jul</text>
                </g>
                {/* Aug */}
                <g className="cursor-pointer group">
                  <rect x="332" y="52" width="16" height="138" rx="3" fill="#4F46E5" className="hover:opacity-80 transition-opacity" />
                  <rect x="350" y="150" width="16" height="40" rx="3" fill="#8B5CF6" className="hover:opacity-80 transition-opacity" />
                  <text x="349" y="206" fill="#64748B" fontSize="11" textAnchor="middle">Aug</text>
                </g>
                {/* Sep */}
                <g className="cursor-pointer group">
                  <rect x="402" y="44" width="16" height="146" rx="3" fill="#4F46E5" className="hover:opacity-80 transition-opacity" />
                  <rect x="420" y="142" width="16" height="48" rx="3" fill="#8B5CF6" className="hover:opacity-80 transition-opacity" />
                  <text x="419" y="206" fill="#64748B" fontSize="11" textAnchor="middle">Sep</text>
                </g>
                {/* Oct */}
                <g className="cursor-pointer group">
                  <rect x="472" y="36" width="16" height="154" rx="3" fill="#4F46E5" className="hover:opacity-80 transition-opacity" />
                  <rect x="490" y="138" width="16" height="52" rx="3" fill="#8B5CF6" className="hover:opacity-80 transition-opacity" />
                  <text x="489" y="206" fill="#64748B" fontSize="11" textAnchor="middle">Oct</text>
                </g>
                {/* Nov (Current) */}
                <g className="cursor-pointer group">
                  <rect x="542" y="30" width="16" height="160" rx="3" fill="#312E81" className="hover:opacity-90 transition-opacity" />
                  <rect x="560" y="134" width="16" height="56" rx="3" fill="#7C3AED" className="hover:opacity-90 transition-opacity" />
                  <text x="559" y="206" fill="#312E81" fontSize="11" fontWeight="700" textAnchor="middle">Nov</text>
                  <circle cx="550" cy="30" r="3" fill="#16A34A" />
                </g>
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Billed Realization:</span>{" "}
              <span className="text-emerald-600 font-bold font-mono">80.1%</span> of generated dues collected
            </div>
            <Link href="/admin/reports" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center gap-1">
              <span>View full financial report</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Card (5 cols): Subscriptions by Plan Breakdown */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Subscriptions by Plan
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Portfolio distribution and recurring yield
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                1,284 Total
              </span>
            </div>

            {/* Plan Rows with Progress Bars */}
            <div className="space-y-4 mt-6">
              {/* Plan 1 */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  <span>Business Yearly</span>
                  <span className="font-mono font-bold">420 (32.7%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full w-[32.7%]" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹14,999/yr base</span>
                  <span className="font-mono">₹62.99L ARR</span>
                </div>
              </div>

              {/* Plan 2 */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  <span>Starter Monthly</span>
                  <span className="font-mono font-bold">512 (39.8%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[39.8%]" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹1,499/mo base</span>
                  <span className="font-mono">₹9.21L ARR</span>
                </div>
              </div>

              {/* Plan 3 */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  <span>Team Weekly</span>
                  <span className="font-mono font-bold">268 (20.9%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-violet-400 rounded-full w-[20.9%]" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹399/wk base</span>
                  <span className="font-mono">₹5.56L ARR</span>
                </div>
              </div>

              {/* Plan 4 */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  <span>Enterprise Custom</span>
                  <span className="font-mono font-bold">84 (6.6%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[6.6%]" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>Custom invoicing</span>
                  <span className="font-mono">₹38.40L ARR</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Contract Value</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">₹1.16 Cr / yr</span>
          </div>
        </div>
      </div>

      {/* Row 3: RECENT ACTIVITY / TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Subscriptions
              </h2>
            </div>
            <Link
              href="/admin/subscriptions"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <DataTable
            data={MOCK_SUBSCRIPTIONS.slice(0, 5)}
            columns={subscriptionColumns}
          />
        </div>

        {/* Recent Invoices */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-purple-600 dark:text-purple-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Invoices
              </h2>
            </div>
            <Link
              href="/admin/invoices"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <DataTable
            data={MOCK_INVOICES.slice(0, 5)}
            columns={invoiceColumns}
          />
        </div>
      </div>
    </div>
  );
}
