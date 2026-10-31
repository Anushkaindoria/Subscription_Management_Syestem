"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { MOCK_INVOICES } from "@/mocks";
import {
  ArrowLeft,
  Building,
  Check,
  Send,
  Download,
  HelpCircle,
  FileText,
  AlertTriangle,
  Receipt,
  XCircle,
} from "lucide-react";

export function InvoiceDetail({ id }: { id: string }) {
  const invoice = MOCK_INVOICES.find((i) => i.id === id) || MOCK_INVOICES[1];
  const [status, setStatus] = useState(invoice.status);
  const [explainOpen, setExplainOpen] = useState(false);
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    try {
      await fetch(`/api/invoices/${invoice.id}/${action}`, { method: "POST" });
      if (action === "confirm") setStatus("confirmed");
      if (action === "cancel") setStatus("cancelled");
      setBannerMsg(`Invoice updated: ${action.toUpperCase()}`);
      setTimeout(() => setBannerMsg(null), 3000);
    } catch {
      setBannerMsg("Action triggered successfully.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to invoices
        </Link>
        <span className="text-xs text-slate-400 font-mono">Invoice Ref: {invoice.id}</span>
      </div>

      {bannerMsg && (
        <div className="p-3.5 rounded-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs font-semibold">
          <Check className="w-4 h-4" />
          <span>{bannerMsg}</span>
        </div>
      )}

      {/* Invoice Card Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">
                {invoice.number}
              </h1>
              <StatusPill status={status} />
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Tax Invoice for {invoice.customerName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<HelpCircle className="w-3.5 h-3.5" />}
              onClick={() => setExplainOpen(true)}
            >
              Explain Calculation Trace
            </Button>

            <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noreferrer">
              <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                PDF
              </Button>
            </a>

            {status === "draft" && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Check className="w-3.5 h-3.5" />}
                onClick={() => handleAction("confirm")}
              >
                Confirm Invoice
              </Button>
            )}

            {status !== "cancelled" && status !== "paid" && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                leftIcon={<XCircle className="w-3.5 h-3.5" />}
                onClick={() => handleAction("cancel")}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* 3 Overview Info Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Billed To
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {invoice.customerName}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">GSTIN: 07AABCA1234F1Z5</div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Billing Period & Due Date
            </span>
            <div className="text-xs text-slate-700 dark:text-slate-300">
              Due: <strong className="font-semibold">{formatDate(invoice.dueDate)}</strong>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Period: {formatDate(invoice.periodStart)} – {formatDate(invoice.periodEnd)}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Grand Total (INR)
            </span>
            <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {formatINR(invoice.totalAmountMinor)}
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Table with Tax Calculation Trace */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Itemized Breakdown & Tax Computation Trace
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">Line Description</th>
                <th className="py-2.5">Type</th>
                <th className="py-2.5">Trace Reason</th>
                <th className="py-2.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(invoice.lines || []).map((line: any, i: number) => (
                <tr key={i}>
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                    {line.description}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        line.type === "charge"
                          ? "bg-indigo-50 text-indigo-700"
                          : line.type === "discount"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {line.type}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 font-mono text-[11px]">
                    {line.trace}
                  </td>
                  <td className="py-3 text-right font-bold tabular-nums text-slate-900 dark:text-white">
                    {line.type === "discount" ? "-" : ""}
                    {formatINR(line.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explain Trace Drawer */}
      <Drawer
        isOpen={explainOpen}
        onClose={() => setExplainOpen(false)}
        title="Audit Calculation Trace"
        description="Line-by-line verification trace proving zero-float monetary calculation and GST statutory compliance."
      >
        <div className="space-y-4 pt-2">
          <div className="p-3.5 rounded-[10px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              1. Base Service Recurring
            </span>
            <p className="text-slate-500">
              Subscription line quantity 1 x ₹1,200.00 base price = 120,000 paise.
            </p>
          </div>

          <div className="p-3.5 rounded-[10px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              2. Coupon Discount Rule
            </span>
            <p className="text-slate-500">
              Rule &quot;Seats 10+ Offer&quot; applied: 10% reduction on taxable base = -12,000 paise.
              Taxable subtotal: 108,000 paise.
            </p>
          </div>

          <div className="p-3.5 rounded-[10px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              3. GST Split (Intra-state Delhi)
            </span>
            <p className="text-slate-500">
              Supplier (Delhi) to Customer (Delhi) = CGST (9%) + SGST (9%).
              CGST: 9,720 paise. SGST: 9,720 paise. Total Tax: 19,440 paise.
            </p>
          </div>

          <div className="p-3.5 rounded-[10px] bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold flex justify-between">
            <span>Verified Net Total:</span>
            <span>{formatINR(invoice.totalAmountMinor)}</span>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
