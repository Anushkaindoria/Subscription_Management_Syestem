"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { MOCK_SUBSCRIPTIONS } from "@/mocks";
import {
  Plus,
  Search,
  Repeat,
  Calendar,
  Download,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Coins,
  RefreshCw,
  MoreVertical,
  Filter,
} from "lucide-react";

export function SubscriptionsList() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [filterExpiring, setFilterExpiring] = useState(false);

  const tabs = [
    { id: "all", label: "All", count: 1284 },
    { id: "active", label: "Active", count: 1085, dotColor: "bg-emerald-500" },
    { id: "confirmed", label: "Confirmed", count: 112, dotColor: "bg-amber-500" },
    { id: "quotation", label: "Quotation", count: 48, dotColor: "bg-blue-500" },
    { id: "draft", label: "Draft", count: 24, dotColor: "bg-slate-400" },
    { id: "closed", label: "Closed", count: 15, dotColor: "bg-slate-600" },
  ];

  const filtered = MOCK_SUBSCRIPTIONS.filter((sub) => {
    if (activeTab !== "all" && sub.status !== activeTab) return false;
    if (
      search &&
      !sub.number.toLowerCase().includes(search.toLowerCase()) &&
      !(sub.customerName || "").toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const columns = [
    {
      key: "number",
      header: "Agreement #",
      render: (sub: any) => (
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Repeat className="size-4" />
          </div>
          <div>
            <Link
              href={`/admin/subscriptions/${sub.id}`}
              className="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline block"
            >
              {sub.number}
            </Link>
            <span className="text-[10px] text-slate-400 font-mono">v2.4 Contract</span>
          </div>
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      render: (sub: any) => {
        const initials = (sub.customerName || "AC")
          .split(" ")
          .map((n: string) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return (
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block leading-tight">
                {sub.customerName}
              </span>
              <span className="text-[11px] text-slate-400 font-mono leading-tight">
                GSTIN: 07AABCA1234F1Z5
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "plan",
      header: "Plan",
      render: (sub: any) => (
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold">
          {sub.planName || "Business Yearly"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (sub: any) => <StatusPill status={sub.status} />,
    },
    {
      key: "period",
      header: "Contract Period",
      render: (sub: any) => (
        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
          <Calendar className="size-3.5 text-slate-400 shrink-0" />
          <span>{formatDate(sub.startDate)}</span>
          <span>→</span>
          <span className="flex items-center gap-1">
            {formatDate(sub.expiryDate)}
            <span title="Auto-renews">
              <RefreshCw className="size-3 text-emerald-500" />
            </span>
          </span>
        </div>
      ),
    },
    {
      key: "nextBillingDate",
      header: "Next Invoice",
      render: (sub: any) => (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {formatDate(sub.nextBillingDate)}
        </span>
      ),
    },
    {
      key: "total",
      header: "Recurring Value",
      align: "right" as const,
      render: (sub: any) => {
        const total = (sub.lines || []).reduce(
          (acc: number, l: any) => acc + (l.unitPrice || 0) * (l.quantity || 1),
          0
        );
        return (
          <div className="text-right">
            <span className="font-bold tabular-nums text-slate-900 dark:text-white block">
              {formatINR(total)}
            </span>
            <span className="text-[10px] text-slate-400">/ annual billing</span>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (sub: any) => (
        <Link
          href={`/admin/subscriptions/${sub.id}`}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center justify-center transition-colors"
          title="View subscription detail"
        >
          <MoreVertical className="size-4" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header matching Stitch Screen 11-subscriptions-list */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Subscriptions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-xs text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              1,284 Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage recurring contracts, plan assignments, billing schedules, and renewals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            className="text-xs font-semibold shadow-xs"
            leftIcon={<Download className="size-4" />}
          >
            Export
          </Button>
          <Link href="/admin/templates">
            <Button
              variant="primary"
              size="md"
              className="text-xs font-semibold shadow-xs"
              leftIcon={<Plus className="size-4" />}
            >
              New subscription
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Financial KPI Ribbon (4 Metric Cards matching Stitch) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Monthly Run Rate</span>
            <TrendingUp className="size-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              ₹42.85 L
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              +14.2%
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Active Contracts</span>
            <CheckCircle2 className="size-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              1,085
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              84.5% rate
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Expiring in 30 Days</span>
            <AlertTriangle className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
              14
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-semibold">
              ₹2.8L at risk
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Revenue / Sub</span>
            <Coins className="size-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              ₹3,949
            </span>
            <span className="text-xs text-slate-400">ARPU monthly</span>
          </div>
        </div>
      </div>

      {/* Status Tabs Navigation Strip */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 w-fit">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {tab.dotColor && (
                <span className={`size-2 rounded-full ${tab.dotColor}`} />
              )}
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by agreement #, customer name, GSTIN..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterExpiring(!filterExpiring)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filterExpiring
                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
          >
            <span>⚡ Expiring in 30 days</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-200 dark:bg-amber-800 text-[10px] font-bold">
              14
            </span>
          </button>

          <Button
            variant="secondary"
            size="sm"
            className="text-xs font-semibold h-8"
            leftIcon={<Filter className="size-3.5" />}
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Subscriptions DataTable */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <DataTable
          data={filtered}
          columns={columns}
          emptyTitle="No subscriptions found"
          emptyDescription="No subscription contracts match the selected status filter."
        />
      </div>
    </div>
  );
}
