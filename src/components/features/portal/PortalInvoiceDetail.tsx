"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatINR, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_INVOICES, MOCK_CUSTOMERS, MOCK_SETTINGS } from "@/mocks";
import {
  ArrowLeft,
  Download,
  CreditCard,
  Building2,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Info,
} from "lucide-react";

export function PortalInvoiceDetail() {
  const params = useParams();
  const invoiceId = params?.id as string;

  const currentCustomer = MOCK_CUSTOMERS[0];
  const invoice = MOCK_INVOICES.find(
    (i) => i.id === invoiceId && i.customerId === currentCustomer.id,
  );

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"upi" | "card">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>(
    invoice?.status || "confirmed",
  );

  if (!invoice) {
    return (
      <div className="space-y-6">
        <Link
          href="/portal/invoices"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Invoices
        </Link>
        <EmptyState
          title="Invoice not found"
          description="The requested tax invoice could not be located or does not belong to your account."
        />
      </div>
    );
  }

  const handlePayNow = async () => {
    setIsProcessing(true);
    await new Promise((res) => setTimeout(res, 850));
    setIsProcessing(false);
    setIsPaidSuccess(true);
    setCurrentStatus("paid");
    setTimeout(() => {
      setPayModalOpen(false);
    }, 2200);
  };

  const handleDownloadPdf = () => {
    const content = `
TAX INVOICE - ${invoice.number}
==========================================
Seller: ${MOCK_SETTINGS.companyName}
GSTIN: ${MOCK_SETTINGS.gstinTaxId}
Address: ${MOCK_SETTINGS.companyAddress}

Buyer: ${currentCustomer.name}
GSTIN: ${currentCustomer.taxId}
Address: ${currentCustomer.address}

Period: ${formatDate(invoice.periodStart)} to ${formatDate(invoice.periodEnd)}
Due Date: ${formatDate(invoice.dueDate)}
Status: ${currentStatus.toUpperCase()}

ITEMS:
${invoice.lines
  .map(
    (l) =>
      `- ${l.description} (x${l.quantity}): ${formatINR(l.amountMinor)}`,
  )
  .join("\n")}

Subtotal: ${formatINR(invoice.subtotalMinor)}
Tax (GST): ${formatINR(invoice.taxAmountMinor)}
Grand Total: ${formatINR(invoice.totalAmountMinor)}
Paid: ${currentStatus === "paid" ? formatINR(invoice.totalAmountMinor) : formatINR(invoice.paidAmountMinor)}
Balance Due: ${currentStatus === "paid" ? "₹0.00" : formatINR(invoice.balanceMinor)}
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.number}.txt`;
    a.click();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/portal/invoices"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Invoices
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {invoice.number}
            </h1>
            <StatusPill status={currentStatus} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generated on {formatDate(invoice.createdAt)} • Due on {formatDate(invoice.dueDate)}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download PDF
          </Button>

          {currentStatus !== "paid" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsPaidSuccess(false);
                setPayModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              Pay Now ({formatINR(invoice.balanceMinor)})
            </Button>
          )}
        </div>
      </div>

      {/* Tax Invoice Document Box */}
      <div className="bg-white dark:bg-[#121722] rounded-[16px] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-8">
        {/* Entity Parties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Billed By (Seller)
            </span>
            <div className="space-y-1 text-xs">
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                {MOCK_SETTINGS.companyName}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {MOCK_SETTINGS.companyAddress}
              </div>
              <div className="text-slate-700 dark:text-slate-300 font-mono font-semibold pt-1">
                GSTIN: {MOCK_SETTINGS.gstinTaxId}
              </div>
              <div className="text-slate-500">{MOCK_SETTINGS.supportEmail}</div>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Billed To (Customer)
            </span>
            <div className="space-y-1 text-xs">
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                {currentCustomer.name}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {currentCustomer.address}
              </div>
              <div className="text-slate-700 dark:text-slate-300 font-mono font-semibold pt-1">
                GSTIN: {currentCustomer.taxId}
              </div>
              <div className="text-slate-500">{currentCustomer.email}</div>
            </div>
          </div>
        </div>

        {/* Invoice Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">Billing Period</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Due Date</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(invoice.dueDate)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Payment Terms</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Net 15 Days
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Place of Supply</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              07 - Delhi (Inter-state)
            </span>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Line Item Description</th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Rate</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoice.lines.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {l.description}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {l.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {l.quantity}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                    {formatINR(l.unitPrice)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatINR(l.amountMinor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Totals */}
        <div className="flex flex-col sm:flex-row justify-between items-start pt-4 gap-6">
          <div className="text-xs text-slate-500 max-w-sm space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>GST Compliance Certificate</span>
            </div>
            <p>
              Inter-state supply: IGST @ 18% charged under Section 5(1) of the IGST Act, 2017. Input tax credit is available to registered recipient.
            </p>
          </div>

          <div className="w-full sm:w-80 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                {formatINR(invoice.subtotalMinor)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>IGST (18%):</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                {formatINR(invoice.taxAmountMinor)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
              <span>Grand Total:</span>
              <span className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400">
                {formatINR(invoice.totalAmountMinor)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 pt-1">
              <span>Amount Paid:</span>
              <span className="font-mono">
                {currentStatus === "paid" ? formatINR(invoice.totalAmountMinor) : formatINR(invoice.paidAmountMinor)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
              <span>Balance Due:</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">
                {currentStatus === "paid" ? "₹0.00" : formatINR(invoice.balanceMinor)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title={`Settle Tax Invoice ${invoice.number}`}
      >
        {isPaidSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Payment Completed!
            </h3>
            <p className="text-xs text-slate-500">
              This invoice is now marked as PAID. A receipt has been dispatched to {currentCustomer.email}.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-500">Payable Amount</span>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatINR(invoice.balanceMinor)}
                </div>
              </div>
              <StatusPill status={currentStatus} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Payment Channel
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMode("upi")}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                    paymentMode === "upi"
                      ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">UPI Auto-Collect</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode("card")}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                    paymentMode === "card"
                      ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">Corporate Card</span>
                </button>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                onClick={() => setPayModalOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handlePayNow}
                isLoading={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Pay {formatINR(invoice.balanceMinor)}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
