"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { MOCK_INVOICES, MOCK_CUSTOMERS } from "@/mocks";
import {
  Receipt,
  Search,
  Eye,
  Download,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export function PortalInvoicesList() {
  const currentCustomer = MOCK_CUSTOMERS[0];
  const customerInvoices = MOCK_INVOICES.filter(
    (i) => i.customerId === currentCustomer.id,
  );

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"upi" | "card">("upi");

  const tabs = [
    { id: "all", label: "All Invoices", count: customerInvoices.length },
    {
      id: "unpaid",
      label: "Awaiting Payment",
      count: customerInvoices.filter((i) => i.status !== "paid").length,
    },
    {
      id: "paid",
      label: "Paid",
      count: customerInvoices.filter((i) => i.status === "paid").length,
    },
  ];

  const filtered = customerInvoices.filter((inv) => {
    if (activeTab === "unpaid" && inv.status === "paid") return false;
    if (activeTab === "paid" && inv.status !== "paid") return false;
    if (
      search &&
      !inv.number.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleOpenPay = (inv: any) => {
    setSelectedInvoice(inv);
    setPaymentSuccess(false);
    setPaymentModalOpen(true);
  };

  const handlePay = async () => {
    setIsProcessing(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsProcessing(false);
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentModalOpen(false);
    }, 2000);
  };

  const columns = [
    {
      key: "number",
      header: "Invoice #",
      render: (inv: any) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Receipt className="w-3.5 h-3.5" />
          </div>
          <Link
            href={`/portal/invoices/${inv.id}`}
            className="font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {inv.number}
          </Link>
        </div>
      ),
    },
    {
      key: "period",
      header: "Billing Period",
      render: (inv: any) => (
        <span className="text-slate-600 dark:text-slate-300">
          {formatDate(inv.periodStart)} - {formatDate(inv.periodEnd)}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (inv: any) => (
        <span className="text-slate-600 dark:text-slate-300">
          {formatDate(inv.dueDate)}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Total (incl. GST)",
      render: (inv: any) => (
        <span className="font-mono font-bold text-slate-900 dark:text-white">
          {formatINR(inv.totalAmountMinor)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (inv: any) => <StatusPill status={inv.status} />,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (inv: any) => (
        <div className="flex items-center justify-end gap-2">
          {inv.status !== "paid" ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenPay(inv)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1"
            >
              Pay Now
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const blob = new Blob([`Invoice ${inv.number}\nTotal: ${formatINR(inv.totalAmountMinor)}`], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${inv.number}.txt`;
                a.click();
              }}
              title="Download Tax Invoice"
              className="p-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
            </Button>
          )}
          <Link href={`/portal/invoices/${inv.id}`}>
            <Button variant="ghost" size="sm" className="p-1.5 text-slate-500 hover:text-slate-900" title="View details">
              <Eye className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tax Invoices & Receipts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Download GST-compliant tax invoices, inspect SAC code traces, and settle outstanding balances.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search invoice number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Invoices Table */}
      <DataTable
        columns={columns}
        data={filtered}
        emptyTitle="No invoices found"
        emptyDescription="There are no billing invoices matching your selected filter."
      />

      {/* Pay Invoice Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title={`Instant Settlement for ${selectedInvoice?.number || ""}`}
      >
        {paymentSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Settlement Completed!
            </h3>
            <p className="text-xs text-slate-500">
              Tax invoice receipt has been marked as PAID and dispatched to your email.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-500">Payable Balance</span>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {selectedInvoice && formatINR(selectedInvoice.balanceMinor)}
                </div>
              </div>
              <StatusPill status={selectedInvoice?.status || "pending"} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Payment Method
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
                onClick={() => setPaymentModalOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handlePay}
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
