"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { MOCK_INVOICES } from "@/mocks";
import {
  ChevronRight,
  Receipt,
  RotateCw,
  Calendar,
  Clock,
  Mail,
  Printer,
  CreditCard,
  Download,
  Send,
  Ban,
  Sliders,
  Check,
  CheckCircle2,
  AlertTriangle,
  Building,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
} from "lucide-react";

export function InvoiceDetail({ id }: { id: string }) {
  const invoice = MOCK_INVOICES.find((i) => i.id === id) || MOCK_INVOICES[1];
  const [status, setStatus] = useState(invoice.status);
  const [isInterstate, setIsInterstate] = useState(true);
  const [auditExpanded, setAuditExpanded] = useState(true);
  const [highlightAudit, setHighlightAudit] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("billing_error");
  const [cancelNotes, setCancelNotes] = useState("");
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  // Financial calculations
  const totalMinor = invoice.totalAmountMinor || (invoice as any).totalAmount || 176882;
  const paidMinor = invoice.paidAmountMinor || (status === "paid" ? totalMinor : 0);
  const balanceMinor = invoice.balanceMinor !== undefined ? invoice.balanceMinor : totalMinor - paidMinor;
  const taxableSubtotalMinor = invoice.subtotalMinor || 149900;
  const discountMinor = invoice.discountAmountMinor || 26100;
  const taxMinor = invoice.taxAmountMinor || 26982;

  const triggerToast = (msg: string) => {
    setBannerMsg(msg);
    setTimeout(() => setBannerMsg(null), 3500);
  };

  const handleAction = async (action: string) => {
    try {
      await fetch(`/api/invoices/${invoice.id}/${action}`, { method: "POST" });
      if (action === "confirm") setStatus("confirmed");
      if (action === "cancel") setStatus("cancelled");
      triggerToast(`Invoice ${invoice.number} successfully updated: ${action.toUpperCase()}`);
    } catch {
      if (action === "confirm") setStatus("confirmed");
      if (action === "cancel") setStatus("cancelled");
      triggerToast(`Action ${action} executed in mock environment.`);
    }
  };

  const handleConfirmCancel = () => {
    setCancelModalOpen(false);
    handleAction("cancel");
    triggerToast(`Invoice ${invoice.number} marked Void. Credit Note staged for accounting.`);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentModalOpen(false);
    setStatus("paid");
    triggerToast(`Payment of ${formatINR(balanceMinor)} recorded. Invoice marked as Paid.`);
  };

  const onHighlightLineItem = () => {
    setAuditExpanded(true);
    setHighlightAudit(true);
    setTimeout(() => setHighlightAudit(false), 1500);
    triggerToast("Calculation audit pinned for CRM Suite Starter");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation & Breadcrumb Meta Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/admin/invoices" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition">
              <Receipt className="size-3.5" />
              <span>Billing</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Link href="/admin/invoices" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Invoices
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono">{invoice.number}</span>
          </nav>

          {/* Title & Context Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
              {invoice.number}
            </h1>
            <StatusPill status={status} />

            {/* Linked Subscription Badge */}
            <Link
              href={`/admin/subscriptions/${invoice.subscriptionId || "sub_2026_0001"}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs transition"
            >
              <RotateCw className="size-3 text-indigo-600 dark:text-indigo-400" />
              <span className="font-mono font-medium">{invoice.subscriptionId?.toUpperCase() || "SUB-2026-0002"}</span>
              <span className="text-slate-400 text-[11px]">• {invoice.customerName}</span>
            </Link>

            {/* Date Tags */}
            <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pl-2 border-l border-slate-200 dark:border-slate-800">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5 text-slate-400" />
                <span>Issued: <strong className="text-slate-900 dark:text-white">{formatDate(invoice.periodStart || invoice.createdAt)}</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-slate-400" />
                <span>Due: <strong className={status !== "paid" ? "text-red-600 font-semibold" : "text-slate-900"}>{formatDate(invoice.dueDate)}</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Mail className="size-4 text-slate-500" />}
            onClick={() => triggerToast(`Invoice emailed to ${invoice.customerEmail || "customer"}`)}
          >
            Send invoice
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Printer className="size-4 text-slate-500" />}
            onClick={() => window.print()}
          >
            Print / PDF
          </Button>
          {status !== "paid" && status !== "cancelled" && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CreditCard className="size-4" />}
              onClick={() => setPaymentModalOpen(true)}
            >
              Record payment
            </Button>
          )}
          {status === "draft" && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Check className="size-4" />}
              onClick={() => handleAction("confirm")}
            >
              Confirm
            </Button>
          )}
          {status !== "cancelled" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
              leftIcon={<Ban className="size-4" />}
              onClick={() => setCancelModalOpen(true)}
            >
              Void
            </Button>
          )}
        </div>
      </div>

      {/* Toast Feedback Notification */}
      {bannerMsg && (
        <div className="p-3.5 rounded-xl bg-indigo-900 text-white shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          <span>{bannerMsg}</span>
        </div>
      )}

      {/* 2-Column Split: Printable Document (65% / 8-cols) vs Sticky Admin Actions & Audit (35% / 4-cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Realistic Printable GST Tax Invoice Document Card */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Quick Document Compliance Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                Digitally signed compliant GST Tax Invoice under Rule 46 of CGST Act. Place of supply: Maharashtra (27)
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsInterstate(!isInterstate);
                triggerToast(isInterstate ? "Switched to Intrastate CGST + SGST (9%+9%)" : "Switched to Interstate IGST (18%)");
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>{isInterstate ? "Show CGST + SGST" : "Show IGST Mode"}</span>
              <Sliders className="size-3" />
            </button>
          </div>

          {/* Main Paper Invoice Canvas */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col text-slate-900 dark:text-white relative overflow-hidden">
            {/* Top Brand Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />

            {/* Seller and Document Metadata Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2 pb-6 border-b border-slate-100 dark:border-slate-800">
              {/* Seller Identity */}
              <div className="flex flex-col max-w-sm">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
                    L
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Brightloop Software
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">Private Limited</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  702, Cyber Heights, Sector 62<br />
                  Gurugram, Haryana - 122002, India
                </p>
                <div className="flex flex-col gap-0.5 mt-2 text-xs text-slate-600 dark:text-slate-400">
                  <span><strong className="text-slate-900 dark:text-white font-medium">GSTIN:</strong> 06AAACB2026F1Z1</span>
                  <span><strong className="text-slate-900 dark:text-white font-medium">State Code:</strong> Haryana (06)</span>
                  <span><strong className="text-slate-900 dark:text-white font-medium">Email:</strong> billing@brightloop.io</span>
                </div>
              </div>

              {/* Document Meta Block */}
              <div className="flex flex-col items-start sm:items-end sm:text-right bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl sm:bg-transparent sm:p-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs uppercase font-bold tracking-wider mb-1.5">
                  <FileText className="size-3.5" />
                  <span>Tax Invoice</span>
                </div>
                <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
                  {invoice.number}
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-col gap-1.5 mt-2.5 text-xs text-slate-500 dark:text-slate-400">
                  <div>
                    <span>Invoice Date:</span>
                    <span className="font-semibold text-slate-900 dark:text-white ml-1">
                      {formatDate(invoice.periodStart || invoice.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span>Payment Due:</span>
                    <span className="font-semibold text-red-600 dark:text-red-400 ml-1">
                      {formatDate(invoice.dueDate)}
                    </span>
                  </div>
                  <div>
                    <span>Place of Supply:</span>
                    <span className="font-semibold text-slate-900 dark:text-white ml-1">Maharashtra (27)</span>
                  </div>
                  <div>
                    <span>Reverse Charge:</span>
                    <span className="font-semibold text-slate-900 dark:text-white ml-1">No</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Subscription Information Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
              {/* Billed To (Client) */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Billed To (Client)
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {invoice.customerName}
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Plot 42, Logistics Park, JNPT Road<br />
                    Navi Mumbai, Maharashtra - 400707
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col gap-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">GSTIN:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      27AABCL9876C1ZD
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">State:</span>
                    <span className="text-slate-700 dark:text-slate-300">Maharashtra (27)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Attention:</span>
                    <span className="text-slate-900 dark:text-white font-medium">Amit Deshmukh</span>
                  </div>
                </div>
              </div>

              {/* Contract & Subscription Details */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Contract &amp; Subscription
                  </span>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-mono font-bold text-slate-900 dark:text-white">
                      {invoice.subscriptionId?.toUpperCase() || "SUB-2026-0002"}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Plan: <strong className="text-slate-900 dark:text-white font-medium">CRM Suite Starter Monthly</strong> (Tier B)
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col gap-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Billing Period:</span>
                    <span className="text-slate-900 dark:text-white font-medium">
                      01 Nov 2026 – 30 Nov 2026
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Payment Method:</span>
                    <span className="text-slate-900 dark:text-white flex items-center gap-1">
                      <CreditCard className="size-3 text-indigo-600" />
                      <span>e-Mandate (HDFC ••9102)</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">PO Reference:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">PO-NL-2026-881</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Line Items Table */}
            <div className="mt-2 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Line Items &amp; Services
                </span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 italic">
                  Select line item to inspect tax calculation audit
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <th className="py-3 px-4">Item &amp; Description</th>
                      <th className="py-3 px-3">HSN/SAC</th>
                      <th className="py-3 px-2 text-center">Qty</th>
                      <th className="py-3 px-3 text-right">Unit Price</th>
                      <th className="py-3 px-3 text-right">Discount</th>
                      <th className="py-3 px-3 text-right">Taxable Val</th>
                      <th className="py-3 px-3 text-right">
                        {isInterstate ? "GST (IGST 18%)" : "CGST 9% + SGST 9%"}
                      </th>
                      <th className="py-3 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Row 1: Interactive CRM Suite item */}
                    <tr
                      onClick={onHighlightLineItem}
                      className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                              Brightloop CRM Suite — Starter Monthly
                            </span>
                            <Info className="size-3.5 text-indigo-600 opacity-60 group-hover:opacity-100 transition" />
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-medium">
                              Variant: Odoo Connector (+₹560.00)
                            </span>
                            <span className="text-[11px] text-slate-500">
                              01 Nov 2026 to 30 Nov 2026
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-500 text-xs">997331</td>
                      <td className="py-3.5 px-2 text-center font-medium">1</td>
                      <td className="py-3.5 px-3 text-right tabular-nums">₹1,760.00</td>
                      <td className="py-3.5 px-3 text-right tabular-nums text-slate-500">-₹261.00</td>
                      <td className="py-3.5 px-3 text-right tabular-nums font-medium text-slate-900 dark:text-white">
                        ₹1,499.00
                      </td>
                      <td className="py-3.5 px-3 text-right tabular-nums font-mono text-slate-700 dark:text-slate-300">
                        {isInterstate ? "₹269.82" : "₹134.91 + ₹134.91"}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums font-bold text-indigo-600 dark:text-indigo-400">
                        ₹1,768.82
                      </td>
                    </tr>

                    {/* Row 2: Secondary Platform SLA item */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            Priority Support Tier &amp; 99.9% Cloud SLA
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Automated Daily Backups &amp; REST Webhooks API
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 text-xs">998313</td>
                      <td className="py-3 px-2 text-center font-medium">1</td>
                      <td className="py-3 px-3 text-right tabular-nums">₹0.00</td>
                      <td className="py-3 px-3 text-right tabular-nums text-slate-500">₹0.00</td>
                      <td className="py-3 px-3 text-right tabular-nums text-slate-500">₹0.00</td>
                      <td className="py-3 px-3 text-right tabular-nums text-slate-500">₹0.00</td>
                      <td className="py-3 px-4 text-right tabular-nums font-semibold text-slate-600">
                        ₹0.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals & Banking Details (2 Column Grid) */}
            <div className="mt-6 pt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left: Banking Details & Declarations */}
              <div className="md:col-span-6 flex flex-col gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs">
                    <Building className="size-4 text-indigo-600" />
                    <span>Bank Transfer Details</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-xs">
                    <span className="text-slate-400">Bank Name:</span>
                    <span className="font-medium text-slate-900 dark:text-white">HDFC Bank Limited</span>
                    <span className="text-slate-400">Account Number:</span>
                    <span className="font-mono font-bold tracking-wider text-slate-900 dark:text-white">50200084729103</span>
                    <span className="text-slate-400">IFSC Code:</span>
                    <span className="font-mono text-slate-900 dark:text-white">HDFC0000128</span>
                    <span className="text-slate-400">UPI VPA:</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">brightloop@hdfcbank</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 text-slate-500 text-[11px] leading-relaxed">
                  <strong className="text-slate-700 dark:text-slate-300">Declaration:</strong> This is an electronically generated and digitally authenticated tax invoice. Subject to Gurugram (Haryana) jurisdiction. Standard payment terms: Net 10 days.
                </div>
              </div>

              {/* Right: Tax Breakdown & Final Amount */}
              <div className="md:col-span-6 flex flex-col bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 gap-2.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Taxable Subtotal</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                    {formatINR(taxableSubtotalMinor)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-amber-600 dark:text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <span>Tier Plan Discount</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                      APPLIED
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">-₹261.00</span>
                </div>

                {/* GST Mode Breakdown */}
                <div className="flex flex-col gap-1 py-1 border-t border-slate-200 dark:border-slate-700/60">
                  {isInterstate ? (
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Integrated GST (IGST 18%)</span>
                      <span className="tabular-nums font-mono text-slate-900 dark:text-white">
                        {formatINR(taxMinor)}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>Central GST (CGST 9%)</span>
                        <span className="tabular-nums font-mono text-slate-900 dark:text-white">₹134.91</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>State GST (SGST 9%)</span>
                        <span className="tabular-nums font-mono text-slate-900 dark:text-white">₹134.91</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="h-px bg-slate-200 dark:border-slate-700 my-0.5" />

                <div className="flex justify-between items-center text-base sm:text-lg">
                  <span className="font-bold text-slate-900 dark:text-white">Grand Total</span>
                  <span className="font-bold tabular-nums text-indigo-600 dark:text-indigo-400 text-xl sm:text-2xl">
                    {formatINR(totalMinor)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Amount Paid</span>
                  <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                    {formatINR(paidMinor)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 text-xs sm:text-sm">
                    Balance Due by {formatDate(invoice.dueDate)}
                  </span>
                  <span className="font-bold tabular-nums text-indigo-900 dark:text-indigo-200 text-base sm:text-lg">
                    {formatINR(balanceMinor)}
                  </span>
                </div>

                <div className="mt-1 text-right text-[11px] text-slate-500 italic">
                  Amount in words: One Thousand Seven Hundred Sixty-Eight Rupees and Eighty-Two Paise Only.
                </div>
              </div>
            </div>

            {/* Audit Hash Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-mono">
              <span>Hash: SHA256: 4f9810a9b4e13cd...</span>
              <span>LoopOS Fiscal Engine v4.2.1 • Generated at 2026-11-01T00:05:12+05:30</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Admin Control Panel & Calculations Audit (35% / 4-cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 sticky top-20">
          {/* 1. Lifecycle Status Stepper Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Invoice Lifecycle
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                Standard 10-day
              </span>
            </div>

            <div className="flex flex-col gap-4 relative">
              <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-slate-200 dark:bg-slate-800" />

              {/* Step 1: Draft (Completed) */}
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Check className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    Draft generated
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">28 Oct 2026, 18:20 IST</span>
                </div>
              </div>

              {/* Step 2: Confirmed & Dispatched */}
              <div className="flex items-start gap-3 relative z-10">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm ring-4 ${
                  status === "confirmed" || status === "paid"
                    ? "bg-indigo-600 ring-indigo-100 dark:ring-indigo-950"
                    : "bg-slate-300 dark:bg-slate-700 ring-transparent"
                }`}>
                  <Check className="size-4" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 leading-tight">
                      Confirmed &amp; Dispatched
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5">01 Nov 2026, 00:05 IST</span>
                </div>
              </div>

              {/* Step 3: Payment Settlement */}
              <div className={`flex items-start gap-3 relative z-10 ${status === "paid" ? "" : "opacity-70"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm ${
                  status === "paid" ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                }`}>
                  {status === "paid" ? <Check className="size-4" /> : <Clock className="size-4 text-slate-400" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    Payment Settlement
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    {status === "paid" ? "Settled in full" : `Pending • Due ${formatDate(invoice.dueDate)}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Operational Actions Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2.5">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Operational Actions
            </span>

            {status !== "paid" && (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                leftIcon={<CreditCard className="size-4" />}
                onClick={() => setPaymentModalOpen(true)}
              >
                Record payment manually
              </Button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Send className="size-4" />}
                onClick={() => triggerToast("Payment reminder sent to billing contact")}
              >
                Send reminder
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Download className="size-4" />}
                onClick={() => window.print()}
              >
                Download PDF
              </Button>
            </div>

            {status !== "cancelled" && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                leftIcon={<Ban className="size-4" />}
                onClick={() => setCancelModalOpen(true)}
              >
                Cancel / Void invoice
              </Button>
            )}
          </div>

          {/* 3. Distinctive Violet Expandable Card: "Why this amount? (Calculation audit)" */}
          <div
            className={`p-5 rounded-xl border transition-all duration-300 ${
              highlightAudit
                ? "bg-purple-100/90 dark:bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/30"
                : "bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/80 dark:border-purple-900/50"
            }`}
          >
            <button
              type="button"
              onClick={() => setAuditExpanded(!auditExpanded)}
              className="flex items-center justify-between text-left w-full group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-bold text-purple-900 dark:text-purple-200">
                  Why this amount?
                </span>
              </div>
              <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 text-xs font-semibold">
                <span>Audit</span>
                {auditExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </div>
            </button>
            <p className="text-xs text-purple-700/80 dark:text-purple-300/80 mt-1">
              Deterministic billing breakdown verified by LoopOS Rule Engine.
            </p>

            {auditExpanded && (
              <div className="flex flex-col gap-2.5 mt-3 pt-3 border-t border-purple-200/60 dark:border-purple-800/60 text-xs">
                {/* Step 1 */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white">1. Base CRM software license</span>
                    <span className="text-[11px] text-slate-500">Monthly seat allocation (Tier B)</span>
                  </div>
                  <span className="tabular-nums font-mono">₹1,200.00</span>
                </div>

                {/* Step 2 */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white">2. Variant Add-on: Odoo connector</span>
                    <span className="text-[11px] text-slate-500">Bidirectional ledger sync enabled</span>
                  </div>
                  <span className="tabular-nums font-mono text-indigo-600">+₹560.00</span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center px-2 py-1 rounded bg-purple-100/60 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 font-medium">
                  <span>Gross Monthly Subtotal</span>
                  <span className="tabular-nums font-bold">₹1,760.00</span>
                </div>

                {/* Step 3 */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">3. Contract Plan Adjustment</span>
                    <span className="text-[11px] text-slate-500">Subscribed via special intro tier</span>
                  </div>
                  <span className="tabular-nums font-mono text-amber-600">-₹261.00</span>
                </div>

                {/* Net Taxable Recurring Base */}
                <div className="flex justify-between items-center px-2 py-1 rounded bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800">
                  <span className="font-semibold text-slate-900 dark:text-white">Net Taxable Recurring Base</span>
                  <span className="tabular-nums font-bold text-slate-900 dark:text-white">₹1,499.00</span>
                </div>

                {/* Step 4 */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white">4. Integrated GST (IGST @ 18%)</span>
                    <span className="text-[11px] text-slate-500">State 06 (HR) to State 27 (MH)</span>
                  </div>
                  <span className="tabular-nums font-mono text-indigo-600">+₹269.82</span>
                </div>

                <div className="h-px bg-purple-200 dark:bg-purple-800/80 my-0.5" />

                <div className="flex justify-between items-center font-bold text-sm text-purple-950 dark:text-purple-100">
                  <span>Final Billed Amount</span>
                  <span className="tabular-nums text-base text-purple-600 dark:text-purple-400 font-mono">₹1,768.82</span>
                </div>
              </div>
            )}
          </div>

          {/* 4. Payment History & Dunning Status Panel */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Payment &amp; Dunning
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              }`}>
                {status === "paid" ? "Settled" : "Unpaid"}
              </span>
            </div>

            {/* Next Scheduled Action */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <RotateCw className="size-4 text-indigo-600 mt-0.5 shrink-0" />
              <div className="flex flex-col text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">Next Scheduled Auto-Debit</span>
                <span className="text-slate-500 mt-0.5">09 Nov 2026 at 06:00 IST</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                  Via Razorpay e-Mandate •••• 9102
                </span>
              </div>
            </div>

            {/* Timeline Preview */}
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Activity Log
              </span>
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-white">Email delivery confirmed</span>
                    <span className="text-[10px] text-slate-500">01 Nov 2026, 09:30 IST • to billing@novalogistics.in</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-white">Invoice generated automatically</span>
                    <span className="text-[10px] text-slate-500">01 Nov 2026, 00:05 IST • by LoopOS Billing Engine</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-white">Cycle renewal triggered</span>
                    <span className="text-[10px] text-slate-500">28 Oct 2026, 18:20 IST • SUB-2026-0002</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel / Void Invoice Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="size-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Cancel Invoice {invoice.number}?
                </h3>
                <span className="text-xs text-slate-500 mt-0.5">
                  This action will void the official tax record.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Cancelling will mark this GST Tax Invoice as <strong>Void</strong> and notify the accounts team at <strong>{invoice.customerName}</strong>. If filed with the GST portal, an automated Credit Note will be staged for reverse credit reconciliation.
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Cancellation Reason <span className="text-red-500">*</span>
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="billing_error">Billing error or incorrect plan applied</option>
                <option value="customer_requested">Customer requested cancellation / renegotiation</option>
                <option value="duplicate">Duplicate subscription cycle created</option>
                <option value="other">Other business exception</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Audit Note (Optional)
              </label>
              <input
                type="text"
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                placeholder="Reason details for compliance audit trail..."
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCancelModalOpen(false)}
              >
                Keep invoice
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleConfirmCancel}
              >
                Confirm cancellation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {paymentModalOpen && (
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
                  Invoice {invoice.number} • Balance: {formatINR(balanceMinor)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Amount to Settle</label>
                <input
                  type="text"
                  disabled
                  value={formatINR(balanceMinor)}
                  className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold tabular-nums text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Payment Method</label>
                <select className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                  <option value="bank_transfer">NEFT / RTGS</option>
                  <option value="upi">UPI Transfer</option>
                  <option value="card">Card Payment</option>
                  <option value="cheque">Cheque Deposit</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                UTR / Gateway Transaction Reference
              </label>
              <input
                type="text"
                required
                placeholder="e.g. HDFCN26305981240"
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setPaymentModalOpen(false)}
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
