"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { MOCK_SUBSCRIPTIONS } from "@/mocks";
import { Plus, Search, Repeat, Eye, Calendar } from "lucide-react";

export function SubscriptionsList() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const tabs = [
    { id: "all", label: "All Agreements", count: MOCK_SUBSCRIPTIONS.length },
    { id: "active", label: "Active", count: MOCK_SUBSCRIPTIONS.filter((s) => s.status === "active").length },
    { id: "confirmed", label: "Confirmed", count: MOCK_SUBSCRIPTIONS.filter((s) => s.status === "confirmed").length },
    { id: "quotation", label: "Quotations", count: MOCK_SUBSCRIPTIONS.filter((s) => s.status === "quotation").length },
    { id: "draft", label: "Drafts", count: MOCK_SUBSCRIPTIONS.filter((s) => s.status === "draft").length },
    { id: "closed", label: "Closed", count: MOCK_SUBSCRIPTIONS.filter((s) => s.status === "closed").length },
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
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <Repeat className="w-3.5 h-3.5" />
          </div>
          <Link
            href={`/admin/subscriptions/${sub.id}`}
            className="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {sub.number}
          </Link>
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      render: (sub: any) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">
            {sub.customerName}
          </div>
          <div className="text-[11px] text-slate-400">{sub.paymentTerms}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (sub: any) => <StatusPill status={sub.status} />,
    },
    {
      key: "startDate",
      header: "Period",
      render: (sub: any) => (
        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{formatDate(sub.startDate)}</span>
          <span>→</span>
          <span>{formatDate(sub.expiryDate)}</span>
        </div>
      ),
    },
    {
      key: "nextBillingDate",
      header: "Next Billing",
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
        return <span className="font-bold tabular-nums">{formatINR(total)}</span>;
      },
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (sub: any) => (
        <Link href={`/admin/subscriptions/${sub.id}`}>
          <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
            View
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Subscription Agreements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track agreement lifecycles (Draft → Quotation → Confirmed → Active → Closed).
          </p>
        </div>
        <Link href="/admin/subscriptions/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            New Agreement
          </Button>
        </Link>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by agreement # or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyTitle="No subscriptions in this view"
        emptyDescription="Change the filter tab or create a new subscription agreement."
      />
    </div>
  );
}
