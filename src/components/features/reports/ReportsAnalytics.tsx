"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  Download,
  Calendar,
  ChevronRight,
  Clock,
  Sparkles,
  AlertTriangle,
  Receipt,
  FileText,
  Filter,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Send,
  Eye,
  Check,
  CreditCard,
  Building2,
  DollarSign,
  Layers,
  ArrowRight,
} from "lucide-react";

interface OverdueRow {
  id: string;
  customerName: string;
  initials: string;
  gstin: string;
  invoiceNumber: string;
  dueDate: string;
  daysOverdue: number;
  balanceMinor: number;
  dunningStep: string;
  stepSeverity: "low" | "medium" | "high";
}

const OVERDUE_LEDGER: OverdueRow[] = [
  {
    id: "ov-1",
    customerName: "Kiran Stores",
    initials: "KS",
    gstin: "27AABCK9921D1ZN",
    invoiceNumber: "INV-2026-0044",
    dueDate: "10 Nov 2026",
    daysOverdue: 12,
    balanceMinor: 176882, // ₹1,768.82
    dunningStep: "Step 2 (Friendly reminder sent)",
    stepSeverity: "medium",
  },
  {
    id: "ov-2",
    customerName: "Apex Engineering",
    initials: "AE",
    gstin: "33AABCA9911K1Z2",
    invoiceNumber: "INV-2026-0039",
    dueDate: "24 Oct 2026",
    daysOverdue: 31,
    balanceMinor: 1499900, // ₹14,999.00
    dunningStep: "Step 3 (Escalation notice)",
    stepSeverity: "high",
  },
  {
    id: "ov-3",
    customerName: "Zenith Edutech",
    initials: "ZE",
    gstin: "06AAACZ7741P1Z9",
    invoiceNumber: "INV-2026-0041",
    dueDate: "05 Nov 2026",
    daysOverdue: 18,
    balanceMinor: 4499700, // ₹44,997.00
    dunningStep: "Step 2 (Pending review)",
    stepSeverity: "medium",
  },
  {
    id: "ov-4",
    customerName: "Pixel Studio",
    initials: "PS",
    gstin: "29AAQFP9912M1Z0",
    invoiceNumber: "INV-2026-0035",
    dueDate: "18 Oct 2026",
    daysOverdue: 37,
    balanceMinor: 449700, // ₹4,497.00
    dunningStep: "Step 3 (Phone outreach queued)",
    stepSeverity: "high",
  },
];

export function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState<"aging" | "revenue" | "mrr" | "collections">("aging");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<OverdueRow>(OVERDUE_LEDGER[0]);
  const [tone, setTone] = useState<"polite" | "firm" | "urgent">("polite");
  const [dispatched, setDispatched] = useState(false);

  const handleExportCSV = () => {
    const csv =
      "data:text/csv;charset=utf-8," +
      ["Customer,GSTIN,Invoice,Due Date,Days Overdue,Amount,Status",
        ...OVERDUE_LEDGER.map(
          (o) =>
            `"${o.customerName}","${o.gstin}","${o.invoiceNumber}","${o.dueDate}",${o.daysOverdue},${o.balanceMinor / 100},"${o.dunningStep}"`
        ),
      ].join("\n");
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aging_receivables_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenAiDraft = (row: OverdueRow) => {
    setSelectedInvoice(row);
    setAiModalOpen(true);
    setDispatched(false);
  };

  const handleSendReminder = () => {
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      setAiModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="hover:text-slate-900 dark:hover:text-white transition">Insights</span>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold">Reports</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Reports & Financial Analytics
            </h1>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                FY 2026-27
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Synced 4 mins ago
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
            Consolidated financial intelligence, aging receivables ledger, recurring revenue trajectories, and automated dunning operations.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="size-4" />}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Report scheduled to deliver every Monday at 09:00 IST to revops@brightloop.io")}
            leftIcon={<Clock className="size-4" />}
          >
            Schedule Report
          </Button>
        </div>
      </div>

      {/* Global Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
            <Calendar className="size-4 text-indigo-600 dark:text-indigo-400" />
            <span>This Fiscal Year (Apr 2026 – Mar 2027)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
            <Layers className="size-4 text-slate-400" />
            <span>All Plans (Starter, Business, Team, Trial)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
            <Building2 className="size-4 text-slate-400" />
            <span>All Customers (5 active)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="text-indigo-600 font-bold">₹</span>
            <span>INR (₹) Base</span>
          </div>
        </div>
      </div>

      {/* Report Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("aging")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
            activeTab === "aging"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Clock className="size-4" />
          <span>Overdue & Aging</span>
          <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-xs font-semibold ml-1">
            37 invoices • ₹6,12,450
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("revenue")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
            activeTab === "revenue"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <BarChart3 className="size-4" />
          <span>Revenue Analytics</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs ml-1 font-mono">
            ₹24,56,300 MTD
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("mrr")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
            activeTab === "mrr"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <RefreshCw className="size-4" />
          <span>Subscriptions MRR</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs ml-1 font-mono">
            ₹18,64,000 MRR
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("collections")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
            activeTab === "collections"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <CheckCircle2 className="size-4" />
          <span>Payments & Collections</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs ml-1 font-semibold">
            96.5% settled
          </span>
        </button>
      </div>

      {/* Aging Receivables Buckets Row (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1-7 Days */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
              1 – 7 Days
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Low risk
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              ₹1,12,400
            </div>
            <div className="flex items-center justify-between mt-1 text-slate-500 text-xs">
              <span>14 invoices pending</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">18.3% total</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: "18.3%" }}></div>
          </div>
        </div>

        {/* 8-30 Days */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
              8 – 30 Days
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              Moderate risk
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              ₹2,45,630
            </div>
            <div className="flex items-center justify-between mt-1 text-slate-500 text-xs">
              <span>15 invoices pending</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">40.1% total</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: "40.1%" }}></div>
          </div>
        </div>

        {/* 31-60 Days */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
              31 – 60 Days
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
              Elevated risk
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              ₹1,84,420
            </div>
            <div className="flex items-center justify-between mt-1 text-slate-500 text-xs">
              <span>6 invoices pending</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">30.1% total</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: "30.1%" }}></div>
          </div>
        </div>

        {/* 60+ Days */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
              60+ Days
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Critical dunning
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 font-mono tabular-nums">
              ₹70,000
            </div>
            <div className="flex items-center justify-between mt-1 text-slate-500 text-xs">
              <span>2 invoices pending</span>
              <span className="font-semibold text-rose-600">11.5% total</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: "11.5%" }}></div>
          </div>
        </div>
      </div>

      {/* AI Dunning Banner Card */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-white dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 max-w-2xl">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Automate Dunning with LoopOS AI
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Pro
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Draft personalized, GST-compliant payment reminder emails tailored to customer invoice history, penalty waivers, and automated Razorpay UPI deep links.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => handleOpenAiDraft(OVERDUE_LEDGER[0])}
          leftIcon={<Sparkles className="size-4" />}
          className="shrink-0"
        >
          AI draft reminder
        </Button>
      </div>

      {/* Overdue Receivables Ledger Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Overdue Receivables Ledger
            </h2>
            <p className="text-xs text-slate-400">
              Real-time outstanding collections breakdown with active dunning orchestration
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">4 Critical Accounts</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Days Overdue</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Automated Dunning Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {OVERDUE_LEDGER.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {row.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {row.customerName}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">GSTIN: {row.gstin}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <Link href="/admin/invoices" className="hover:underline">
                      {row.invoiceNumber}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                    {row.dueDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        row.daysOverdue > 30
                          ? "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400"
                          : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.daysOverdue > 30 ? "bg-rose-500" : "bg-amber-500"
                        }`}
                      ></span>
                      {row.daysOverdue}d overdue
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatINR(row.balanceMinor)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          row.stepSeverity === "high" ? "bg-rose-500" : "bg-amber-500"
                        }`}
                      ></span>
                      <span className="text-slate-700 dark:text-slate-300">{row.dunningStep}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenAiDraft(row)}
                        leftIcon={<Sparkles className="size-3.5" />}
                      >
                        AI Draft
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Direct reminder queued for ${row.customerName}`)}
                      >
                        Send
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Dunning Composer Modal */}
      <Modal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title="AI Dunning Email Composer"
      >
        <div className="space-y-4 text-sm">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Recipient Account:</span>
              <strong className="text-slate-900 dark:text-white ml-1">{selectedInvoice.customerName}</strong>
            </div>
            <div>
              <span className="text-slate-500">Amount Due:</span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-mono ml-1">
                {formatINR(selectedInvoice.balanceMinor)}
              </strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Tone / Dunning Stage
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTone("polite")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                  tone === "polite"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-600"
                }`}
              >
                Friendly Gentle (Day 1-14)
              </button>
              <button
                type="button"
                onClick={() => setTone("firm")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                  tone === "firm"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-600"
                }`}
              >
                Firm Escalation (Day 15-30)
              </button>
              <button
                type="button"
                onClick={() => setTone("urgent")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                  tone === "urgent"
                    ? "border-rose-600 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-600"
                }`}
              >
                Urgent Suspension Warning
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Generated Message Preview
            </label>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 font-sans text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong>Subject:</strong> Payment Reminder: {selectedInvoice.invoiceNumber} for {selectedInvoice.customerName}
              </p>
              <p>Dear Accounts Team,</p>
              <p>
                We hope this note finds you well. Our ledger reflects an outstanding balance of{" "}
                <strong>{formatINR(selectedInvoice.balanceMinor)}</strong> for invoice{" "}
                <span className="font-mono text-indigo-600 font-semibold">{selectedInvoice.invoiceNumber}</span>, which was due on {selectedInvoice.dueDate} ({selectedInvoice.daysOverdue} days ago).
              </p>
              <p>
                To avoid any interruption in your subscription services or API rate allowances, please remit via RTGS or our instantaneous UPI payment deep link below:
              </p>
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                https://pay.loopos.io/settle/{selectedInvoice.invoiceNumber}?ref={selectedInvoice.gstin}
              </div>
              <p>Thank you for being a valued Brightloop customer.</p>
              <p className="text-slate-400 italic">LoopOS Automated Collections Engine</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setAiModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSendReminder}
              disabled={dispatched}
              leftIcon={dispatched ? <Check className="size-4 text-emerald-500" /> : <Send className="size-4" />}
            >
              {dispatched ? "Dispatched Successfully!" : "Dispatch Email & SMS"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
