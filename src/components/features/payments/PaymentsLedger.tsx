"use client";

import React, { useState } from "react";
import { formatINR, formatDate } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusPill } from "@/components/ui/StatusPill";
import { MOCK_INVOICES } from "@/mocks";
import { CreditCard, Plus, CheckCircle, Search, Landmark, Smartphone, Banknote } from "lucide-react";

export function PaymentsLedger() {
  const [modalOpen, setModalOpen] = useState(false);
  const [methodFilter, setMethodFilter] = useState("all");
  const [success, setSuccess] = useState<string | null>(null);

  const [payments, setPayments] = useState([
    {
      id: "pay_001",
      invoiceNumber: "INV-2026-0042",
      customerName: "Acme Retail Pvt Ltd",
      method: "bank_transfer",
      amountMinor: 149900,
      paidOn: "2026-10-15",
      note: "NEFT ref: N2026101594821",
    },
    {
      id: "pay_002",
      invoiceNumber: "INV-2026-0041",
      customerName: "Nova Logistics",
      method: "upi",
      amountMinor: 1499900,
      paidOn: "2026-10-14",
      note: "UPI transaction: 628491028@okaxis",
    },
    {
      id: "pay_003",
      invoiceNumber: "INV-2026-0040",
      customerName: "Pixel Studio",
      method: "card",
      amountMinor: 39900,
      paidOn: "2026-10-12",
      note: "Visa ending in 4242",
    },
  ]);

  const [formState, setFormState] = useState({
    invoiceId: MOCK_INVOICES[0].id,
    method: "bank_transfer",
    amount: 149900,
    paidOn: "2026-10-31",
    note: "",
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const inv = MOCK_INVOICES.find((i) => i.id === formState.invoiceId) || MOCK_INVOICES[0];
    const newPay = {
      id: `pay_${Date.now()}`,
      invoiceNumber: inv.number,
      customerName: inv.customerName || "Customer",
      method: formState.method,
      amountMinor: formState.amount,
      paidOn: formState.paidOn,
      note: formState.note || "Recorded via admin console",
    };
    setPayments([newPay, ...payments]);
    setSuccess(`Payment of ${formatINR(newPay.amountMinor)} recorded successfully!`);
    setTimeout(() => {
      setSuccess(null);
      setModalOpen(false);
    }, 1500);
  };

  const filtered = payments.filter((p) => {
    if (methodFilter !== "all" && p.method !== methodFilter) return false;
    return true;
  });

  const columns = [
    {
      key: "id",
      header: "Payment Ref",
      render: (p: any) => (
        <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
          {p.id}
        </span>
      ),
    },
    {
      key: "invoiceNumber",
      header: "Settled Invoice",
      render: (p: any) => (
        <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
          {p.invoiceNumber}
        </span>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      render: (p: any) => (
        <span className="font-semibold text-slate-900 dark:text-white">
          {p.customerName}
        </span>
      ),
    },
    {
      key: "method",
      header: "Payment Method",
      render: (p: any) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
          {p.method === "bank_transfer" && <Landmark className="w-3.5 h-3.5" />}
          {p.method === "upi" && <Smartphone className="w-3.5 h-3.5" />}
          {p.method === "card" && <CreditCard className="w-3.5 h-3.5" />}
          {p.method.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "paidOn",
      header: "Payment Date",
      render: (p: any) => formatDate(p.paidOn),
    },
    {
      key: "amountMinor",
      header: "Amount Paid",
      align: "right" as const,
      render: (p: any) => (
        <span className="font-bold tabular-nums text-emerald-600">
          {formatINR(p.amountMinor)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Payments Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Multi-mode payment records, bank transfers, UPI transactions, and invoice auto-reconciliation.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
        >
          Record Payment
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {["all", "bank_transfer", "upi", "card", "cash"].map((m) => (
          <button
            key={m}
            onClick={() => setMethodFilter(m)}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold capitalize transition ${
              methodFilter === m
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            {m === "all" ? "All Channels" : m.replace("_", " ")}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyTitle="No payments recorded"
        emptyDescription="Record a payment to settle confirmed invoices."
      />

      {/* Record Payment Modal */}
      {modalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setModalOpen(false)}
          title="Record Received Payment"
          description="Record multi-channel payment to automatically reconcile customer invoice balance."
        >
          {success ? (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{success}</span>
            </div>
          ) : (
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <Select
                label="Target Invoice"
                value={formState.invoiceId}
                onChange={(e) => setFormState({ ...formState, invoiceId: e.target.value })}
                options={MOCK_INVOICES.map((i) => ({
                  value: i.id,
                  label: `${i.number} - ${i.customerName || "Customer"} (${formatINR(i.totalAmountMinor)})`,
                }))}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Payment Channel"
                  value={formState.method}
                  onChange={(e) => setFormState({ ...formState, method: e.target.value })}
                  options={[
                    { value: "bank_transfer", label: "Bank Transfer (NEFT/RTGS)" },
                    { value: "upi", label: "UPI Instant Transfer" },
                    { value: "card", label: "Credit/Debit Card" },
                    { value: "cash", label: "Cash Receipt" },
                    { value: "cheque", label: "Cheque / Demand Draft" },
                  ]}
                />

                <Input
                  label="Amount (in Paise)"
                  type="number"
                  value={formState.amount}
                  onChange={(e) => setFormState({ ...formState, amount: Number(e.target.value) })}
                  helperText="149900 = ₹1,499.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Payment Date"
                  type="date"
                  value={formState.paidOn}
                  onChange={(e) => setFormState({ ...formState, paidOn: e.target.value })}
                />
                <Input
                  label="Transaction / Reference Note"
                  placeholder="e.g. UTR / Cheque # 120938"
                  value={formState.note}
                  onChange={(e) => setFormState({ ...formState, note: e.target.value })}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" size="sm" type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Record & Reconcile
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
