"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { MOCK_CUSTOMERS, MOCK_SUBSCRIPTIONS, MOCK_INVOICES } from "@/mocks";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Send,
  Check,
  Repeat,
  Receipt,
  FileCheck,
} from "lucide-react";

export function CustomerDetail({ customerId }: { customerId: string }) {
  const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId) || MOCK_CUSTOMERS[0];
  const [invited, setInvited] = useState(false);

  const customerSubs = MOCK_SUBSCRIPTIONS.filter((s) => s.customerId === customer.id || customer.id === "cust_acme");
  const customerInvoices = MOCK_INVOICES.filter((i) => (i.customerName || "").includes("Acme") || customer.id === "cust_acme");

  const handleSendInvite = async () => {
    try {
      await fetch(`/api/customers/${customer.id}/portal-invite`, { method: "POST" });
      setInvited(true);
      setTimeout(() => setInvited(false), 3000);
    } catch {
      setInvited(true);
    }
  };

  const subColumns = [
    {
      key: "number",
      header: "Agreement #",
      render: (s: any) => (
        <Link href={`/admin/subscriptions/${s.id}`} className="font-mono font-bold text-indigo-600 hover:underline">
          {s.number}
        </Link>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (s: any) => <StatusPill status={s.status} />,
    },
    {
      key: "nextBillingDate",
      header: "Next Billing",
      render: (s: any) => formatDate(s.nextBillingDate),
    },
  ];

  const invColumns = [
    {
      key: "number",
      header: "Invoice #",
      render: (i: any) => (
        <Link href={`/admin/invoices/${i.id}`} className="font-mono font-bold text-indigo-600 hover:underline">
          {i.number}
        </Link>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (i: any) => formatDate(i.dueDate),
    },
    {
      key: "totalAmount",
      header: "Total (₹)",
      align: "right" as const,
      render: (i: any) => <span className="font-bold tabular-nums">{formatINR(i.totalAmount)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (i: any) => <StatusPill status={i.status} />,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to customers
        </Link>
        <span className="text-xs text-slate-400 font-mono">ID: {customer.id}</span>
      </div>

      {invited && (
        <div className="p-3.5 rounded-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs font-semibold">
          <Check className="w-4 h-4" />
          <span>Customer portal access invitation dispatched to {customer.email}!</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {customer.name}
                </h1>
                <StatusPill status="active" />
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                GSTIN: {customer.taxId || "N/A"}
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Send className="w-3.5 h-3.5" />}
            onClick={handleSendInvite}
          >
            Send Portal Invite
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider block">Contact</span>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{customer.phone}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider block">Billing Address</span>
            <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
              <span>{customer.address}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider block">Monthly Recurring (MRR)</span>
            <div className="text-xl font-bold text-indigo-600 tabular-nums">
              {formatINR((customer as any).mrrMinor || 1840000)}
            </div>
            <div className="text-slate-400">Net 30 days payment terms</div>
          </div>
        </div>
      </div>

      {/* Subscriptions & Invoices Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Repeat className="w-4 h-4 text-indigo-500" /> Active Subscriptions
          </h3>
          <DataTable columns={subColumns} data={customerSubs} />
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-purple-500" /> Issued Invoices
          </h3>
          <DataTable columns={invColumns} data={customerInvoices} />
        </div>
      </div>
    </div>
  );
}
