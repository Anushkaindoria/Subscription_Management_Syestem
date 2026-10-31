"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { MOCK_PLANS } from "@/mocks";
import { Plus, Calendar, Check, X, Edit } from "lucide-react";

export function PlansList() {
  const [plans] = useState(MOCK_PLANS);

  const columns = [
    {
      key: "name",
      header: "Plan Name",
      render: (p: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <Link
              href={`/admin/plans/${p.id}`}
              className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 transition"
            >
              {p.name}
            </Link>
            <div className="text-xs text-slate-400 capitalize">{p.period} Billing</div>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Recurring Rate",
      align: "right" as const,
      render: (p: any) => (
        <span className="font-bold tabular-nums text-slate-900 dark:text-white">
          {formatINR(p.price)}
          <span className="text-xs font-normal text-slate-400">/{p.period}</span>
        </span>
      ),
    },
    {
      key: "minQuantity",
      header: "Min Qty",
      align: "center" as const,
      render: (p: any) => <span className="tabular-nums">{p.minQuantity || 1}</span>,
    },
    {
      key: "flags",
      header: "Lifecycle Rules",
      render: (p: any) => (
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
              p.renewable ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-400"
            }`}
          >
            {p.renewable ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Renewable
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
              p.pausable ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-slate-100 text-slate-400"
            }`}
          >
            {p.pausable ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Pausable
          </span>
        </div>
      ),
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
        <Link href={`/admin/plans/${p.id}`}>
          <Button variant="ghost" size="sm" leftIcon={<Edit className="w-3.5 h-3.5" />}>
            Edit
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
            Subscription Plans & Tiers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Define recurring billing periods, renewal cadence, and agreement control flags.
          </p>
        </div>
        <Link href="/admin/plans/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Create Plan
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={plans}
        emptyTitle="No plans configured"
        emptyDescription="Create your first subscription tier to get started."
      />
    </div>
  );
}
