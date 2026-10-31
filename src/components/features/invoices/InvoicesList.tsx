"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { MOCK_INVOICES } from "@/mocks";
import {
  Receipt,
  Search,
  Download,
  Zap,
  Check,
  Send,
  Printer,
  X,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";

export function InvoicesList() {
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [overdueOnly, setOverdueOnly] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionNotice, setBulkActionNotice] = useState<string | null>(null);

  // Enriched invoice records with customer GSTIN and overdue days
  const enrichedInvoices = useMemo(() => {
    const referenceDate = new Date("2026-10-31T00:00:00.000Z");
    return MOCK_INVOICES.map((inv) => {
      const due = new Date(inv.dueDate);
      const isPastDue = inv.status !== "paid" && inv.status !== "cancelled" && due < referenceDate;
      const daysOverdue = isPastDue
        ? Math.max(1, Math.round((referenceDate.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

      // Mock GSTIN mapping based on customer
      let gstin = "07AABCA1234F1Z5";
      let initials = "AR";
      let initialsBg = "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300";

      if (inv.customerName?.toLowerCase().includes("nova")) {
        gstin = "27AABCL9876C1ZD";
        initials = "NL";
        initialsBg = "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300";
      } else if (inv.customerName?.toLowerCase().includes("kiran")) {
        gstin = "29AABFK4521D1ZZ";
        initials = "KS";
        initialsBg = "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300";
      } else if (inv.customerName?.toLowerCase().includes("zenith")) {
        gstin = "06AAACZ7741P1Z9";
        initials = "ZE";
        initialsBg = "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300";
      }

      const totalMinor = inv.totalAmountMinor || (inv as any).totalAmount || 0;
      const paidMinor = inv.paidAmountMinor || (inv.status === "paid" ? totalMinor : 0);
      const balanceMinor = inv.balanceMinor !== undefined ? inv.balanceMinor : totalMinor - paidMinor;

      return {
        ...inv,
        gstin,
        initials,
        initialsBg,
        totalMinor,
        paidMinor,
        balanceMinor,
        isPastDue,
        daysOverdue,
        computedStatus: isPastDue ? "overdue" : inv.status,
      };
    });
  }, []);

  // Filtered dataset
  const filtered = useMemo(() => {
    return enrichedInvoices.filter((inv) => {
      if (overdueOnly && !inv.isPastDue) return false;
      if (activeStatusFilter !== "all" && inv.computedStatus !== activeStatusFilter && inv.status !== activeStatusFilter) {
        return false;
      }
      if (customerFilter !== "all" && !inv.customerName?.toLowerCase().includes(customerFilter.toLowerCase())) {
        return false;
      }
      if (search) {
        const query = search.toLowerCase();
        const matchesNumber = inv.number.toLowerCase().includes(query);
        const matchesCustomer = (inv.customerName || "").toLowerCase().includes(query);
        const matchesGstin = inv.gstin.toLowerCase().includes(query);
        const matchesSub = (inv.subscriptionId || "").toLowerCase().includes(query);
        if (!matchesNumber && !matchesCustomer && !matchesGstin && !matchesSub) {
          return false;
        }
      }
      return true;
    });
  }, [enrichedInvoices, activeStatusFilter, customerFilter, overdueOnly, search]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((i) => i.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedInvoices = enrichedInvoices.filter((i) => selectedIds.includes(i.id));
  const combinedSelectedBalance = selectedInvoices.reduce((acc, curr) => acc + curr.balanceMinor, 0);

  const triggerBulkAction = (actionName: string) => {
    setBulkActionNotice(`${actionName} triggered for ${selectedIds.length} invoices`);
    setTimeout(() => setBulkActionNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="hover:text-slate-900 dark:hover:text-white transition">Billing</span>
            <ChevronRight className="size-4 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-medium">Invoices</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Invoices
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              3,412 Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Generate, track, and reconcile recurring GST tax invoices and payment collections.
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="size-4" />}
            onClick={() => triggerBulkAction("Export CSV")}
          >
            Export
          </Button>
          <Link href="/admin/billing">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Zap className="size-4 text-amber-300" />}
            >
              Run billing
            </Button>
          </Link>
        </div>
      </div>

      {/* 4-Card Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Draft Card */}
        <button
          type="button"
          onClick={() => {
            setActiveStatusFilter(activeStatusFilter === "draft" ? "all" : "draft");
            setOverdueOnly(false);
          }}
          className={`text-left p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
            activeStatusFilter === "draft"
              ? "bg-slate-100 dark:bg-slate-800/80 border-slate-400 dark:border-slate-600 ring-2 ring-indigo-500/20"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
              Draft
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              18
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              ₹1,42,850
            </span>
            <span className="text-xs text-slate-500">4.2% of total</span>
          </div>
        </button>

        {/* Confirmed Card */}
        <button
          type="button"
          onClick={() => {
            setActiveStatusFilter(activeStatusFilter === "confirmed" ? "all" : "confirmed");
            setOverdueOnly(false);
          }}
          className={`text-left p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
            activeStatusFilter === "confirmed"
              ? "bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/20"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
              Confirmed
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              64
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              ₹8,15,400
            </span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Pending sync</span>
          </div>
        </button>

        {/* Paid Card */}
        <button
          type="button"
          onClick={() => {
            setActiveStatusFilter(activeStatusFilter === "paid" ? "all" : "paid");
            setOverdueOnly(false);
          }}
          className={`text-left p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
            activeStatusFilter === "paid"
              ? "bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/20"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
              Paid
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              3,293
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              ₹4,28,90,450
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">96.5% settled</span>
          </div>
        </button>

        {/* Overdue Card (Alert styling) */}
        <button
          type="button"
          onClick={() => {
            setOverdueOnly(!overdueOnly);
            setActiveStatusFilter("all");
          }}
          className={`text-left p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
            overdueOnly
              ? "bg-red-100/80 dark:bg-red-950/60 border-red-400 dark:border-red-600 ring-2 ring-red-500/20"
              : "bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 hover:border-red-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
              <span className="text-xs uppercase font-semibold tracking-wider text-red-700 dark:text-red-300">
                Overdue
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 text-xs font-bold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              37
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold tabular-nums text-red-700 dark:text-red-300">
              ₹6,12,450
            </span>
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">Dunning active</span>
          </div>
        </button>
      </div>

      {/* Contextual Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 shadow-sm flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Check className="size-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-indigo-950 dark:text-indigo-200">
              {selectedIds.length} invoice{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-indigo-300 dark:bg-indigo-700" />
            <span className="hidden sm:inline text-xs text-indigo-700 dark:text-indigo-300 font-medium">
              Combined balance: {formatINR(combinedSelectedBalance)}
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Check className="size-4 text-emerald-600" />}
              onClick={() => triggerBulkAction("Confirm")}
            >
              Confirm
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Send className="size-4 text-indigo-600" />}
              onClick={() => triggerBulkAction("Send")}
            >
              Send
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Printer className="size-4 text-slate-600" />}
              onClick={() => triggerBulkAction("Print / PDF")}
            >
              Print / PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
              leftIcon={<X className="size-4" />}
              onClick={() => triggerBulkAction("Cancel")}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500"
              onClick={() => setSelectedIds([])}
            >
              Clear selection
            </Button>
          </div>
        </div>
      )}

      {/* Action Notification Toast */}
      {bulkActionNotice && (
        <div className="p-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <Check className="size-4 text-emerald-400" />
          <span>{bulkActionNotice}</span>
        </div>
      )}

      {/* Table Container Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex items-center min-w-[260px] max-w-sm flex-1">
              <Search className="size-4 absolute left-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice number, customer, GSTIN..."
                className="w-full pl-9 pr-12 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
              <kbd className="absolute right-2 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 text-[10px] font-mono">
                ⌘K
              </kbd>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={activeStatusFilter}
                onChange={(e) => setActiveStatusFilter(e.target.value)}
                className="h-9 px-3 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="all">Status: All</option>
                <option value="draft">Status: Draft</option>
                <option value="confirmed">Status: Confirmed</option>
                <option value="paid">Status: Paid</option>
                <option value="overdue">Status: Overdue</option>
              </select>
              <ChevronDown className="size-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Customer Filter */}
            <div className="relative">
              <select
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                className="h-9 px-3 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="all">Customer: All</option>
                <option value="Acme Retail">Acme Retail</option>
                <option value="Nova Logistics">Nova Logistics</option>
                <option value="Kiran Stores">Kiran Stores</option>
                <option value="Zenith">Zenith Edutech</option>
              </select>
              <ChevronDown className="size-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Overdue Only Toggle Chip */}
            <button
              type="button"
              onClick={() => setOverdueOnly(!overdueOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                overdueOnly
                  ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 border border-transparent"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${overdueOnly ? "bg-red-600" : "bg-slate-400"}`} />
              Overdue only (37)
            </button>
          </div>

          <div className="flex items-center gap-2 self-end lg:self-auto text-xs text-slate-500">
            <span>Showing {filtered.length} invoices</span>
          </div>
        </div>

        {/* Desktop Data Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider select-none border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Invoice No.</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Subscription</th>
                <th className="py-3 px-3">Issue Date</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3 text-right">Total Amount</th>
                <th className="py-3 px-3 text-right">Paid Amount</th>
                <th className="py-3 px-3 text-right">Balance Due</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center w-12">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-normal">
              {filtered.map((inv) => {
                const isSelected = selectedIds.includes(inv.id);
                return (
                  <tr
                    key={inv.id}
                    className={`transition-colors group ${
                      isSelected
                        ? "bg-indigo-50/50 dark:bg-indigo-950/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(inv.id)}
                        className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <Receipt className="size-3.5" />
                        </div>
                        <Link
                          href={`/admin/invoices/${inv.id}`}
                          className="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {inv.number}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${inv.initialsBg}`}>
                          {inv.initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-900 dark:text-white truncate">
                            {inv.customerName}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            {inv.gstin}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <Link
                        href={`/admin/subscriptions/${inv.subscriptionId}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-medium hover:bg-slate-200 transition"
                      >
                        {inv.subscriptionId?.toUpperCase() || "SUB-2026-0001"}
                      </Link>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 text-xs">
                      {formatDate(inv.periodStart || inv.createdAt)}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-700 dark:text-slate-300">
                          {formatDate(inv.dueDate)}
                        </span>
                        {inv.isPastDue && (
                          <span className="px-1.5 py-0.2 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-[10px] font-bold">
                            {inv.daysOverdue}d overdue
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold tabular-nums text-slate-900 dark:text-white">
                      {formatINR(inv.totalMinor)}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums text-slate-500">
                      {formatINR(inv.paidMinor)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold tabular-nums">
                      <span className={inv.balanceMinor > 0 && inv.isPastDue ? "text-red-600 dark:text-red-400 font-bold" : "text-slate-900 dark:text-white"}>
                        {formatINR(inv.balanceMinor)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusPill status={inv.computedStatus} />
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <Link href={`/admin/invoices/${inv.id}`}>
                        <Button variant="ghost" size="sm" className="p-1">
                          <MoreHorizontal className="size-4 text-slate-400 hover:text-slate-600" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-800">
          {filtered.map((inv) => (
            <div key={inv.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Link
                  href={`/admin/invoices/${inv.id}`}
                  className="font-mono font-bold text-indigo-600 dark:text-indigo-400"
                >
                  {inv.number}
                </Link>
                <StatusPill status={inv.computedStatus} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">{inv.customerName}</span>
                <span className="font-bold tabular-nums text-slate-900 dark:text-white">{formatINR(inv.totalMinor)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Due: {formatDate(inv.dueDate)}</span>
                {inv.isPastDue && (
                  <span className="text-red-600 font-bold">{inv.daysOverdue}d overdue</span>
                )}
                <span>Balance: {formatINR(inv.balanceMinor)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
