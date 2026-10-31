"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { MOCK_INVOICES } from "@/mocks";
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Search,
  Landmark,
  Smartphone,
  Banknote,
  Download,
  Wallet,
  Clock,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Copy,
  ExternalLink,
  MoreVertical,
  Check,
  Calendar,
} from "lucide-react";

interface PaymentItem {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerGstin: string;
  customerInitials: string;
  method: "bank_transfer" | "upi" | "card" | "cheque";
  methodLabel: string;
  amountMinor: number;
  paidOn: string;
  utr: string;
  note: string;
  recordedBy: { name: string; initials: string; isBot?: boolean };
  status: "reconciled" | "pending";
}

export function PaymentsLedger() {
  const [modalOpen, setModalOpen] = useState(false);
  const [methodFilter, setMethodFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [recent24hOnly, setRecent24hOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [payments, setPayments] = useState<PaymentItem[]>([
    {
      id: "PAY-2026-0891",
      invoiceId: "inv_2026_0042",
      invoiceNumber: "INV-2026-0042",
      customerName: "Acme Retail Pvt Ltd",
      customerGstin: "07AABCA1234F1Z5",
      customerInitials: "AR",
      method: "bank_transfer",
      methodLabel: "NEFT/RTGS HDFC-4219",
      amountMinor: 1769882,
      paidOn: "01 Nov 2026, 11:20 AM",
      utr: "HDFCN26305981240",
      note: "Annual contract settlement",
      recordedBy: { name: "Riya Sharma", initials: "RS" },
      status: "reconciled",
    },
    {
      id: "PAY-2026-0890",
      invoiceId: "inv_2026_0043",
      invoiceNumber: "INV-2026-0043",
      customerName: "Nova Logistics",
      customerGstin: "27AABCL9876C1ZD",
      customerInitials: "NL",
      method: "upi",
      methodLabel: "UPI (@okhdfcbank)",
      amountMinor: 176882,
      paidOn: "01 Nov 2026, 09:45 AM",
      utr: "430611892011",
      note: "UPI Ref verified",
      recordedBy: { name: "Neha Kapoor", initials: "NK" },
      status: "reconciled",
    },
    {
      id: "PAY-2026-0889",
      invoiceId: "inv_2026_0038",
      invoiceNumber: "INV-2026-0038",
      customerName: "Bharat Agro Supply",
      customerGstin: "GST Exemption / SEZ",
      customerInitials: "BA",
      method: "card",
      methodLabel: "Razorpay •••• 8821",
      amountMinor: 249900,
      paidOn: "31 Oct 2026, 04:15 PM",
      utr: "pay_OcM9zKx119L",
      note: "Auto-debit recurring cycle",
      recordedBy: { name: "System Cron", initials: "SC", isBot: true },
      status: "reconciled",
    },
    {
      id: "PAY-2026-0888",
      invoiceId: "inv_2026_0035",
      invoiceNumber: "INV-2026-0035",
      customerName: "Zenith Edutech",
      customerGstin: "29AABCZ5512B1ZX",
      customerInitials: "ZE",
      method: "bank_transfer",
      methodLabel: "IMPS Axis-9941",
      amountMinor: 4499700,
      paidOn: "30 Oct 2026, 02:30 PM",
      utr: "AXISP202610309928",
      note: "Advance payment invoice #35",
      recordedBy: { name: "Riya Sharma", initials: "RS" },
      status: "reconciled",
    },
  ]);

  const [formState, setFormState] = useState<{
    invoiceId: string;
    method: "bank_transfer" | "upi" | "card" | "cheque";
    amountMinor: number;
    paidOn: string;
    utr: string;
    note: string;
  }>({
    invoiceId: MOCK_INVOICES[0]?.id || "inv_2026_0042",
    method: "bank_transfer",
    amountMinor: 176882,
    paidOn: "2026-11-01",
    utr: "",
    note: "",
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const inv = MOCK_INVOICES.find((i) => i.id === formState.invoiceId) || MOCK_INVOICES[0];
    const newPay: PaymentItem = {
      id: `PAY-2026-089${payments.length + 2}`,
      invoiceId: inv?.id || "inv_custom",
      invoiceNumber: inv?.number || "INV-2026-0044",
      customerName: inv?.customerName || "Customer",
      customerGstin: "27AABCL9876C1ZD",
      customerInitials: (inv?.customerName || "CU").slice(0, 2).toUpperCase(),
      method: formState.method,
      methodLabel: formState.method === "upi" ? "UPI (@okhdfcbank)" : formState.method === "card" ? "Card Payment" : "NEFT/RTGS HDFC",
      amountMinor: formState.amountMinor,
      paidOn: "Just now",
      utr: formState.utr || `TXN${Date.now().toString().slice(-8)}`,
      note: formState.note || "Recorded via admin console",
      recordedBy: { name: "Riya Sharma", initials: "RS" },
      status: "reconciled",
    };
    setPayments([newPay, ...payments]);
    setSuccess(`Payment of ${formatINR(newPay.amountMinor)} recorded successfully!`);
    setTimeout(() => {
      setSuccess(null);
      setModalOpen(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedUtr(text);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (methodFilter !== "all" && p.method !== methodFilter) return false;
      if (recent24hOnly && !p.paidOn.includes("01 Nov") && !p.paidOn.includes("Just now")) return false;
      if (search) {
        const q = search.toLowerCase();
        const matchesId = p.id.toLowerCase().includes(q);
        const matchesInv = p.invoiceNumber.toLowerCase().includes(q);
        const matchesCust = p.customerName.toLowerCase().includes(q);
        const matchesUtr = p.utr.toLowerCase().includes(q);
        if (!matchesId && !matchesInv && !matchesCust && !matchesUtr) return false;
      }
      return true;
    });
  }, [payments, methodFilter, recent24hOnly, search]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section with Breadcrumbs and Main Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/admin/invoices" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Billing
            </Link>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-medium">Payments</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Payments
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              842 Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track collections, record offline and gateway settlements, and reconcile invoice balances.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="size-4 text-slate-500" />}
          >
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="size-4" />}
            onClick={() => setModalOpen(true)}
          >
            Record payment
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Collected this month */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Collected this month
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Wallet className="size-4" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl sm:text-3xl font-bold tabular-nums text-slate-900 dark:text-white tracking-tight">
              ₹ 24,56,300<span className="text-sm font-normal text-slate-400">.00</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                +12.4%
              </span>
              <span className="text-xs text-slate-500">vs last month (312 txns)</span>
            </div>
          </div>
          {/* Progress accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
            <div className="h-full bg-indigo-600" style={{ width: "78%" }} />
          </div>
        </div>

        {/* Card 2: Outstanding balance */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Outstanding balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl sm:text-3xl font-bold tabular-nums text-slate-900 dark:text-white tracking-tight">
              ₹ 6,12,450<span className="text-sm font-normal text-slate-400">.00</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                64 invoices
              </span>
              <span className="text-xs text-slate-500">pending settlement</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
            <div className="h-full bg-purple-600" style={{ width: "32%" }} />
          </div>
        </div>

        {/* Card 3: Overdue balance */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Overdue balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl sm:text-3xl font-bold tabular-nums text-red-600 dark:text-red-400 tracking-tight">
              ₹ 1,84,320<span className="text-sm font-normal text-slate-400">.00</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                37 accounts
              </span>
              <span className="text-xs text-slate-500">requiring automated dunning</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
            <div className="h-full bg-red-600" style={{ width: "14%" }} />
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transaction ref, invoice, customer, UTR..."
            className="w-full pl-9 pr-12 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 text-[10px] font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Method Filter */}
          <div className="relative">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="h-9 px-3 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="all">Method: All methods</option>
              <option value="bank_transfer">Method: NEFT / RTGS</option>
              <option value="upi">Method: UPI</option>
              <option value="card">Method: Card / Gateway</option>
            </select>
            <ChevronDown className="size-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Quick 24h Filter Toggle */}
          <button
            type="button"
            onClick={() => setRecent24hOnly(!recent24hOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              recent24hOnly
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Clock className="size-3.5" />
            <span>Recent 24h</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">18</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Payments Data Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200 dark:border-slate-800 select-none">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Payment ID &amp; Date</th>
                <th className="py-3 px-4">Invoice</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4">UTR / Reference</th>
                <th className="py-3 px-4">Recorded by</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal">
              {filtered.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-indigo-50/50 dark:bg-indigo-950/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(p.id)}
                        className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {p.id}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5">{p.paidOn}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/invoices/${p.invoiceId}`}
                        className="font-mono font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>{p.invoiceNumber}</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {p.customerInitials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-900 dark:text-white truncate">
                            {p.customerName}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {p.customerGstin}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                        {p.method === "bank_transfer" && <Landmark className="size-3 text-indigo-600" />}
                        {p.method === "upi" && <Smartphone className="size-3 text-purple-600" />}
                        {p.method === "card" && <CreditCard className="size-3 text-emerald-600" />}
                        {p.method === "cheque" && <Banknote className="size-3 text-amber-600" />}
                        <span>{p.methodLabel}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold tabular-nums text-slate-900 dark:text-white text-sm">
                      {formatINR(p.amountMinor)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => copyToClipboard(p.utr)}
                        className="inline-flex items-center gap-1.5 group cursor-pointer bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs font-mono"
                        title="Click to copy UTR"
                      >
                        <span className="text-slate-800 dark:text-slate-200">{p.utr}</span>
                        {copiedUtr === p.utr ? (
                          <Check className="size-3 text-emerald-600" />
                        ) : (
                          <Copy className="size-3 text-slate-400 group-hover:text-slate-700 transition" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{p.note}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {p.recordedBy.initials}
                        </div>
                        <span className="text-xs text-slate-700 dark:text-slate-300">
                          {p.recordedBy.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusPill status="reconciled" />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Button variant="ghost" size="sm" className="p-1">
                        <MoreVertical className="size-4 text-slate-400" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <form
            onSubmit={handleRecordPayment}
            className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <CreditCard className="size-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Record Manual Payment
                </h3>
                <span className="text-xs text-slate-500 mt-0.5">
                  Reconcile offline bank transfer, UPI or gateway settlement against tax invoices
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Invoice to Settle <span className="text-red-500">*</span>
              </label>
              <select
                value={formState.invoiceId}
                onChange={(e) => setFormState({ ...formState, invoiceId: e.target.value })}
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {MOCK_INVOICES.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.number} — {inv.customerName} ({formatINR(inv.totalAmountMinor || (inv as any).totalAmount || 0)})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Payment Method
                </label>
                <select
                  value={formState.method}
                  onChange={(e) => setFormState({ ...formState, method: e.target.value as any })}
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="bank_transfer">NEFT / RTGS</option>
                  <option value="upi">UPI Transfer</option>
                  <option value="card">Card / Gateway</option>
                  <option value="cheque">Cheque Deposit</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Amount in Paise / Minor Units
                </label>
                <input
                  type="number"
                  value={formState.amountMinor}
                  onChange={(e) => setFormState({ ...formState, amountMinor: Number(e.target.value) })}
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                UTR / Reference Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formState.utr}
                onChange={(e) => setFormState({ ...formState, utr: e.target.value })}
                placeholder="e.g. HDFCN26305981240"
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Settlement Notes (Optional)
              </label>
              <input
                type="text"
                value={formState.note}
                onChange={(e) => setFormState({ ...formState, note: e.target.value })}
                placeholder="Internal audit notes..."
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
              >
                Confirm Settlement
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
