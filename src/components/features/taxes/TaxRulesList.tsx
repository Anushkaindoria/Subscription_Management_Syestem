"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Percent,
  Plus,
  Check,
  ShieldCheck,
  ChevronRight,
  Shield,
  ArrowRight,
  Code,
  Building,
  Search,
  BookOpen,
  Edit2,
  Receipt,
  X,
  FileCheck,
} from "lucide-react";

interface TaxRule {
  id: string;
  name: string;
  description: string;
  sacCode: string;
  ratePercent: number;
  type: "IGST" | "CGST+SGST" | "Zero";
  typeLabel: string;
  appliesTo: string;
  placeOfSupply: string;
  status: "active" | "deprecated";
  rcm: boolean;
}

const INITIAL_TAX_RULES: TaxRule[] = [
  {
    id: "tax-1",
    name: "Standard Software GST (Inter-state)",
    description: "Default cloud software SaaS tier",
    sacCode: "SAC 997331",
    ratePercent: 18.0,
    type: "IGST",
    typeLabel: "IGST (18%)",
    appliesTo: "All SaaS & Add-ons",
    placeOfSupply: "Out-of-state (Rest of India)",
    status: "active",
    rcm: false,
  },
  {
    id: "tax-2",
    name: "Standard Software GST (Intra-state)",
    description: "Dual equal component split",
    sacCode: "SAC 997331",
    ratePercent: 18.0,
    type: "CGST+SGST",
    typeLabel: "CGST 9% + SGST 9%",
    appliesTo: "All SaaS & Add-ons",
    placeOfSupply: "Haryana (Same State 06)",
    status: "active",
    rcm: false,
  },
  {
    id: "tax-3",
    name: "Implementation & Custom Training",
    description: "Onboarding and migration services",
    sacCode: "SAC 998313",
    ratePercent: 18.0,
    type: "CGST+SGST",
    typeLabel: "GST (18%)",
    appliesTo: "Professional Services",
    placeOfSupply: "Place of performance",
    status: "active",
    rcm: false,
  },
  {
    id: "tax-4",
    name: "Export & SEZ Zero-Rated Supply",
    description: "Letter of Undertaking (LUT) under Section 16",
    sacCode: "SAC 997331",
    ratePercent: 0.0,
    type: "Zero",
    typeLabel: "Zero-rated / LUT",
    appliesTo: "Overseas clients (LUT Filed)",
    placeOfSupply: "Outside India / SEZ Unit",
    status: "active",
    rcm: false,
  },
  {
    id: "tax-5",
    name: "Legacy Hardware Terminal Tax",
    description: "Replaced by Software v4 terminal",
    sacCode: "HSN 8471",
    ratePercent: 12.0,
    type: "CGST+SGST",
    typeLabel: "CGST 6% + SGST 6%",
    appliesTo: "POS Terminals",
    placeOfSupply: "Hardware Depot",
    status: "deprecated",
    rcm: false,
  },
];

export function TaxRulesList() {
  const [rules, setRules] = useState<TaxRule[]>(INITIAL_TAX_RULES);
  const [selectedRule, setSelectedRule] = useState<TaxRule>(INITIAL_TAX_RULES[1]);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [ruleName, setRuleName] = useState(selectedRule.name);
  const [sacCode, setSacCode] = useState(selectedRule.sacCode);
  const [ratePercent, setRatePercent] = useState(selectedRule.ratePercent);
  const [taxType, setTaxType] = useState<"CGST+SGST" | "IGST" | "Zero">(selectedRule.type);
  const [rcm, setRcm] = useState(selectedRule.rcm);

  const handleSelectRule = (rule: TaxRule) => {
    setSelectedRule(rule);
    setRuleName(rule.name);
    setSacCode(rule.sacCode);
    setRatePercent(rule.ratePercent);
    setTaxType(rule.type);
    setRcm(rule.rcm);
    setDrawerOpen(true);
  };

  const handleOpenNew = () => {
    const brandNew: TaxRule = {
      id: `tax-${Date.now()}`,
      name: "New Custom Tax Rule",
      description: "Custom tax breakdown rule",
      sacCode: "SAC 997331",
      ratePercent: 18.0,
      type: "IGST",
      typeLabel: "IGST (18%)",
      appliesTo: "All software products",
      placeOfSupply: "Pan-India",
      status: "active",
      rcm: false,
    };
    setSelectedRule(brandNew);
    setRuleName(brandNew.name);
    setSacCode(brandNew.sacCode);
    setRatePercent(brandNew.ratePercent);
    setTaxType(brandNew.type);
    setRcm(false);
    setDrawerOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: TaxRule = {
      ...selectedRule,
      name: ruleName,
      sacCode: sacCode,
      ratePercent: Number(ratePercent),
      type: taxType,
      typeLabel:
        taxType === "CGST+SGST"
          ? `CGST ${ratePercent / 2}% + SGST ${ratePercent / 2}%`
          : taxType === "IGST"
          ? `IGST (${ratePercent}%)`
          : "Zero-rated / LUT",
      rcm: rcm,
    };

    if (rules.some((r) => r.id === updated.id)) {
      setRules(rules.map((r) => (r.id === updated.id ? updated : r)));
    } else {
      setRules([updated, ...rules]);
    }

    setSelectedRule(updated);
    setToastMessage(`Tax rule "${updated.name}" saved!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filtered = rules.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.sacCode.toLowerCase().includes(search.toLowerCase())
  );

  // Simulation calculations
  const baseSubtotal = 1499.0;
  const simulatedTaxAmount = (baseSubtotal * ratePercent) / 100;
  const simulatedTotal = baseSubtotal + simulatedTaxAmount;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="hover:text-slate-900 dark:hover:text-white transition">Rules</span>
              <ChevronRight className="size-3.5 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-semibold">Tax rules</span>
            </nav>
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Tax rules
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                <ShieldCheck className="size-3.5" />
                Statutory Compliance
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
              Configure Goods and Services Tax (GST) rates, intra-state CGST/SGST splits, and inter-state IGST calculation engines for B2B contracts.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("SAC 997331: Information Technology Software Services\nSAC 998313: IT Consulting and Support Services")}
              leftIcon={<BookOpen className="size-4" />}
            >
              HSN/SAC Directory
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenNew}
              leftIcon={<Plus className="size-4" />}
            >
              New tax rule
            </Button>
          </div>
        </div>

        {/* Statutory Alert / Callout Banner */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Shield className="size-5" />
          </div>
          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2 text-sm text-slate-700 dark:text-slate-300">
            <p>
              Taxes are calculated automatically on every invoice based on customer GSTIN and place of supply{" "}
              <strong className="text-slate-900 dark:text-white font-semibold">
                (Intra-state CGST 9% + SGST 9% vs Inter-state IGST 18%)
              </strong>
              .
            </p>
            <a
              href="https://cbic-gst.gov.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
            >
              Learn GST Rule 46 compliance
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>

        {/* KPI Summary Row (3 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="rounded-xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Tax Rates
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
                <Percent className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                3
              </span>
              <span className="text-xs text-slate-400">Active Rules</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                Standard 18%
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                Concessional 12%
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                Zero-rated 0%
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Default SaaS Rate
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
                <Code className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                18.0%
              </span>
              <span className="text-xs text-slate-400">Integrated GST</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 truncate">
              <span className="font-semibold text-slate-800 dark:text-slate-200">SAC 997331 / 998313</span>
              <span>• IT Software Licensing</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                GST Tax Jurisdiction
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
                <Building className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                State 06
              </span>
              <span className="text-xs text-slate-400">Haryana, IN</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
              <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                06AAACB2026F1Z1
              </span>
              <span>• PoS Engine On</span>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Work Surface: Table + Slide-over Drawer */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: Rules Table Viewport */}
        <div className="flex-1 w-full min-w-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Table Filter Header */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative w-64">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter tax rules or SAC..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Showing {filtered.length} rules</span>
            </div>
          </div>

          {/* Tabular Dataset */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4">Rule Name</th>
                  <th className="py-3 px-4">Tax Code / HSN</th>
                  <th className="py-3 px-4 text-right">Rate %</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Applies to</th>
                  <th className="py-3 px-4">Place of Supply</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filtered.map((r) => {
                  const isSelected = selectedRule.id === r.id && drawerOpen;

                  return (
                    <tr
                      key={r.id}
                      onClick={() => handleSelectRule(r)}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition cursor-pointer ${
                        isSelected ? "bg-indigo-50/50 dark:bg-indigo-950/30" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span
                            className={`font-semibold ${
                              isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {r.name}
                          </span>
                          <span className="text-xs text-slate-400">{r.description}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {r.sacCode}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                        {r.ratePercent.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            r.type === "CGST+SGST"
                              ? "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                              : r.type === "Zero"
                              ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                              : "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                          }`}
                        >
                          {r.typeLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                        {r.appliesTo}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                        {r.placeOfSupply}
                      </td>
                      <td className="py-3.5 px-4">
                        {r.status === "active" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            Deprecated
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => handleSelectRule(r)}
                        >
                          <Edit2 className="size-3.5 text-slate-400 hover:text-indigo-600" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Drawer Editor: Configure GST Rule Panel (~440px wide) */}
        {drawerOpen && (
          <div className="w-full lg:w-[420px] shrink-0 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Edit tax rule</h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
                    Active
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  Configures automated tax line splitting on customer invoices.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Drawer Form */}
            <form onSubmit={handleSaveRule} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rule Name
                </label>
                <Input
                  required
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Standard Software GST (Intra-state)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tax / SAC Code
                  </label>
                  <Input
                    required
                    value={sacCode}
                    onChange={(e) => setSacCode(e.target.value)}
                    placeholder="SAC 997331"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rate %
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.1"
                      required
                      value={ratePercent}
                      onChange={(e) => setRatePercent(Number(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tax Type Selection
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setTaxType("CGST+SGST")}
                    className={`py-1.5 px-2 text-center rounded-lg text-xs font-semibold transition ${
                      taxType === "CGST+SGST"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    CGST + SGST
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxType("IGST")}
                    className={`py-1.5 px-2 text-center rounded-lg text-xs font-semibold transition ${
                      taxType === "IGST"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    IGST
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxType("Zero")}
                    className={`py-1.5 px-2 text-center rounded-lg text-xs font-semibold transition ${
                      taxType === "Zero"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Zero / LUT
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {taxType === "CGST+SGST"
                    ? `Calculates dual ${(ratePercent / 2).toFixed(1)}% lines for intra-state buyers.`
                    : taxType === "IGST"
                    ? `Calculates unified ${ratePercent.toFixed(1)}% IGST for inter-state buyers.`
                    : "0.0% statutory export supply under Section 16 Letter of Undertaking."}
                </span>
              </div>

              {/* RCM Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Reverse Charge (RCM)
                  </span>
                  <span className="text-[11px] text-slate-400">Tax payable directly by recipient</span>
                </div>
                <input
                  type="checkbox"
                  checked={rcm}
                  onChange={(e) => setRcm(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Live Simulated Invoice Card */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700/60 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                    <Receipt className="size-4" />
                    <span className="text-xs font-bold">Live invoice line preview</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                    Simulated
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg p-3 flex flex-col gap-2 text-xs border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Brightloop CRM Suite (Starter Monthly)
                    </span>
                    <span className="font-mono font-semibold tabular-nums">₹1,499.00</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1 text-[11px] text-slate-500">
                    {taxType === "CGST+SGST" ? (
                      <>
                        <div className="flex justify-between">
                          <span>Central GST (CGST {(ratePercent / 2).toFixed(1)}%)</span>
                          <span className="font-mono tabular-nums">
                            ₹{((baseSubtotal * (ratePercent / 2)) / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>State GST (SGST {(ratePercent / 2).toFixed(1)}%)</span>
                          <span className="font-mono tabular-nums">
                            ₹{((baseSubtotal * (ratePercent / 2)) / 100).toFixed(2)}
                          </span>
                        </div>
                      </>
                    ) : taxType === "IGST" ? (
                      <div className="flex justify-between">
                        <span>Integrated GST (IGST {ratePercent.toFixed(1)}%)</span>
                        <span className="font-mono tabular-nums">₹{simulatedTaxAmount.toFixed(2)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-blue-600 dark:text-blue-400">
                        <span>Zero-Rated Supply (LUT 0.0%)</span>
                        <span className="font-mono tabular-nums">₹0.00</span>
                      </div>
                    )}

                    <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white text-xs">
                      <span>Invoice Total (INR)</span>
                      <span className="font-mono tabular-nums">₹{simulatedTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDrawerOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save tax rule
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
