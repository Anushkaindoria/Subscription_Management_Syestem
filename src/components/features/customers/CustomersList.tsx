"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusPill } from "@/components/ui/StatusPill";
import { MOCK_CUSTOMERS } from "@/mocks";
import { Users, Search, Building2, Eye, Plus } from "lucide-react";

export function CustomersList() {
  const [search, setSearch] = useState("");
  const [customers] = useState(MOCK_CUSTOMERS);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.taxId || "").toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      header: "Customer Name & Entity",
      render: (c: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <Link
              href={`/admin/customers/${c.id}`}
              className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition"
            >
              {c.name}
            </Link>
            <div className="text-xs text-slate-400 font-mono">GSTIN: {c.gstin}</div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Primary Contact",
      render: (c: any) => (
        <div className="text-xs">
          <div className="text-slate-800 dark:text-slate-200">{c.email}</div>
          <div className="text-slate-400">{c.phone}</div>
        </div>
      ),
    },
    {
      key: "activeAgreementsCount",
      header: "Agreements",
      align: "center" as const,
      render: (c: any) => (
        <span className="tabular-nums font-semibold text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {c.activeAgreementsCount} active
        </span>
      ),
    },
    {
      key: "mrrMinor",
      header: "Monthly Value (MRR)",
      align: "right" as const,
      render: (c: any) => (
        <span className="font-bold tabular-nums text-slate-900 dark:text-white">
          {formatINR(c.mrrMinor)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Portal Access",
      render: () => <StatusPill status="active" />,
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (c: any) => (
        <Link href={`/admin/customers/${c.id}`}>
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
            Customer Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Corporate accounts, GST identification numbers, and recurring revenue metrics.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by company name, GSTIN, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyTitle="No customers found"
        emptyDescription="Try adjusting your search criteria."
      />
    </div>
  );
}
