"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { MOCK_CUSTOMERS, MOCK_PRODUCTS, MOCK_PLANS } from "@/mocks";
import {
  FileSpreadsheet,
  Plus,
  Sparkles,
  Check,
  ChevronRight,
  Upload,
  Search,
  Clock,
  Layers,
  Trash2,
  GripVertical,
  Percent,
  ShieldCheck,
  Receipt,
  Copy,
  CheckCircle2,
} from "lucide-react";

export function TemplatesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [quoteSuccess, setQuoteSuccess] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(MOCK_CUSTOMERS[0].id);

  const initialTemplates = [
    {
      id: "TPL-SaaS-001",
      name: "Standard SaaS Growth Bundle",
      planName: "Business Yearly (PLAN-BZ-Y)",
      validDays: 15,
      status: "Active",
      summary: "Brightloop CRM Suite (Odoo), Extra Seats (x10), Priority Support",
      estimatedValue: 3481000,
      author: "Riya Sharma",
      updatedAt: "2h ago",
      notes: "Pre-packaged bundle for growing mid-market enterprises looking for multi-brand CRM syncing with 10 team seats and dedicated 24/7 SLA.",
      lines: [
        {
          product: "Brightloop CRM Suite",
          sku: "PRD-CRM-001",
          variant: "Odoo (+₹560.00)",
          qty: 1,
          unitPrice: 176000,
          sac: "SAC 997331",
          taxPct: 18,
        },
        {
          product: "Extra Seats Add-on",
          sku: "PRD-SEAT-004",
          variant: "Standard Seat Pool",
          qty: 10,
          unitPrice: 25000,
          sac: "SAC 997331",
          taxPct: 18,
        },
        {
          product: "Priority Support Plan",
          sku: "PRD-SUP-002",
          variant: "24/7 Dedicated Slack",
          qty: 1,
          unitPrice: 249900,
          sac: "SAC 998313",
          taxPct: 18,
        },
      ],
    },
    {
      id: "TPL-SaaS-002",
      name: "Starter Self-Serve Annual",
      planName: "Starter Monthly (PLAN-ST-M)",
      validDays: 30,
      status: "Active",
      summary: "Brightloop CRM Suite (Native), Extra Seats (x2)",
      estimatedValue: 199900,
      author: "Aman Verma",
      updatedAt: "3d ago",
      notes: "Self-serve starter bundle for small businesses.",
      lines: [
        {
          product: "Brightloop CRM Suite",
          sku: "PRD-CRM-001",
          variant: "Native LoopOS (+₹0.00)",
          qty: 1,
          unitPrice: 120000,
          sac: "SAC 997331",
          taxPct: 18,
        },
        {
          product: "Extra Seats Add-on",
          sku: "PRD-SEAT-004",
          variant: "Standard Seat Pool",
          qty: 2,
          unitPrice: 25000,
          sac: "SAC 997331",
          taxPct: 18,
        },
      ],
    },
    {
      id: "TPL-SaaS-003",
      name: "Enterprise High-Velocity Tier",
      planName: "Business Yearly (PLAN-BZ-Y)",
      validDays: 14,
      status: "Active",
      summary: "Brightloop CRM Suite (Zoho), Extra Seats (x25), 24/7 SLA",
      estimatedValue: 6850000,
      author: "Riya Sharma",
      updatedAt: "1w ago",
      notes: "Large corporate deployments with 25 seats and custom connectors.",
      lines: [
        {
          product: "Brightloop CRM Suite",
          sku: "PRD-CRM-001",
          variant: "Zoho Sync (+₹300.00)",
          qty: 1,
          unitPrice: 150000,
          sac: "SAC 997331",
          taxPct: 18,
        },
        {
          product: "Extra Seats Add-on",
          sku: "PRD-SEAT-004",
          variant: "Standard Seat Pool",
          qty: 25,
          unitPrice: 25000,
          sac: "SAC 997331",
          taxPct: 18,
        },
      ],
    },
  ];

  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const activeTemplate = templates[selectedTemplateIndex] || templates[0];

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateSubtotal = () => {
    return activeTemplate.lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  };

  const subtotal = calculateSubtotal();
  const gstAmount = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gstAmount;

  const handleDispatchQuote = () => {
    const cust = MOCK_CUSTOMERS.find((c) => c.id === selectedCustomerId);
    setQuoteSuccess(`Quotation generated for ${cust?.name}! Agreement initialized in QUOTATION state.`);
    setTimeout(() => {
      setQuoteSuccess(null);
      setModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span>Sales</span>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Quotation templates</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Quotation templates
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
              {templates.length} templates
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Preconfigure bundled software plans, default seat quotas, and statutory tax rules for rapid B2B sales cycles.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Upload className="size-4" />}
            onClick={() => alert("Import template ready.")}
          >
            Import template
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="size-4" />}
            onClick={() => {
              const newTpl = {
                id: `TPL-SaaS-00${templates.length + 1}`,
                name: "Custom Corporate Bundle",
                planName: "Business Yearly (PLAN-BZ-Y)",
                validDays: 15,
                status: "Active",
                summary: "Brightloop CRM Suite, Extra Seats (x5)",
                estimatedValue: 2450000,
                author: "Riya Sharma",
                updatedAt: "Just now",
                notes: "Tailored enterprise package.",
                lines: [
                  {
                    product: "Brightloop CRM Suite",
                    sku: "PRD-CRM-001",
                    variant: "Native LoopOS (+₹0.00)",
                    qty: 1,
                    unitPrice: 120000,
                    sac: "SAC 997331",
                    taxPct: 18,
                  },
                ],
              };
              setTemplates([...templates, newTpl]);
              setSelectedTemplateIndex(templates.length);
            }}
          >
            New template
          </Button>
        </div>
      </div>

      {/* Two-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Template Cards List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Sort by</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Recently updated</span>
            </div>
          </div>

          {/* Cards Stack */}
          <div className="space-y-3">
            {filteredTemplates.map((t, idx) => {
              const isSelected = templates.indexOf(t) === selectedTemplateIndex;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplateIndex(templates.indexOf(t))}
                  className={`p-4 rounded-xl cursor-pointer transition-all border relative overflow-hidden ${
                    isSelected
                      ? "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-500 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600" />}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {t.name}
                      </h3>
                      <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        {t.id}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {t.status}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {t.planName}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Clock className="size-3" /> Valid {t.validDays}d
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {t.summary}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Est. Value</span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatINR(t.estimatedValue)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 text-right">
                      {t.updatedAt} • {t.author}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Template Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Editor Header */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeTemplate.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  {activeTemplate.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                <span>{activeTemplate.id}</span>
                <span>•</span>
                <span className="text-slate-500">Last synced with GST Rules Engine v4.2</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Copy className="size-3.5" />}
                onClick={() => alert(`Duplicated ${activeTemplate.id}`)}
              >
                Duplicate
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Receipt className="size-3.5" />}
                onClick={() => setModalOpen(true)}
              >
                Create quotation
              </Button>
            </div>
          </div>

          {/* Section 1: General Configuration */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                General Configuration
              </h3>
              <span className="text-xs text-slate-400">Step 1 of 3</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Template Name *"
                  defaultValue={activeTemplate.name}
                />
              </div>

              <div>
                <Select
                  label="Default Target Plan *"
                  options={[
                    { value: "plan_business_yearly", label: "Business Yearly (₹14,999.00 / yr)" },
                    { value: "plan_starter_monthly", label: "Starter Monthly (₹1,499.00 / mo)" },
                    { value: "plan_team_weekly", label: "Team Weekly (₹399.00 / wk)" },
                  ]}
                  defaultValue="plan_business_yearly"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Quotation Validity Duration
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button
                      type="button"
                      className="w-7 h-7 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-bold transition flex items-center justify-center"
                      onClick={() => {
                        const next = [...templates];
                        next[selectedTemplateIndex].validDays = Math.max(1, activeTemplate.validDays - 1);
                        setTemplates(next);
                      }}
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold tabular-nums text-slate-900 dark:text-white">
                      {activeTemplate.validDays} days
                    </span>
                    <button
                      type="button"
                      className="w-7 h-7 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-bold transition flex items-center justify-center"
                      onClick={() => {
                        const next = [...templates];
                        next[selectedTemplateIndex].validDays = activeTemplate.validDays + 1;
                        setTemplates(next);
                      }}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">from generation date</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Internal Notes & Scope
                </label>
                <textarea
                  rows={2}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  defaultValue={activeTemplate.notes}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Configured Line Items */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Configured Line Items
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                  {activeTemplate.lines.length} items
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <ShieldCheck className="size-3.5" /> Auto-tax calculation SAC 997331 (18% GST)
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 w-8"></th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Variant / Add-on</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Tax (18%)</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeTemplate.lines.map((l, i) => {
                    const lineAmount = l.unitPrice * l.qty;
                    const lineTax = Math.round(lineAmount * 0.18);
                    const lineTotal = lineAmount + lineTax;
                    return (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-3 text-center cursor-grab text-slate-400">
                          <GripVertical className="size-4" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {l.product}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">
                            {l.sku}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                            {l.variant}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-bold tabular-nums">
                          {l.qty}
                        </td>
                        <td className="py-3 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300 font-mono">
                          {formatINR(l.unitPrice)}
                        </td>
                        <td className="py-3 px-3 text-right tabular-nums text-slate-500 font-mono">
                          {formatINR(lineTax)}
                        </td>
                        <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900 dark:text-white font-mono">
                          {formatINR(lineTotal)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...templates];
                              next[selectedTemplateIndex].lines.splice(i, 1);
                              setTemplates(next);
                            }}
                            className="text-slate-400 hover:text-red-500 transition p-1"
                            aria-label="Remove line"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="size-3.5" />}
              onClick={() => {
                const next = [...templates];
                next[selectedTemplateIndex].lines.push({
                  product: "Extra Seats Add-on",
                  sku: "PRD-SEAT-004",
                  variant: "Standard Seat Pool",
                  qty: 5,
                  unitPrice: 25000,
                  sac: "SAC 997331",
                  taxPct: 18,
                });
                setTemplates(next);
              }}
              className="w-full"
            >
              Add product line item
            </Button>
          </div>

          {/* Section 3: Commercial Policies & Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Percent className="size-4 text-emerald-600" />
                <span>Applied Commercial Policies</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
                <div className="font-semibold">Eligible for &apos;Seats 10+ Offer&apos;</div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  10% volume discount auto-applies when converted to quotation ledger.
                </p>
              </div>
              <div className="text-xs text-slate-400">
                GST Place of supply defaults to customer master record (IGST 18% interstate or CGST 9% + SGST 9% intrastate).
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal (Exclusive of Tax):</span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-white font-semibold">
                    {formatINR(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Statutory GST (18%):</span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-white">
                    {formatINR(gstAmount)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                  <span>Grand Total (Est.):</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                    {formatINR(grandTotal)}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                leftIcon={<Sparkles className="size-4" />}
                onClick={() => setModalOpen(true)}
                className="w-full"
              >
                Dispatch Customer Quotation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Dispatch Customer Quotation */}
      {modalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setModalOpen(false)}
          title={`Generate Quotation from ${activeTemplate.name}`}
          description="Select target customer. A new agreement will be initialized in 'QUOTATION' state ready for client review."
        >
          {quoteSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
              <span>{quoteSuccess}</span>
            </div>
          ) : (
            <div className="space-y-4">
              <Select
                label="Target Customer"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                options={MOCK_CUSTOMERS.map((c) => ({
                  value: c.id,
                  label: `${c.name} (${c.taxId || "Delhi • 07"})`,
                }))}
              />
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-slate-500 space-y-1">
                <div className="font-semibold text-slate-700 dark:text-slate-300">
                  Commercial Terms
                </div>
                <div>Validity: {activeTemplate.validDays} days from generation date.</div>
                <div>Payment Terms: Net 15 days from client confirmation.</div>
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDispatchQuote}
                  leftIcon={<Sparkles className="size-3.5" />}
                >
                  Confirm & Dispatch
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
