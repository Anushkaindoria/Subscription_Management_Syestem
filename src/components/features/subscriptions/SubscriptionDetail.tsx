"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { MOCK_SUBSCRIPTIONS } from "@/mocks";
import {
  ArrowLeft,
  ChevronRight,
  Send,
  Printer,
  Pause,
  XCircle,
  RefreshCw,
  Check,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  Plus,
  ExternalLink,
  ShieldCheck,
  Percent,
} from "lucide-react";

export function SubscriptionDetail({ id }: { id: string }) {
  const existing = MOCK_SUBSCRIPTIONS.find((s) => s.id === id) || MOCK_SUBSCRIPTIONS[0];
  const [status, setStatus] = useState<string>(existing.status);
  const [activeTab, setActiveTab] = useState<"overview" | "lines" | "invoices" | "activity">("overview");
  const [actionModal, setActionModal] = useState<string | null>(null);
  const [autoRenew, setAutoRenew] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const steps = [
    { id: "draft", label: "Draft", date: "10 Nov 2025" },
    { id: "quotation", label: "Quotation", date: "12 Nov 2025" },
    { id: "confirmed", label: "Confirmed", date: "14 Nov 2025" },
    { id: "active", label: "Active", date: "Activated 14 Nov 2025" },
    { id: "closed", label: "Closed", date: "Scheduled 2026" },
  ];

  const currentStepIdx = steps.findIndex((s) => s.id === status.toLowerCase());

  const handleTransition = async (action: string) => {
    try {
      const res = await fetch(`/api/subscriptions/${existing.id}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.data?.status) {
        setStatus(data.data.status);
      } else {
        if (action === "send_quotation") setStatus("quotation");
        if (action === "confirm") setStatus("confirmed");
        if (action === "activate") setStatus("active");
        if (action === "pause") setStatus("quotation");
        if (action === "resume") setStatus("active");
        if (action === "close") setStatus("closed");
      }
      setFeedback(`Agreement successfully updated: ${action}`);
      setTimeout(() => setFeedback(null), 3000);
      setActionModal(null);
    } catch {
      setFeedback("Failed to update status.");
    }
  };

  const lineItems: any[] = existing.lines && existing.lines.length > 0 ? existing.lines : [
    {
      id: "l1",
      productName: "Brightloop CRM Suite",
      description: "Core multi-tenant subscription engine",
      variantName: "Native",
      quantity: 1,
      unitPrice: 1499900,
      taxRate: 18,
    },
    {
      id: "l2",
      productName: "Extra Seats Add-on",
      description: "Additional user access seats",
      variantName: "Standard Seat",
      quantity: 10,
      unitPrice: 30000,
      taxRate: 18,
      discountPercent: 10,
    },
    {
      id: "l3",
      productName: "Priority 24/7 SLA Support",
      description: "Dedicated TAM assistance",
      variantName: "Enterprise SLA",
      quantity: 1,
      unitPrice: 0,
      taxRate: 18,
    },
  ];

  const recurringSubtotal = lineItems.reduce((acc, l) => acc + (l.unitPrice || 0) * (l.quantity || 1), 0);
  const discountTotal = lineItems.reduce((acc, l) => {
    if (l.discountPercent) {
      return acc + ((l.unitPrice * l.quantity * l.discountPercent) / 100);
    }
    return acc;
  }, 0);
  const netTaxable = recurringSubtotal - discountTotal;
  const igstAmount = Math.round(netTaxable * 0.18);
  const totalAnnualRecurring = netTaxable + igstAmount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation matching Stitch Screen 12-subscription-detail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/admin/subscriptions" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Sales
          </Link>
          <ChevronRight className="size-3.5 text-slate-400" />
          <Link href="/admin/subscriptions" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Subscriptions
          </Link>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
            {existing.number}
          </span>
        </nav>
        <span className="text-xs text-slate-400 font-mono">System ID: {existing.id}</span>
      </div>

      {/* Operational Feedback Notice */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-semibold">
          <Check className="size-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Agreement Header & Action Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {existing.number}
            </h1>
            <StatusPill status={status} />
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              Auto-renew {autoRenew ? "ON" : "OFF"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 mt-1.5 font-medium">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{existing.customerName}</span>
            <span>•</span>
            <span>{existing.planName || "Business Yearly Plan"}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
              <Clock className="size-3.5" />
              Next billing: {formatDate(existing.nextBillingDate)}
            </span>
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActionModal("send_quotation")}
            className="text-xs font-semibold"
            leftIcon={<Send className="size-4" />}
          >
            Send quotation
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            className="text-xs font-semibold"
            leftIcon={<Printer className="size-4" />}
          >
            Print / PDF
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActionModal("pause")}
            className="text-xs font-semibold"
            leftIcon={<Pause className="size-4" />}
          >
            Pause
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setActionModal("close")}
            className="text-xs font-semibold"
            leftIcon={<XCircle className="size-4" />}
          >
            Close
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setActionModal("renew")}
            className="text-xs font-semibold shadow-xs"
            leftIcon={<RefreshCw className="size-4" />}
          >
            Renew contract
          </Button>
        </div>
      </div>

      {/* Horizontal Lifecycle Stepper matching Stitch Screen 12-subscription-detail */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[640px]">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const isFuture = idx > currentStepIdx;

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center gap-3 ${
                    isCurrent ? "bg-indigo-50/70 dark:bg-indigo-950/40 px-3.5 py-2 rounded-xl border border-indigo-200/60 dark:border-indigo-800" : ""
                  }`}
                >
                  <div
                    className={`size-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCompleted
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                        : isCurrent
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="size-4" />
                    ) : isCurrent ? (
                      <RefreshCw className="size-4 animate-spin" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-semibold leading-tight ${
                        isCurrent
                          ? "text-indigo-600 dark:text-indigo-400 font-bold"
                          : isCompleted
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
                      {step.date}
                    </span>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 rounded-full ${
                      idx < currentStepIdx
                        ? "bg-emerald-500/70"
                        : idx === currentStepIdx
                        ? "bg-indigo-500"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Tabs Navigation Strip */}
      <div className="flex items-center gap-6 bg-white dark:bg-slate-900 px-6 rounded-[14px] border border-slate-200 dark:border-slate-800 shadow-xs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`relative py-4 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "overview"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span>Overview</span>
          {activeTab === "overview" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("lines")}
          className={`relative py-4 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "lines"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span>Contracted Lines</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
            {lineItems.length}
          </span>
          {activeTab === "lines" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("invoices")}
          className={`relative py-4 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "invoices"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span>Invoices</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
            1
          </span>
          {activeTab === "invoices" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("activity")}
          className={`relative py-4 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "activity"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span>Activity Log</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
            4
          </span>
          {activeTab === "activity" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2/3: Subscription Parameters Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[14px] p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Building2 className="size-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Subscription Parameters
                  </h2>
                </div>
                <Link
                  href={`/admin/customers/${existing.customerId || "cust-1"}`}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Customer Profile</span>
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>

              {/* Customer Identity Box */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                    AR
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {existing.customerName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      GSTIN: 07AABCA1234F1Z5
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:items-end text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Primary Contact
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Rakesh Mehta</span>
                  <span className="text-slate-500">VP Ops • rakesh@acmeretail.in</span>
                </div>
              </div>

              {/* Parameters 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Current Plan
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {existing.planName || "Business Yearly"}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ₹ 14,999.00 / year
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Contract Duration
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 block">
                    {formatDate(existing.startDate)} – {formatDate(existing.expiryDate)}
                  </span>
                  <span className="text-xs text-emerald-600 font-medium">
                    Active (365 Days remaining)
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Payment Terms
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold">
                      Net 30
                    </span>
                    <span className="text-xs text-slate-500">Grace: 7 days</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Billing Cycle
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 block">
                    Annual recurring
                  </span>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <ShieldCheck className="size-3.5" />
                    Razorpay e-Mandate Active
                  </span>
                </div>
              </div>
            </div>

            {/* Auto-renew switch toggle */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <RefreshCw className="size-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Automatic Subscription Renewal
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Invoices will automatically generate 7 days before cycle expiry
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
              </label>
            </div>
          </div>

          {/* Right 1/3: Financial Summary & Next Preview */}
          <div className="flex flex-col gap-6">
            {/* Financial Summary Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="size-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Financial Summary</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">INR (₹)</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Recurring Subtotal</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                      {formatINR(recurringSubtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Extra Seats Add-on (10)</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                      ₹3,000.00
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-emerald-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span>Seats 10+ Offer (-10%)</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        PROMO
                      </span>
                    </span>
                    <span className="font-mono">-₹300.00</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                    <span>Net Taxable Recurring</span>
                    <span className="font-mono">{formatINR(netTaxable)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Integrated GST (IGST 18%)</span>
                    <span className="font-mono">{formatINR(igstAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Annual Recurring
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {formatINR(totalAnnualRecurring)}
                  </span>
                  <span className="text-xs text-slate-400">/ billed yearly</span>
                </div>
              </div>
            </div>

            {/* Upcoming Invoice Preview Widget */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-[14px] p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Upcoming Invoice Preview
                </span>
                <span className="text-[11px] text-slate-400">In 358 days</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Target Date:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">07 Nov 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Expected Amount:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    {formatINR(totalAnnualRecurring)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Payment Method:</span>
                  <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <CreditCard className="size-3.5 text-indigo-600" />
                    HDFC Bank •••• 4219
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Check className="size-3.5" />
                  Auto-charge enabled
                </span>
                <button className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTRACTED LINES */}
      {activeTab === "lines" && (
        <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Contracted Plan Line Items
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configured products and seat addons billed recurringly.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="text-xs font-semibold shadow-xs"
              leftIcon={<Plus className="size-4" />}
            >
              Add line item
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase tracking-wider h-9">
                  <th className="px-4 py-2 rounded-l-lg">Item & Description</th>
                  <th className="px-4 py-2">Variant</th>
                  <th className="px-4 py-2 text-center">Qty</th>
                  <th className="px-4 py-2 text-right">Unit Price</th>
                  <th className="px-4 py-2 text-center">Discount</th>
                  <th className="px-4 py-2 text-center">Tax</th>
                  <th className="px-4 py-2 text-right rounded-r-lg">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {lineItems.map((line, idx) => {
                  const lineTotal = (line.unitPrice * line.quantity * (100 - (line.discountPercent || 0))) / 100;

                  return (
                    <tr key={line.id || idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {line.productName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {line.description}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                        {line.variantName || "Standard"}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono font-semibold">
                        {line.quantity}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-medium">
                        {formatINR(line.unitPrice)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {line.discountPercent ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-bold text-[10px]">
                            -{line.discountPercent}%
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center text-slate-500">
                        {line.taxRate || 18}% IGST
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {lineTotal === 0 ? (
                          <span className="text-emerald-600">Included</span>
                        ) : (
                          formatINR(lineTotal)
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-end gap-1.5 text-xs pr-4">
            <div className="flex items-center gap-8">
              <span className="text-slate-500">Taxable Subtotal:</span>
              <span className="font-mono font-semibold">{formatINR(netTaxable)}</span>
            </div>
            <div className="flex items-center gap-8">
              <span className="text-slate-500">Integrated GST (18%):</span>
              <span className="font-mono font-semibold">{formatINR(igstAmount)}</span>
            </div>
            <div className="flex items-center gap-8 text-sm font-bold text-indigo-600 dark:text-indigo-400 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>Total Annual Contract:</span>
              <span className="font-mono">{formatINR(totalAnnualRecurring)}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INVOICES */}
      {activeTab === "invoices" && (
        <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Generated Invoices for this Agreement
            </h2>
            <Link href="/admin/invoices">
              <Button variant="secondary" size="sm" className="text-xs">
                View all system invoices
              </Button>
            </Link>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
                INV
              </div>
              <div>
                <span className="font-mono font-bold text-slate-900 dark:text-white block">
                  INV-2026-0001
                </span>
                <span className="text-[11px] text-slate-400">
                  Billing cycle: 14 Nov 2025 – 14 Nov 2026
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {formatINR(totalAnnualRecurring)}
              </span>
              <StatusPill status="paid" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVITY / AUDIT TRAIL */}
      {activeTab === "activity" && (
        <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Agreement Lifecycle Audit Trail
          </h2>
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="size-2 rounded-full bg-emerald-500 mt-1.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Activated contract & scheduled auto-renewal
                </span>
                <span className="text-[11px] text-slate-400">14 Nov 2025, 10:45 AM by System</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-2 rounded-full bg-indigo-500 mt-1.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Customer approved quotation & authorized mandate
                </span>
                <span className="text-[11px] text-slate-400">13 Nov 2025, 04:20 PM by Rakesh Mehta</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-2 rounded-full bg-blue-500 mt-1.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Quotation dispatched to client email
                </span>
                <span className="text-[11px] text-slate-400">12 Nov 2025, 11:30 AM by Riya Sharma</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-2 rounded-full bg-slate-400 mt-1.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Agreement drafted from template Business Yearly
                </span>
                <span className="text-[11px] text-slate-400">10 Nov 2025, 09:15 AM by Riya Sharma</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transition Modal */}
      {actionModal && (
        <Modal
          isOpen={true}
          onClose={() => setActionModal(null)}
          title={`Confirm Contract Transition: ${actionModal.toUpperCase()}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to trigger <strong>{actionModal}</strong> for subscription contract{" "}
              <span className="font-mono font-bold text-slate-900 dark:text-white">{existing.number}</span>?
              This will update the agreement state across the modular monolith and billing engine.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="secondary" size="sm" onClick={() => setActionModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleTransition(actionModal)}>
                Confirm Transition
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
