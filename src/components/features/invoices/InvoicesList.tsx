"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { MOCK_INVOICES } from "@/mocks";
import { Receipt, Search, Eye, Download, AlertCircle } from "lucide-react";

export function InvoicesList() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const tabs = [
    { id: "all", label: "All Invoices", count: MOCK_INVOICES.length },
    { id: "paid", label: "Paid", count: MOCK_INVOICES.filter((i) => i.status === "paid").length },
    { id: "confirmed", label: "Confirmed / Due", count: MOCK_INVOICES.filter((i) => i.status === "confirmed").length },
    { id: "overdue", label: "Overdue", count: MOCK_INVOICES.filter((i) => (i.status as string) === "overdue").length },
  ];

  const filtered = MOCK_INVOICES.filter((inv) => {
    if (activeTab !== "all" && (inv.status as string) !== activeTab) return false;
    if (
      search &&
      !inv.number.toLowerCase().includes(search.toLowerCase()) &&
      !(inv.customerName || "").toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const columns = [
    {
      key: "number",
      header: "Invoice #",
      render: (inv: any) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <Receipt className="w-3.5 h-3.5" />
          </div>
          <Link
            href={`/admin/invoices/${inv.id}`}
            className="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {inv.number}
          </Link>
        </div>
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
        <span
          className={
            inv.status === "overdue"
              ? "text-xs font-bold text-red-600 flex items-center gap-1"
              : "text-xs text-slate-600 dark:text-slate-400"
          }
        >
          {inv.status === "overdue" && <AlertCircle className="w-3.5 h-3.5 text-red-600" />}
          {formatDate(inv.dueDate)}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Total (inc. GST)",
      align: "right" as const,
      render: (inv: any) => (
        <span className="font-bold tabular-nums text-slate-900 dark:text-white">
          {formatINR(inv.totalAmount)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (inv: any) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/invoices/${inv.id}`}>
            <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
              Details
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Invoices & Receivables
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Indian GST-compliant tax invoices, line calculation trace, and reconciliation.
          </p>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by invoice # or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyTitle="No invoices found in this view"
        emptyDescription="All invoices have been settled or match no filters."
      />
    </div>
  );
}
