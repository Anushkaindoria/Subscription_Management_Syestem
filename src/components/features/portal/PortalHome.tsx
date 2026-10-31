"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { MOCK_SUBSCRIPTIONS, MOCK_INVOICES, MOCK_CUSTOMERS } from "@/mocks";
import {
  Sparkles,
  CreditCard,
  RefreshCw,
  Receipt,
  ArrowRight,
  AlertTriangle,
  Download,
  Calendar,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export function PortalHome() {
  const currentCustomer = MOCK_CUSTOMERS[0]; // Acme Retail Pvt Ltd
  const customerSubs = MOCK_SUBSCRIPTIONS.filter(
    (s) => s.customerId === currentCustomer.id && s.status === "active",
  );
  const customerInvoices = MOCK_INVOICES.filter(
    (i) => i.customerId === currentCustomer.id,
  );

  const unpaidInvoices = customerInvoices.filter((i) => i.status !== "paid");
  const totalOutstanding = unpaidInvoices.reduce(
    (acc, inv) => acc + inv.balanceMinor,
    0,
  );
  const totalMonthlyRecurring = customerSubs.reduce(
    (acc, sub) => acc + (sub.totalRecurringMinor || 0),
    0,
  );

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleOpenPay = (inv: any) => {
    setSelectedInvoice(inv);
    setPaymentSuccess(false);
    setPaymentModalOpen(true);
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsProcessing(false);
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Customer Portal
              </span>
              <span className="text-xs text-slate-300 font-mono">
                GSTIN: {currentCustomer.taxId}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentCustomer.name}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Manage your active subscription plans, download GST-compliant tax invoices, and manage online billing settlements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/portal/subscriptions">
              <Button
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
              >
                View Plans
              </Button>
            </Link>
            <Link href="/portal/invoices">
              <Button
                variant="primary"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold border-0 shadow-sm"
              >
                Billing History
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Outstanding Invoice Alert */}
      {unpaidInvoices.length > 0 && (
        <div className="rounded-[14px] bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Outstanding Invoice Awaiting Settlement
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Invoice <span className="font-mono font-bold">{unpaidInvoices[0].number}</span> for{" "}
                <span className="font-bold">{formatINR(unpaidInvoices[0].balanceMinor)}</span> is due on{" "}
                {formatDate(unpaidInvoices[0].dueDate)}.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => handleOpenPay(unpaidInvoices[0])}
            className="bg-amber-600 hover:bg-amber-500 text-white shadow-sm shrink-0"
          >
            <CreditCard className="w-4 h-4 mr-1.5" />
            Pay Now
          </Button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Active Subscriptions"
          value={customerSubs.length.toString()}
          subtext="Auto-renewing recurring plans"
          icon={<RefreshCw className="w-5 h-5 text-emerald-600" />}
        />
        <KpiCard
          label="Monthly Recurring"
          value={formatINR(totalMonthlyRecurring)}
          subtext="Base monthly billing cadence"
          icon={<Sparkles className="w-5 h-5 text-indigo-600" />}
        />
        <KpiCard
          label="Outstanding Balance"
          value={formatINR(totalOutstanding)}
          subtext={unpaidInvoices.length > 0 ? `${unpaidInvoices.length} unpaid bill` : "All invoices settled"}
          icon={<CreditCard className="w-5 h-5 text-amber-600" />}
        />
        <KpiCard
          label="Next Billing Run"
          value="01 Nov 2026"
          subtext="Net 15 credit terms"
          icon={<Calendar className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* Subscriptions Card & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Plans Summary */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              My Subscription
            </h2>
            <Link
              href="/portal/subscriptions"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {customerSubs.map((sub) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-[#121722] rounded-[14px] border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {sub.number}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {sub.planName}
                  </h3>
                </div>
                <StatusPill status={sub.status} />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                {sub.lines.map((line) => (
                  <div key={line.id} className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>{line.productName} (×{line.quantity})</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">
                      {formatINR(line.unitPrice * line.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Recurring Total</div>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatINR(sub.totalRecurringMinor || 0)}/mo
                  </div>
                </div>
                <Link href={`/portal/subscriptions/${sub.id}`}>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Invoices Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Billing Invoices
            </h2>
            <Link
              href="/portal/invoices"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All Invoices <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white dark:bg-[#121722] rounded-[14px] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {customerInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        <Link
                          href={`/portal/invoices/${inv.id}`}
                          className="hover:text-emerald-600 transition"
                        >
                          {inv.number}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(inv.periodStart)} - {formatDate(inv.periodEnd)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(inv.dueDate)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {formatINR(inv.totalAmountMinor)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusPill status={inv.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {inv.status !== "paid" ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenPay(inv)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1"
                          >
                            Pay
                          </Button>
                        ) : (
                          <Link href={`/portal/invoices/${inv.id}`}>
                            <Button variant="ghost" size="sm" className="text-xs">
                              View
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title={`Settle Invoice ${selectedInvoice?.number || ""}`}
      >
        {paymentSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Payment Successful!
            </h3>
            <p className="text-xs text-slate-500">
              Receipt generated and dispatched to {currentCustomer.email}.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-500">Amount Due</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {selectedInvoice && formatINR(selectedInvoice.balanceMinor)}
                </div>
              </div>
              <StatusPill status={selectedInvoice?.status || "pending"} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    paymentMethod === "upi"
                      ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">UPI Instant Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    paymentMethod === "card"
                      ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">Corporate Card</span>
                </button>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                onClick={() => setPaymentModalOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleProcessPayment}
                isLoading={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Pay {selectedInvoice && formatINR(selectedInvoice.balanceMinor)}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
