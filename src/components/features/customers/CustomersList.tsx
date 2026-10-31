"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusPill } from "@/components/ui/StatusPill";
import { Modal } from "@/components/ui/Modal";
import { MOCK_CUSTOMERS } from "@/mocks";
import {
  Users,
  Search,
  Plus,
  Download,
  FilterX,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  RefreshCw,
  Eye,
  MoreVertical,
  Check,
  ChevronRight,
  ShieldCheck,
  Building2,
  X,
  CreditCard,
} from "lucide-react";

interface CustomerRow {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  taxId: string;
  state: string;
  stateCode: string;
  customerCode: string;
  subscriptionPlan: string;
  subscriptionCode: string;
  totalBilledMinor: number;
  outstandingMinor: number;
  overdueDays?: number;
  lastPaymentDate: string;
  lastPaymentMethod: string;
  status: "active" | "confirmed" | "quotation" | "draft" | "closed";
}

const EXTENDED_CUSTOMERS: CustomerRow[] = [
  {
    id: "cust_acme_retail",
    name: "Acme Retail Pvt Ltd",
    company: "Acme Retail Pvt Ltd",
    email: "accounts@acmeretail.in",
    phone: "+91-98765-43210",
    taxId: "07AABCA1234F1Z5",
    state: "Delhi",
    stateCode: "07",
    customerCode: "CUST-0091",
    subscriptionPlan: "Business Yearly",
    subscriptionCode: "SUB-2026-0001",
    totalBilledMinor: 18542000,
    outstandingMinor: 0,
    lastPaymentDate: "15 Oct 2026",
    lastPaymentMethod: "RTGS • INV-2026-0042",
    status: "active",
  },
  {
    id: "cust_nova_logistics",
    name: "Nova Logistics",
    company: "Nova Logistics LLP",
    email: "billing@novalogistics.co",
    phone: "+91-98230-11223",
    taxId: "27AABCN9876K1Z2",
    state: "Maharashtra",
    stateCode: "27",
    customerCode: "CUST-0092",
    subscriptionPlan: "Starter Monthly",
    subscriptionCode: "SUB-2026-0002",
    totalBilledMinor: 2489000,
    outstandingMinor: 176882,
    overdueDays: 0,
    lastPaymentDate: "10 Oct 2026",
    lastPaymentMethod: "ICICI NetBanking",
    status: "active",
  },
  {
    id: "cust_kiran_stores",
    name: "Kiran Stores",
    company: "Kiran General Stores",
    email: "kiran@kiranstores.in",
    phone: "+91-99887-76655",
    taxId: "29AABCK5544P1Z8",
    state: "Karnataka",
    stateCode: "29",
    customerCode: "CUST-0093",
    subscriptionPlan: "Starter Monthly",
    subscriptionCode: "SUB-2026-0003",
    totalBilledMinor: 1845000,
    outstandingMinor: 176882,
    overdueDays: 12,
    lastPaymentDate: "12 Sep 2026",
    lastPaymentMethod: "UPI",
    status: "confirmed",
  },
  {
    id: "cust_zenith_edutech",
    name: "Zenith Edutech",
    company: "Zenith Technologies Inc",
    email: "finance@zenithedu.org",
    phone: "+91-97112-33445",
    taxId: "06AABCZ1122Q1Z4",
    state: "Haryana",
    stateCode: "06",
    customerCode: "CUST-0094",
    subscriptionPlan: "Business Yearly",
    subscriptionCode: "SUB-2026-0004",
    totalBilledMinor: 0,
    outstandingMinor: 0,
    lastPaymentDate: "None",
    lastPaymentMethod: "Pending Approval",
    status: "quotation",
  },
  {
    id: "cust_pixel_studio",
    name: "Pixel Studio",
    company: "Pixel Creative Lab",
    email: "hello@pixelstudio.design",
    phone: "+91-91234-56789",
    taxId: "29AABCP1122M1Z9",
    state: "Karnataka",
    stateCode: "29",
    customerCode: "CUST-0095",
    subscriptionPlan: "Team Weekly",
    subscriptionCode: "SUB-2026-0005",
    totalBilledMinor: 1240000,
    outstandingMinor: 350000,
    overdueDays: 4,
    lastPaymentDate: "05 Oct 2026",
    lastPaymentMethod: "Razorpay Card",
    status: "active",
  },
];

export function CustomersList() {
  const [customers, setCustomers] = useState<CustomerRow[]>(EXTENDED_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [sortBy, setSortBy] = useState("outstanding-desc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);

  // New Customer Form State
  const [newCust, setNewCust] = useState({
    name: "",
    email: "",
    phone: "",
    taxId: "",
    state: "Delhi",
    stateCode: "07",
    plan: "Business Yearly",
  });

  const filtered = useMemo(() => {
    return customers
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.company.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.taxId.toLowerCase().includes(search.toLowerCase()) ||
          c.customerCode.toLowerCase().includes(search.toLowerCase());

        const matchesPlan = planFilter === "ALL" || c.subscriptionPlan === planFilter;
        const matchesStatus = statusFilter === "ALL" || c.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesOverdue = !overdueOnly || c.outstandingMinor > 0;

        return matchesSearch && matchesPlan && matchesStatus && matchesOverdue;
      })
      .sort((a, b) => {
        if (sortBy === "outstanding-desc") return b.outstandingMinor - a.outstandingMinor;
        if (sortBy === "outstanding-asc") return a.outstandingMinor - b.outstandingMinor;
        if (sortBy === "billed-desc") return b.totalBilledMinor - a.totalBilledMinor;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [customers, search, planFilter, statusFilter, overdueOnly, sortBy]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetAllFilters = () => {
    setSearch("");
    setPlanFilter("ALL");
    setStatusFilter("ALL");
    setOverdueOnly(false);
    setSortBy("outstanding-desc");
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name || !newCust.email) return;

    const initials = newCust.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const created: CustomerRow = {
      id: `cust_${Date.now()}`,
      name: newCust.name,
      company: newCust.name,
      email: newCust.email,
      phone: newCust.phone || "+91-98000-00000",
      taxId: newCust.taxId || "07AAAAA0000A1Z5",
      state: newCust.state,
      stateCode: newCust.stateCode,
      customerCode: `CUST-0${Math.floor(100 + Math.random() * 900)}`,
      subscriptionPlan: newCust.plan,
      subscriptionCode: `SUB-2026-0${Math.floor(1000 + Math.random() * 9000)}`,
      totalBilledMinor: 0,
      outstandingMinor: 0,
      lastPaymentDate: "None",
      lastPaymentMethod: "New Registration",
      status: "active",
    };

    setCustomers([created, ...customers]);
    setAddCustomerModalOpen(false);
    setNewCust({
      name: "",
      email: "",
      phone: "",
      taxId: "",
      state: "Delhi",
      stateCode: "07",
      plan: "Business Yearly",
    });
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Customer,GSTIN,Plan,Total Billed,Outstanding,Status",
        ...filtered.map(
          (c) =>
            `"${c.name}","${c.taxId}","${c.subscriptionPlan}",${c.totalBilledMinor / 100},${c.outstandingMinor / 100},"${c.status}"`
        ),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customers_receivables_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="hover:text-slate-900 dark:hover:text-white transition">Sales</span>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold">Customers</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Customers
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              148 customers • 12 Enterprise
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Manage client accounts, statutory GSTIN records, subscription commitments, and receivables ledger.
          </p>
        </div>

        {/* Page Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="size-4" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddCustomerModalOpen(true)}
            leftIcon={<Plus className="size-4" />}
          >
            Add customer
          </Button>
        </div>
      </div>

      {/* KPI Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              TOTAL CLIENTS
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              148 Accounts
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                +8 this month
              </span>
              <span>98.2% retention</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ACTIVE SUBSCRIPTIONS
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <RefreshCw className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              1,284 subs
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-semibold text-[11px]">
                5 Plans
              </span>
              <span>94.1% auto-renewing</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              OUTSTANDING RECEIVABLES
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 font-mono">
              ₹6,12,450
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                37 overdue invoices
              </span>
              <span className="text-rose-600 dark:text-rose-400 font-medium">Attention needed</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              TOTAL BILLED (LTV)
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Wallet className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              ₹1,42,85,900
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Avg contract value</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">₹96,500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter & Quick Sorting Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1 max-w-xl">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, GSTIN, or billing ID... ⌘K"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-12 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[11px] font-mono shadow-sm">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Controls & Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Overdue Filter Toggle */}
            <button
              type="button"
              onClick={() => setOverdueOnly(!overdueOnly)}
              className={`h-10 px-3 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors border ${
                overdueOnly
                  ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 font-semibold"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <AlertTriangle className="size-4 text-rose-500" />
              <span>Overdue only (37)</span>
            </button>

            {/* Plan Filter Dropdown */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="h-10 px-3 pr-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All plans</option>
              <option value="Business Yearly">Business Yearly</option>
              <option value="Starter Monthly">Starter Monthly</option>
              <option value="Team Weekly">Team Weekly</option>
            </select>

            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 pr-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All statuses</option>
              <option value="active">Active</option>
              <option value="confirmed">Confirmed</option>
              <option value="quotation">Quotation</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 pr-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="outstanding-desc">Sort: Outstanding high-to-low</option>
              <option value="outstanding-asc">Sort: Outstanding low-to-high</option>
              <option value="billed-desc">Sort: Total billed high-to-low</option>
              <option value="name-asc">Sort: Company name A-Z</option>
            </select>

            {/* Reset Filters */}
            {(search || planFilter !== "ALL" || statusFilter !== "ALL" || overdueOnly) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAllFilters}
                leftIcon={<FilterX className="size-4" />}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Row */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Active filters:</span>
          {overdueOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-xs font-medium">
              Overdue: True
              <button onClick={() => setOverdueOnly(false)}>
                <X className="size-3" />
              </button>
            </span>
          )}
          {planFilter !== "ALL" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-medium">
              Plan: {planFilter}
              <button onClick={() => setPlanFilter("ALL")}>
                <X className="size-3" />
              </button>
            </span>
          )}
          {statusFilter !== "ALL" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter("ALL")}>
                <X className="size-3" />
              </button>
            </span>
          )}
          {!overdueOnly && planFilter === "ALL" && statusFilter === "ALL" && (
            <span className="text-xs text-slate-400 italic">None (Displaying all active clients)</span>
          )}
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900 dark:text-indigo-200">
            <CheckCircle2 className="size-4 text-indigo-600 dark:text-indigo-400" />
            <span>{selectedIds.length} customer{selectedIds.length > 1 ? "s" : ""} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              Clear Selection
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert(`Sending statement reminder to ${selectedIds.length} selected accounts...`)}
            >
              Send Statements
            </Button>
          </div>
        </div>
      )}

      {/* Primary Customer Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 pl-4 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3">Statutory GSTIN</th>
                <th className="py-3.5 px-3">Active Subscriptions</th>
                <th className="py-3.5 px-3 text-right">Total Billed</th>
                <th className="py-3.5 px-3 text-right">Outstanding</th>
                <th className="py-3.5 px-3">Last Payment</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 pr-4 pl-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-800 dark:text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="size-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No customers found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or clear filters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const isSelected = selectedIds.includes(c.id);
                  const initials = c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group ${
                        isSelected ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                      }`}
                    >
                      <td className="py-3.5 pl-4 pr-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(c.id)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/customers/${c.id}`}
                                className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate"
                              >
                                {c.name}
                              </Link>
                              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 rounded">
                                {c.customerCode}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 truncate">{c.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                              {c.taxId}
                            </span>
                            <span title="Verified with GSTN">
                              <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            State: {c.state} ({c.stateCode})
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-0.5 items-start">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                            1 Active • {c.subscriptionPlan}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400">
                            {c.subscriptionCode}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                          {formatINR(c.totalBilledMinor)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex flex-col items-end">
                          <span
                            className={`font-mono text-xs font-semibold ${
                              c.outstandingMinor > 0
                                ? "text-rose-600 dark:text-rose-400 font-bold"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {formatINR(c.outstandingMinor)}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {c.outstandingMinor === 0
                              ? "Settled"
                              : c.overdueDays
                              ? `Overdue ${c.overdueDays}d`
                              : "Due in 3d"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {c.lastPaymentDate}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                            {c.lastPaymentMethod}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusPill status={c.status} />
                      </td>
                      <td className="py-3.5 pr-4 pl-2 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/customers/${c.id}`}>
                            <Button variant="ghost" size="sm" leftIcon={<Eye className="size-3.5" />}>
                              View
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="p-1">
                            <MoreVertical className="size-3.5 text-slate-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={addCustomerModalOpen}
        onClose={() => setAddCustomerModalOpen(false)}
        title="Add New Customer"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Company / Legal Name *
            </label>
            <Input
              required
              placeholder="e.g. Acme Innovations Pvt Ltd"
              value={newCust.name}
              onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Billing Email *
              </label>
              <Input
                required
                type="email"
                placeholder="billing@company.in"
                value={newCust.email}
                onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <Input
                placeholder="+91 98000 00000"
                value={newCust.phone}
                onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GSTIN (Statutory)
              </label>
              <Input
                placeholder="07AABCA1234F1Z5"
                value={newCust.taxId}
                onChange={(e) => setNewCust({ ...newCust, taxId: e.target.value.toUpperCase() })}
                className="font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                State & Place of Supply
              </label>
              <select
                value={newCust.state}
                onChange={(e) => {
                  const stateMap: Record<string, string> = {
                    Delhi: "07",
                    Maharashtra: "27",
                    Karnataka: "29",
                    Haryana: "06",
                  };
                  setNewCust({
                    ...newCust,
                    state: e.target.value,
                    stateCode: stateMap[e.target.value] || "07",
                  });
                }}
                className="w-full h-10 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Delhi">Delhi (07)</option>
                <option value="Maharashtra">Maharashtra (27)</option>
                <option value="Karnataka">Karnataka (29)</option>
                <option value="Haryana">Haryana (06)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Initial Subscription Plan
            </label>
            <select
              value={newCust.plan}
              onChange={(e) => setNewCust({ ...newCust, plan: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Business Yearly">Business Yearly (₹14,999/yr)</option>
              <option value="Starter Monthly">Starter Monthly (₹1,499/mo)</option>
              <option value="Team Weekly">Team Weekly (₹499/wk)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddCustomerModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
