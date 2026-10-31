"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusPill } from "@/components/ui/StatusPill";
import { MOCK_PLANS } from "@/mocks";
import {
  Plus,
  Search,
  Calendar,
  Check,
  X,
  Edit,
  Download,
  Repeat,
  TrendingUp,
  PieChart,
  CheckCircle2,
  PauseCircle,
  XCircle,
  RefreshCw,
  Clock,
  ChevronRight,
  Copy,
} from "lucide-react";

export function PlansList() {
  const [plans] = useState(MOCK_PLANS);
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");

  const filtered = plans.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = periodFilter === "all" || p.period.toLowerCase() === periodFilter.toLowerCase();
    return matchesSearch && matchesPeriod;
  });

  const columns = [
    {
      key: "name",
      header: "Plan Details",
      render: (p: any) => {
        const sku = p.id.replace("plan_", "PLAN-").toUpperCase();
        return (
          <div className="flex flex-col min-w-[220px]">
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/plans/${p.id}`}
                className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                {p.name}
              </Link>
              <span className="px-1.5 py-0.5 rounded font-mono text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {sku}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Standard recurring subscription tier with GST billing.
            </span>
          </div>
        );
      },
    },
    {
      key: "price",
      header: "Recurring Rate",
      align: "right" as const,
      render: (p: any) => (
        <div className="text-right">
          <span className="font-bold tabular-nums text-slate-900 dark:text-white">
            {formatINR(p.price)}
          </span>
          <span className="text-xs text-slate-400 ml-1">/{p.period}</span>
        </div>
      ),
    },
    {
      key: "period",
      header: "Billing Period",
      render: (p: any) => {
        const color =
          p.period === "yearly"
            ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
            : p.period === "monthly"
            ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
            : "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300";
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${color}`}>
            {p.period}
          </span>
        );
      },
    },
    {
      key: "minQuantity",
      header: "Min Qty",
      align: "center" as const,
      render: (p: any) => (
        <span className="tabular-nums font-semibold text-xs text-slate-700 dark:text-slate-300">
          {p.minQuantity || 1} {p.minQuantity > 1 ? "seats" : "seat"}
        </span>
      ),
    },
    {
      key: "availability",
      header: "Availability Window",
      render: (p: any) => (
        <div className="flex flex-col text-xs text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {p.availableFrom || "01 Jan 2026"} – {p.availableTo || "Indefinite"}
          </span>
          <span className="text-[11px] text-slate-400">Standard open window</span>
        </div>
      ),
    },
    {
      key: "lifecycle",
      header: "Lifecycle Behaviors",
      render: (p: any) => (
        <div className="flex items-center gap-1.5 text-xs">
          {/* Pausable */}
          <div
            title={p.pausable ? "Pausable: Allowed (60d)" : "Pause: Disabled"}
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              p.pausable
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-40"
            }`}
          >
            <PauseCircle className="size-4" />
          </div>
          {/* Closable */}
          <div
            title={p.closable ? "Early close: Allowed" : "Early close: Locked"}
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              p.closable
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-40"
            }`}
          >
            <XCircle className="size-4" />
          </div>
          {/* Renewable */}
          <div
            title={p.renewable ? "Auto-renewable: Active" : "Non-renewable"}
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              p.renewable
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-40"
            }`}
          >
            <RefreshCw className="size-3.5" />
          </div>
          {/* Auto-close */}
          <div
            title={p.autoClose ? "Auto-close on expiry: Enabled" : "Auto-close: Off"}
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              p.autoClose
                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-40"
            }`}
          >
            <Clock className="size-4" />
          </div>
        </div>
      ),
    },
    {
      key: "subscribers",
      header: "Active Subscribers",
      render: (p: any) => {
        const count = p.id.includes("yearly") ? 412 : 680;
        const pct = p.id.includes("yearly") ? 32 : 53;
        return (
          <div className="flex flex-col gap-1 w-32">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {count} subs
              </span>
              <span className="text-slate-400 tabular-nums">{pct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  p.id.includes("yearly") ? "bg-purple-600" : "bg-indigo-600"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: () => <StatusPill status="active" />,
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (p: any) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/plans/${p.id}`}>
            <Button variant="ghost" size="sm" leftIcon={<Edit className="size-3.5" />}>
              Edit
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & CTAs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span>Catalog</span>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Plans</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Plans
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
              {plans.length} active · 6 total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Configure recurring billing cadences, commitment terms, trial policies, and packaging behaviors.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Download className="size-4" />}
            onClick={() => alert("Exporting plan catalog...")}
          >
            Export catalog
          </Button>
          <Link href="/admin/plans/new">
            <Button variant="primary" size="md" leftIcon={<Plus className="size-4" />}>
              New plan
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 KPI Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Active Subscriptions
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Repeat className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              1,284
            </span>
            <span className="text-xs text-slate-400">subs</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
              +12.4%
            </span>
            <span className="text-slate-400">vs last cycle</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Monthly Recurring Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              ₹18,64,000
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">₹24,56,300</span>
            <span>MTD realized</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Top Grossing Plan
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-bold text-slate-900 dark:text-white truncate">
              Business Yearly
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">412 subs</span>
            <span>•</span>
            <span>₹12,45,000 MTD</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Most Adopted Tier
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <PieChart className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-bold text-slate-900 dark:text-white truncate">
              Starter Monthly
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">680 subs</span>
            <span>•</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold">
              53% share
            </span>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search plans by title or cadence... ⌘K"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setPeriodFilter("all")}
              className={`px-3 py-1.5 rounded-md transition ${
                periodFilter === "all"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setPeriodFilter("monthly")}
              className={`px-3 py-1.5 rounded-md transition ${
                periodFilter === "monthly"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriodFilter("yearly")}
              className={`px-3 py-1.5 rounded-md transition ${
                periodFilter === "yearly"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Data Table Container */}
      <DataTable
        columns={columns}
        data={filtered}
        emptyTitle="No plans configured"
        emptyDescription="Create your first subscription tier to get started."
      />
    </div>
  );
}
