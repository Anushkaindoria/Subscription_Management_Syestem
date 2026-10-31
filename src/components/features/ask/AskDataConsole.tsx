"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Send,
  History,
  Bookmark,
  Download,
  Search,
  X,
  Mic,
  Brain,
  CheckCircle2,
  Calendar,
  CreditCard,
  Plus,
  SlidersHorizontal,
  Code,
  Clock,
  AlertTriangle,
  Receipt,
  FileSpreadsheet,
  ExternalLink,
  Eye,
  Check,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface QueryResultRow {
  id: string;
  invoiceNumber: string;
  irn: string;
  customerName: string;
  gstin: string;
  planName: string;
  planCycle: string;
  dueDate: string;
  daysOverdue: number;
  outstandingMinor: number;
  status: "overdue" | "paid" | "draft";
}

const PRESET_RESULTS: QueryResultRow[] = [
  {
    id: "res-1",
    invoiceNumber: "INV-2026-0038",
    irn: "IRN-91f8…4e2a",
    customerName: "Zenith Edutech Pvt Ltd",
    gstin: "07AABCZ9981K1Z3",
    planName: "Business Yearly",
    planCycle: "Annual billing • Tier 3",
    dueDate: "15 Sep 2026",
    daysOverdue: 42,
    outstandingMinor: 8849410, // ₹88,494.10
    status: "overdue",
  },
  {
    id: "res-2",
    invoiceNumber: "INV-2026-0029",
    irn: "IRN-72c1…98cb",
    customerName: "Nova Logistics Hub",
    gstin: "27AABCN4421P1Z8",
    planName: "Enterprise Custom Yearly",
    planCycle: "Bespoke SLA • Multi-region",
    dueDate: "28 Sep 2026",
    daysOverdue: 29,
    outstandingMinor: 7299000, // ₹72,990.00
    status: "overdue",
  },
  {
    id: "res-3",
    invoiceNumber: "INV-2026-0044",
    irn: "IRN-33d9…12f5",
    customerName: "Kiran Stores Supermarkets",
    gstin: "29AAACK1902M1Z2",
    planName: "Business Yearly (Multi-outlet)",
    planCycle: "18 POS nodes connected",
    dueDate: "12 Oct 2026",
    daysOverdue: 15,
    outstandingMinor: 5291236, // ₹52,912.36
    status: "overdue",
  },
];

export function AskDataConsole() {
  const [query, setQuery] = useState("Overdue yearly invoices above ₹50,000");
  const [selectedIds, setSelectedIds] = useState<string[]>(["res-1", "res-2", "res-3"]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<QueryResultRow[]>(PRESET_RESULTS);
  const [hasExecuted, setHasExecuted] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const samplePrompts = [
    "Overdue yearly invoices above ₹50,000",
    "Subscriptions expiring this month",
    "Revenue by plan last quarter",
    "Customers with failed auto-debit payments",
    "Top 5 ARR contributors in Delhi",
  ];

  const handleRunQuery = (promptText?: string) => {
    const q = promptText || query;
    if (!q.trim()) return;
    setLoading(true);
    setQuery(q);

    setTimeout(() => {
      setLoading(false);
      setHasExecuted(true);
      if (q.toLowerCase().includes("expiring")) {
        setResults([
          {
            id: "res-exp-1",
            invoiceNumber: "SUB-2026-0002",
            irn: "AUTORENEW-ON",
            customerName: "Nova Logistics",
            gstin: "27AABCN9876K1Z2",
            planName: "Starter Monthly",
            planCycle: "Renewal in 8 days",
            dueDate: "10 Nov 2026",
            daysOverdue: 0,
            outstandingMinor: 149900,
            status: "paid",
          },
        ]);
      } else {
        setResults(PRESET_RESULTS);
      }
    }, 450);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === results.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(results.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyCode = () => {
    const astPayload = JSON.stringify(
      {
        query: query,
        ast: {
          entity: "Invoice",
          filters: [
            { field: "status", operator: "EQ", value: "OVERDUE" },
            { field: "plan.interval", operator: "EQ", value: "year" },
            { field: "totalAmountMinor", operator: "GT", value: 5000000 },
          ],
        },
      },
      null,
      2
    );
    navigator.clipboard.writeText(astPayload);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const totalOverdueMinor = results.reduce((sum, r) => sum + r.outstandingMinor, 0);

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="hover:text-slate-900 dark:hover:text-white transition">Analytics</span>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold">Ask your data</span>
          </nav>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Ask your data
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm">
              <Sparkles className="size-3.5" />
              <span>Natural Language Query Engine • v2.4</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Query your billing records, subscriptions, invoices, and revenue metrics in plain English.
          </p>
        </div>

        {/* Quick Utility Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Recent queries:\n1. Overdue yearly invoices above ₹50,000\n2. Delhi GST customers")}
            leftIcon={<History className="size-4" />}
          >
            Query History
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Report saved to dashboard shortcuts!")}
            leftIcon={<Bookmark className="size-4" />}
          >
            Saved Reports
          </Button>
        </div>
      </div>

      {/* Primary Interactive Search & Prompt Engine */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden">
        <div className="relative flex flex-col gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunQuery();
            }}
            className="relative flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 focus-within:border-indigo-600 transition"
          >
            <Sparkles className="size-5 text-indigo-600 dark:text-indigo-400 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Ask a question about invoices, churn, MRR, or collections..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-0 outline-none w-full text-base text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
            />
            <div className="flex items-center gap-2 shrink-0">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 transition"
                  title="Clear input"
                >
                  <X className="size-4" />
                </button>
              )}
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={loading}
                leftIcon={<Sparkles className="size-4" />}
              >
                {loading ? "Analyzing..." : "Run Query"}
              </Button>
            </div>
          </form>

          {/* Suggestion Chips Rail */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 mr-1 font-medium">Suggested prompts:</span>
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleRunQuery(prompt)}
                className={`px-3 py-1 rounded-full text-xs transition border ${
                  query === prompt
                    ? "bg-indigo-50 dark:bg-indigo-950 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Query Interpretation & Applied Filter Box */}
      {hasExecuted && (
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Brain className="size-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">Understood as</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              <span>Executed in 142ms across 3,412 records</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            Filtering invoices where status is <span className="font-semibold text-rose-600">Overdue</span>, billing frequency is <span className="font-semibold text-slate-900 dark:text-white">Annual / Yearly</span>, and gross receivable exceeds <span className="font-semibold text-slate-900 dark:text-white">₹50,000.00</span>.
          </p>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-slate-400">Status =</span>
                <span className="font-semibold text-rose-600">Overdue</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                <Calendar className="size-3.5 text-indigo-600" />
                <span className="text-slate-400">Period =</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Yearly</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                <CreditCard className="size-3.5 text-indigo-600" />
                <span className="text-slate-400">Amount &gt;</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹50,000</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition font-medium"
              >
                <Code className="size-3.5" />
                <span>{copiedCode ? "Copied AST Payload!" : "Copy SQL / API payload"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Natural Language Executive Summary & Mini Metrics Grid */}
      <div className="space-y-4">
        {/* Callout Highlight Strip */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="size-5" />
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-300">
            Found <strong className="text-rose-600 font-semibold">{results.length} overdue invoices</strong> totaling{" "}
            <strong className="text-slate-900 dark:text-white font-mono font-semibold">
              {formatINR(totalOverdueMinor)}
            </strong>{" "}
            matching your criteria across {results.length} enterprise accounts. Oldest overdue invoice is{" "}
            <strong className="text-rose-600 font-semibold">42 days past due</strong>.
          </div>
        </div>

        {/* 4 Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Overdue
            </span>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
                {formatINR(totalOverdueMinor)}
              </div>
              <div className="text-xs text-slate-400 mt-1">Gross receivable amount</div>
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Invoices Count
            </span>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                {results.length} Invoices
              </div>
              <div className="text-xs text-slate-400 mt-1">Out of 288 annual contracts</div>
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Average Dues
            </span>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
                {formatINR(Math.round(totalOverdueMinor / (results.length || 1)))}
              </div>
              <div className="text-xs text-slate-400 mt-1">Per delinquent enterprise</div>
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Collection Risk
            </span>
            <div className="mt-3">
              <div className="text-xl font-bold text-amber-600">Moderate Risk</div>
              <div className="text-xs text-slate-400 mt-1">2 with active smart dunning</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table Container with Multi-Select Actions */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Table Header Utility Controls */}
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={results.length > 0 && selectedIds.length === results.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {selectedIds.length} selected
              </span>
            </div>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
            <span className="text-xs text-slate-500 truncate max-w-md">
              Showing query results for “{query}”
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert(`Dunning notices dispatched to ${selectedIds.length} accounts!`)}
              disabled={selectedIds.length === 0}
              leftIcon={<Send className="size-3.5" />}
            >
              Send Dunning Notice ({selectedIds.length})
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={results.length > 0 && selectedIds.length === results.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Invoice # & IRN</th>
                <th className="py-3 px-4">Customer Account</th>
                <th className="py-3 px-4">Plan & Cycle</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Aging</th>
                <th className="py-3 px-4 text-right">Outstanding Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {results.map((row) => {
                const isSelected = selectedIds.includes(row.id);

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition ${
                      isSelected ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(row.id)}
                        className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <Link
                          href="/admin/invoices"
                          className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <span>{row.invoiceNumber}</span>
                          <ExternalLink className="size-3" />
                        </Link>
                        <span className="text-[11px] text-slate-400 font-mono">{row.irn}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {row.customerName}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{row.gstin}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                          {row.planName}
                        </span>
                        <span className="text-xs text-slate-400">{row.planCycle}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                      {row.dueDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                        <AlertTriangle className="size-3.5" />
                        <span>{row.daysOverdue} days overdue</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatINR(row.outstandingMinor)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Overdue
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert(`Dunning reminder queued for ${row.customerName}`)}
                        >
                          Send Reminder
                        </Button>
                        <Link href="/admin/invoices">
                          <Button variant="ghost" size="sm" className="p-1" title="View details">
                            <Eye className="size-3.5 text-slate-400" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
