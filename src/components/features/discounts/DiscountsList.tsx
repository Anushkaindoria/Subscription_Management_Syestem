"use client";

import React, { useState, useMemo } from "react";
import { formatINR, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  Tag,
  Gift,
  PieChart,
  Clock,
  Search,
  Plus,
  Filter,
  Download,
  SlidersHorizontal,
  ChevronRight,
  Lock,
  Edit2,
  Copy,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Package,
  Layers,
  Percent,
  Check,
  Calendar,
} from "lucide-react";

interface DiscountRule {
  id: string;
  name: string;
  code: string;
  applicationType: "Auto-applied" | "Coupon code" | "Tiered quote only" | "Billing cycle trigger" | "First-time sub";
  kind: "percentage" | "fixed";
  value: number; // percentage (10) or fixed minor units (250000)
  appliesToName: string;
  minCriteria: string;
  startDate: string;
  endDate: string;
  validityNote: string;
  usedCount: number;
  usageCap: number | null; // null for unlimited
  status: "active" | "scheduled" | "exhausted";
}

const INITIAL_DISCOUNTS: DiscountRule[] = [
  {
    id: "disc-1",
    name: "Seats 10+ Offer",
    code: "SEATS10",
    applicationType: "Auto-applied",
    kind: "percentage",
    value: 10,
    appliesToName: "Brightloop CRM Suite",
    minCriteria: "Min Qty: 10 seats",
    startDate: "01 Oct 2026",
    endDate: "31 Dec 2026",
    validityNote: "42 days left",
    usedCount: 18,
    usageCap: 50,
    status: "active",
  },
  {
    id: "disc-2",
    name: "Diwali Early Bird",
    code: "DIWALI26",
    applicationType: "Coupon code",
    kind: "fixed",
    value: 250000, // ₹2,500
    appliesToName: "Whole subscription",
    minCriteria: "Min ₹10,000 purchase",
    startDate: "15 Oct 2026",
    endDate: "15 Nov 2026",
    validityNote: "Ending in 12d",
    usedCount: 88,
    usageCap: 100,
    status: "active",
  },
  {
    id: "disc-3",
    name: "Enterprise Volume Rebate",
    code: "ENTVOL",
    applicationType: "Tiered quote only",
    kind: "percentage",
    value: 15,
    appliesToName: "Extra Seats Add-on",
    minCriteria: "Min Qty: 25 seats",
    startDate: "01 Dec 2026",
    endDate: "31 Mar 2027",
    validityNote: "Starts in 11 days",
    usedCount: 0,
    usageCap: 25,
    status: "scheduled",
  },
  {
    id: "disc-4",
    name: "Startup Launch Credit",
    code: "STARTUP50",
    applicationType: "First-time sub",
    kind: "fixed",
    value: 50000, // ₹500
    appliesToName: "Whole subscription",
    minCriteria: "None",
    startDate: "01 Aug 2026",
    endDate: "30 Sep 2026",
    validityNote: "Pool cap hit",
    usedCount: 50,
    usageCap: 50,
    status: "exhausted",
  },
  {
    id: "disc-5",
    name: "Annual Prepay Incentive",
    code: "PREPAY15",
    applicationType: "Billing cycle trigger",
    kind: "percentage",
    value: 15,
    appliesToName: "Whole subscription",
    minCriteria: "Annual cadence only",
    startDate: "01 Jan 2026",
    endDate: "31 Dec 2026",
    validityNote: "Ongoing standard",
    usedCount: 36,
    usageCap: null, // Unlimited
    status: "active",
  },
];

export function DiscountsList() {
  const [discounts, setDiscounts] = useState<DiscountRule[]>(INITIAL_DISCOUNTS);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [createdToast, setCreatedToast] = useState<string | null>(null);

  // New Discount Form State
  const [formState, setFormState] = useState({
    name: "",
    code: "",
    kind: "percentage" as "percentage" | "fixed",
    value: 10,
    appliesToName: "Whole subscription",
    minCriteria: "None",
    startDate: "2026-11-01",
    endDate: "2026-12-31",
    usageCap: 50,
  });

  const filtered = useMemo(() => {
    return discounts.filter((d) => {
      const q = search.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.appliesToName.toLowerCase().includes(q)
      );
    });
  }, [discounts, search]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((d) => d.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.code) return;

    const newRule: DiscountRule = {
      id: `disc-${Date.now()}`,
      name: formState.name,
      code: formState.code.toUpperCase(),
      applicationType: "Coupon code",
      kind: formState.kind,
      value: formState.kind === "fixed" ? formState.value * 100 : formState.value,
      appliesToName: formState.appliesToName,
      minCriteria: formState.minCriteria,
      startDate: formState.startDate,
      endDate: formState.endDate,
      validityNote: "Active through season",
      usedCount: 0,
      usageCap: formState.usageCap || null,
      status: "active",
    };

    setDiscounts([newRule, ...discounts]);
    setCreatedToast(`Discount code ${newRule.code} created!`);
    setModalOpen(false);
    setTimeout(() => setCreatedToast(null), 3000);
    setFormState({
      name: "",
      code: "",
      kind: "percentage",
      value: 10,
      appliesToName: "Whole subscription",
      minCriteria: "None",
      startDate: "2026-11-01",
      endDate: "2026-12-31",
      usageCap: 50,
    });
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Rule Name,Code,Kind,Value,Applies To,Usage,Status",
        ...filtered.map(
          (d) =>
            `"${d.name}","${d.code}","${d.kind}",${d.value},"${d.appliesToName}","${d.usedCount}/${d.usageCap || 'Uncapped'}","${d.status}"`
        ),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `discounts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Context Header & Protection Banner */}
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-wrap items-center justify-between gap-y-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="hover:text-slate-900 dark:hover:text-white transition">Rules</span>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold">Discounts</span>
          </nav>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold shadow-sm">
            <Lock className="size-3.5" />
            <span>Admin only — Financial Rules Protected</span>
          </div>
        </div>

        {/* Title & Primary Actions Area */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Discounts
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Configure volume rebates, seasonal offers, and coupon codes applied automatically during billing runs.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-center">
            {/* Search bar within view */}
            <div className="relative w-64">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search rules or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<Download className="size-4" />}
            >
              Export
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setModalOpen(true)}
              leftIcon={<Plus className="size-4" />}
            >
              New discount
            </Button>
          </div>
        </div>
      </div>

      {createdToast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <span>{createdToast}</span>
        </div>
      )}

      {/* KPI Strip (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Active Offers */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Offers
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Tag className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              4 active
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Seats 10+, Prepay 15%, CRM Launch
            </p>
          </div>
        </div>

        {/* Total Redemptions */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Redemptions
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Gift className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              142 redemptions
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span>Savings passed:</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                ₹2,18,450.00
              </span>
            </div>
          </div>
        </div>

        {/* Budget / Usage Cap */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Budget / Cap Limit
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <PieChart className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                71%
              </div>
              <span className="text-xs text-slate-400">213 of 300 pooled</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: "71%" }}></div>
            </div>
          </div>
        </div>

        {/* Scheduled / Ending Soon */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cycle Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              1 scheduled
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium flex items-center gap-1">
              <AlertTriangle className="size-3.5" />
              <span>1 rule ending in 12d</span>
            </p>
          </div>
        </div>
      </div>

      {/* Discounts Data Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Table Header Controls Bar */}
        <div className="px-6 py-3 bg-white dark:bg-slate-900 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-slate-900 dark:text-white">Configured Rules</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              {filtered.length} Rules
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800 select-none">
                <th className="w-12 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll}
                    className="rounded w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3">Rule Name & Code</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Value</th>
                <th className="px-4 py-3">Applies to</th>
                <th className="px-4 py-3">Min. Criteria</th>
                <th className="px-4 py-3">Validity & Window</th>
                <th className="px-4 py-3">Usage & Cap</th>
                <th className="px-4 py-3">Status</th>
                <th className="w-24 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filtered.map((d) => {
                const isSelected = selectedIds.includes(d.id);
                const percentUsed = d.usageCap ? Math.round((d.usedCount / d.usageCap) * 100) : 25;

                return (
                  <tr
                    key={d.id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer ${
                      isSelected ? "bg-indigo-50/30 dark:bg-indigo-950/20" : ""
                    } ${d.status === "exhausted" ? "opacity-75" : ""}`}
                  >
                    <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(d.id)}
                        className="rounded w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                          {d.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                            {d.code}
                          </span>
                          <span className="text-[11px] text-slate-400">{d.applicationType}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          d.kind === "percentage"
                            ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                            : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        }`}
                      >
                        {d.kind === "percentage" ? "Percentage" : "Fixed amount"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {d.kind === "percentage" ? `${d.value}% off` : `${formatINR(d.value)} flat`}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
                        <Package className="size-3 text-slate-500" />
                        <span className="truncate max-w-[150px]">{d.appliesToName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                      {d.minCriteria}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-800 dark:text-slate-200">
                          {d.startDate} – {d.endDate}
                        </span>
                        <span
                          className={`text-[11px] font-medium ${
                            d.validityNote.includes("left") || d.validityNote.includes("Ending")
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-slate-400"
                          }`}
                        >
                          {d.validityNote}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 min-w-[150px]">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          <span>
                            {d.usedCount} / {d.usageCap !== null ? `${d.usageCap} used` : "Unlimited"}
                          </span>
                          <span
                            className={`font-semibold ${
                              d.status === "exhausted" ? "text-rose-600" : "text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            {d.status === "exhausted" ? "Exhausted" : `${percentUsed}%`}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              d.status === "exhausted"
                                ? "bg-slate-400"
                                : percentUsed > 80
                                ? "bg-purple-600"
                                : "bg-indigo-600"
                            }`}
                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {d.status === "active" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      )}
                      {d.status === "scheduled" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Scheduled
                        </span>
                      )}
                      {d.status === "exhausted" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Exhausted
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1 text-slate-400">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => alert(`Editing rule: ${d.name}`)}
                          title="Edit rule"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => {
                            const cloned: DiscountRule = {
                              ...d,
                              id: `disc-${Date.now()}`,
                              code: `${d.code}_COPY`,
                              name: `${d.name} (Copy)`,
                            };
                            setDiscounts([...discounts, cloned]);
                          }}
                          title="Duplicate rule"
                        >
                          <Copy className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1" title="More">
                          <MoreVertical className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Discount Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Discount Rule"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Rule Display Name *
            </label>
            <Input
              required
              placeholder="e.g. Festive Early Bird Offer"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Coupon / Promo Code *
              </label>
              <Input
                required
                placeholder="FESTIVE26"
                value={formState.code}
                onChange={(e) => setFormState({ ...formState, code: e.target.value.toUpperCase() })}
                className="font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Discount Calculation Mode
              </label>
              <select
                value={formState.kind}
                onChange={(e) => setFormState({ ...formState, kind: e.target.value as any })}
                className="w-full h-10 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="percentage">Percentage (% off)</option>
                <option value="fixed">Fixed Amount (₹ flat)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {formState.kind === "percentage" ? "Discount Percentage (%)" : "Flat Amount (₹)"}
              </label>
              <Input
                type="number"
                min={1}
                max={formState.kind === "percentage" ? 100 : 100000}
                value={formState.value}
                onChange={(e) => setFormState({ ...formState, value: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Usage Cap (Redemptions)
              </label>
              <Input
                type="number"
                min={1}
                placeholder="50"
                value={formState.usageCap}
                onChange={(e) => setFormState({ ...formState, usageCap: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={formState.startDate}
                onChange={(e) => setFormState({ ...formState, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Date
              </label>
              <Input
                type="date"
                value={formState.endDate}
                onChange={(e) => setFormState({ ...formState, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Discount
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
