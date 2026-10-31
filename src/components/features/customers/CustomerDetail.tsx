"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { MOCK_CUSTOMERS, MOCK_SUBSCRIPTIONS, MOCK_INVOICES } from "@/mocks";
import {
  ChevronRight,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Receipt,
  Edit,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Send,
  Users,
  Building2,
  ArrowRight,
  Download,
  Eye,
  MoreVertical,
  Check,
  Clock,
  KeyRound,
  FileText,
  CreditCard,
  FileSpreadsheet,
  Pause,
  Repeat,
  XCircle,
} from "lucide-react";

export function CustomerDetail({ customerId }: { customerId: string }) {
  const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId) || MOCK_CUSTOMERS[0];
  const [activeTab, setActiveTab] = useState<"subscriptions" | "invoices" | "payments" | "notes">("subscriptions");
  const [invited, setInvited] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [notes, setNotes] = useState([
    {
      id: "note-1",
      content:
        "Enterprise client renewed for year 2 on 15 Oct 2026. Requested custom GST breakdown annexures on quarterly review statements. Invoices to be CC'd to CFO Vikram Malhotra.",
      author: "Riya Sharma (RevOps)",
      date: "15 Oct 2026",
    },
  ]);
  const [newNote, setNewNote] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);

  const customerSubs = MOCK_SUBSCRIPTIONS.filter(
    (s) => s.customerId === customer.id || customer.id === "cust_acme_retail" || customer.id === "cust_acme"
  );
  const customerInvoices = MOCK_INVOICES.filter(
    (i) => (i.customerName || "").includes("Acme") || customer.id === "cust_acme_retail" || customer.id === "cust_acme"
  );

  const handleSendInvite = async () => {
    setSendingInvite(true);
    try {
      await fetch(`/api/customers/${customer.id}/portal-invite`, { method: "POST" });
      setInvited(true);
      setTimeout(() => setInvited(false), 3500);
    } catch {
      setInvited(true);
      setTimeout(() => setInvited(false), 3500);
    } finally {
      setSendingInvite(false);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([
      {
        id: `note-${Date.now()}`,
        content: newNote.trim(),
        author: "Riya Sharma (RevOps)",
        date: "Today, Just now",
      },
      ...notes,
    ]);
    setNewNote("");
    setShowAddNote(false);
  };

  const initials = customer.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Navigation & Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Link href="/admin/customers" className="hover:text-slate-900 dark:hover:text-white transition">
            Sales
          </Link>
          <ChevronRight className="size-3.5 text-slate-400" />
          <Link href="/admin/customers" className="hover:text-slate-900 dark:hover:text-white transition">
            Customers
          </Link>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-semibold">{customer.name}</span>
          <span className="ml-2 font-mono text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            CUST-0091
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        </div>

        {/* Quick Meta Info */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5 text-slate-400" />
            Last activity: 15 Oct 2026, 14:22 IST
          </span>
          <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700"></div>
          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
            <ShieldCheck className="size-3.5" />
            Synced via LoopOS Gateway
          </span>
        </div>
      </div>

      {/* Customer Profile Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-start gap-5 min-w-0">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xl flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800/50 shadow-sm">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                {customer.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
                <ShieldCheck className="size-3.5" />
                Enterprise Tier
              </span>
              <span className="text-xs text-slate-400">Customer since Oct 2024</span>
            </div>

            {/* Key Identifiers & Contact Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5 min-w-0">
                <ShieldCheck className="size-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  GSTIN: {customer.taxId || "07AABCA1234F1Z5"}
                </span>
                <span className="text-xs text-slate-400 font-normal">(Delhi • Intra-state)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="size-4 text-slate-400" />
                <a
                  href={`mailto:${customer.email}`}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition underline decoration-slate-300 dark:decoration-slate-700"
                >
                  {customer.email}
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="size-4 text-slate-400" />
                <a href={`tel:${customer.phone}`} className="tabular-nums hover:text-indigo-600 transition">
                  {customer.phone || "+91 98101 23456"}
                </a>
              </div>
              <div className="flex items-center gap-1.5 max-w-md truncate">
                <MapPin className="size-4 text-slate-400 shrink-0" />
                <span className="truncate" title={customer.address || undefined}>
                  {customer.address || "Plot 42, Okhla Ind. Area Phase-III, New Delhi 110020"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Downloading consolidated tax statement PDF...")}
            leftIcon={<Receipt className="size-4" />}
          >
            Statement
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Customer details edit drawer opened")}
            leftIcon={<Edit className="size-4" />}
          >
            Edit
          </Button>
          <Link href="/admin/plans">
            <Button variant="primary" size="sm" leftIcon={<Plus className="size-4" />}>
              New subscription
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Strip (4 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Subscriptions
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <RefreshCw className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              1 Active
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 truncate">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">Business Yearly</span>
              <span>• SUB-2026-0001</span>
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Billed (LTV)
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Receipt className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              ₹1,85,420.00
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="size-3.5" />
              12 invoices lifetime • 100% on-time
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Outstanding Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              ₹0.00
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              No overdue balance • In good standing
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Next Scheduled Renewal
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Calendar className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              31 Dec 2026
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-medium">
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">342 days</span>
              <span>remaining • Auto-renewal on</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Split: 8 cols Left, 4 cols Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Tabs & Detail Content) */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          {/* Tabs Navigation Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("subscriptions")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeTab === "subscriptions"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <RefreshCw className="size-4" />
                <span>Subscriptions</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold">
                  {customerSubs.length || 1}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("invoices")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeTab === "invoices"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Receipt className="size-4" />
                <span>Invoices</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
                  {customerInvoices.length || 12}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("payments")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeTab === "payments"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <CreditCard className="size-4" />
                <span>Payments</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
                  14
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("notes")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeTab === "notes"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <FileText className="size-4" />
                <span>Notes & Activity</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
                  {notes.length}
                </span>
              </button>
            </div>
          </div>

          {/* Tab 1: Subscriptions View */}
          {activeTab === "subscriptions" && (
            <div className="space-y-6">
              {/* Active Subscription Showcase Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800/60 shadow-sm relative overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">
                        Business Yearly Plan
                      </span>
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        PLAN-BZ-Y
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-400 mt-1">
                      Subscription ID: <span className="font-semibold text-slate-800 dark:text-slate-200">SUB-2026-0001</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums font-mono">
                      ₹14,999.00 <span className="text-sm font-normal text-slate-400">/ year</span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      + Add-ons subtotal ₹2,699.82/yr
                    </span>
                  </div>
                </div>

                {/* Subscription Cycle Timeline & Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-sm border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Current Period
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white mt-1 tabular-nums">
                      01 Jan 2026 – 31 Dec 2026
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5">365-day billing interval</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Next Invoicing Date
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white mt-1 tabular-nums">
                      31 Dec 2026
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                      Auto-collect via HDFC e-Mandate
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Proration & Upgrades
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white mt-1">
                      Instant seat provisioning
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5">True-up on renewal</span>
                  </div>
                </div>

                {/* Included Items and Provisioned Features */}
                <div className="py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Included Entitlements & Add-ons
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200">
                      <Users className="size-3.5 text-indigo-600" />
                      5 Base Operational Seats included
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200">
                      <RefreshCw className="size-3.5 text-purple-600" />
                      Brightloop CRM Suite (Odoo 2-Way Sync)
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200">
                      <ShieldCheck className="size-3.5 text-emerald-600" />
                      Priority 24/7 Dedicated SLA Support
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200">
                      <KeyRound className="size-3.5 text-amber-600" />
                      50,000 API Requests/month
                    </span>
                  </div>
                </div>

                {/* Lifecycle Controls & Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Pause className="size-3 text-slate-500" />
                      Pausable (Max 60d)
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Repeat className="size-3 text-indigo-500" />
                      Auto-Renewing
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <XCircle className="size-3 text-rose-500" />
                      Prorated Cancellation
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert("Viewing customer usage metrics dashboard...")}
                    >
                      View usage metrics
                    </Button>
                    <Link href={`/admin/subscriptions/${customerSubs[0]?.id || "sub_1"}`}>
                      <Button variant="primary" size="sm">
                        Manage subscription
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Invoices & Billings Table Section */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Recent Invoices & Billings
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                      12 Total
                    </span>
                  </div>
                  <Link
                    href="/admin/invoices"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    View all 12 invoices
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <th className="py-3 px-4">Invoice #</th>
                        <th className="py-3 px-4">Issue Date</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4">Plan / Description</th>
                        <th className="py-3 px-4 text-right">Amount (INR)</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                      <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                        <td className="py-3.5 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400 text-xs">
                          <Link href="/admin/invoices/inv_2026_0042" className="hover:underline">
                            INV-2026-0042
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 tabular-nums text-slate-500 text-xs">15 Oct 2026</td>
                        <td className="py-3.5 px-4 tabular-nums text-slate-500 text-xs">15 Oct 2026</td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-xs text-slate-900 dark:text-white">
                            Business Yearly (Renewal)
                          </div>
                          <div className="text-[11px] text-slate-400">Incl. 2 Additional User Seats</div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold text-slate-900 dark:text-white tabular-nums">
                          ₹17,698.82
                          <span className="block text-[10px] text-slate-400 font-normal">incl. 18% GST</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Paid
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="p-1" title="Download PDF">
                              <Download className="size-3.5 text-slate-400" />
                            </Button>
                            <Link href="/admin/invoices/inv_2026_0042">
                              <Button variant="ghost" size="sm" className="p-1" title="View details">
                                <Eye className="size-3.5 text-slate-400" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                        <td className="py-3.5 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400 text-xs">
                          <Link href="/admin/invoices/inv_2025_0812" className="hover:underline">
                            INV-2025-0812
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 tabular-nums text-slate-500 text-xs">15 Oct 2025</td>
                        <td className="py-3.5 px-4 tabular-nums text-slate-500 text-xs">15 Oct 2025</td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-xs text-slate-900 dark:text-white">
                            Business Yearly Initial Setup
                          </div>
                          <div className="text-[11px] text-slate-400">First-term annual billing</div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold text-slate-900 dark:text-white tabular-nums">
                          ₹17,698.82
                          <span className="block text-[10px] text-slate-400 font-normal">incl. 18% GST</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Paid
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="p-1" title="Download PDF">
                              <Download className="size-3.5 text-slate-400" />
                            </Button>
                            <Link href="/admin/invoices/inv_2025_0812">
                              <Button variant="ghost" size="sm" className="p-1" title="View details">
                                <Eye className="size-3.5 text-slate-400" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Recent Payment Settlement Callout */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Latest Bank Settlement:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                      UTR-HDFC00019284
                    </span>
                    <span>settled via RTGS on 15 Oct 2026 for</span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                      ₹17,698.82
                    </span>
                  </div>
                  <Link
                    href="/admin/payments"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    View transaction trail
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Invoices Tab */}
          {activeTab === "invoices" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">All Invoices & Billings</h3>
                <span className="text-xs text-slate-400">Total Billed: ₹1,85,420.00</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {customerInvoices.map((inv) => (
                  <div key={inv.id} className="py-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <Receipt className="size-4 text-indigo-600" />
                      <div>
                        <Link href={`/admin/invoices/${inv.id}`} className="font-mono font-semibold text-indigo-600 hover:underline">
                          {inv.number}
                        </Link>
                        <div className="text-xs text-slate-400">Issued: {formatDate(inv.createdAt || inv.dueDate)} • Due: {formatDate(inv.dueDate)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{formatINR(inv.totalAmountMinor)}</span>
                      <StatusPill status={inv.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Payments Tab */}
          {activeTab === "payments" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Payment Receipts & Settlements</h3>
                <span className="text-xs text-slate-400">14 Verified Transactions</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                      <Check className="size-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900 dark:text-white">RTGS / NEFT Settlement • UTR-HDFC00019284</div>
                      <div className="text-[11px] text-slate-400">15 Oct 2026, 11:30 IST • INV-2026-0042</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">₹17,698.82</span>
                    <span className="block text-[11px] text-emerald-600 font-semibold">Settled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Notes & Activity Tab */}
          {activeTab === "notes" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Internal Notes & Operations Log</h3>
                <Button variant="outline" size="sm" onClick={() => setShowAddNote(!showAddNote)}>
                  {showAddNote ? "Cancel" : "+ Add note"}
                </Button>
              </div>

              {showAddNote && (
                <form onSubmit={handleAddNote} className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <textarea
                    rows={3}
                    placeholder="Add operational update, client meeting notes, or special contract terms..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddNote(false)}>
                      Discard
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Save Note
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {notes.map((n) => (
                  <div key={n.id} className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                    <p className="italic">"{n.content}"</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-200/40 text-xs text-amber-700 dark:text-amber-400">
                      <span>Logged by {n.author}</span>
                      <span>{n.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (Metadata, Contacts, Statutory Profile) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Card 1: Customer Portal Access */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Customer Portal</h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Enabled
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Login Identifier</span>
                <span className="font-medium text-slate-900 dark:text-white truncate max-w-[180px]">
                  {customer.email}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Last Session</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium tabular-nums">
                  Today, 11:42 AM
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Origin IP</span>
                <span className="text-slate-400 font-mono text-[11px]">103.21.58.12 (Delhi, IN)</span>
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-slate-500 font-medium">Permitted Self-Service:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    Invoice PDF Download
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    Payment Receipts
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    Billing Address Edit
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendInvite}
                disabled={sendingInvite || invited}
                leftIcon={invited ? <Check className="size-4 text-emerald-500" /> : <Send className="size-4" />}
                className="w-full justify-center"
              >
                {invited ? "Magic Link Dispatched!" : sendingInvite ? "Sending..." : "Resend portal magic link"}
              </Button>
            </div>
          </div>

          {/* Card 2: Stakeholders & Contacts */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Stakeholders & Contacts</h3>
              </div>
              <button
                type="button"
                className="p-1 rounded text-slate-400 hover:text-slate-600 transition"
                title="Manage Contacts"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Primary Stakeholder */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                  VM
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      Vikram Malhotra
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase">
                      Primary
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Chief Financial Officer</span>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Phone className="size-3" /> +91 98101 23456
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Contact */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                  PS
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    Pooja Singhania
                  </span>
                  <span className="text-[11px] text-slate-500">Billing Operations Lead</span>
                  <span className="text-xs text-slate-400 mt-0.5 truncate">pooja@acmeretail.in</span>
                </div>
              </div>

              {/* Internal Account Manager */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">LoopOS Owner:</span>
                <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-medium">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    RS
                  </span>
                  <span>Riya Sharma (RevOps)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Statutory & Tax Profile (GST compliant) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="size-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Statutory & Tax Info</h3>
              </div>
              <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50 font-semibold">
                GST Active
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">GST Identification #</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {customer.taxId || "07AABCA1234F1Z5"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Permanent Account # (PAN)</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {(customer.taxId || "07AABCA1234F1Z5").slice(2, 12)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Place of Supply</span>
                <span className="font-medium text-slate-900 dark:text-white">Delhi (Code 07)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Tax Calculation Mode</span>
                <span className="font-medium text-slate-900 dark:text-white">CGST (9%) + SGST (9%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Reverse Charge (RCM)</span>
                <span className="font-medium text-slate-900 dark:text-white">No</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">SEZ / EOU Exempt</span>
                <span className="font-medium text-slate-900 dark:text-white">No (Standard Taxable)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
