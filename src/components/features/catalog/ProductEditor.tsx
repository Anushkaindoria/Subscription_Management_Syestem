"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Product } from "@/contracts/product";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { MOCK_PRODUCTS } from "@/mocks";
import { formatINR } from "@/lib/format";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  Package,
  Layers,
  Lock,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Percent,
  GripVertical,
  CheckCircle2,
  Eye,
  Info,
} from "lucide-react";

export function ProductEditor({ productId }: { productId: string }) {
  const router = useRouter();
  const existing = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];
  const [success, setSuccess] = useState(false);

  const [attributes, setAttributes] = useState(
    existing.attributes || [
      {
        name: "Brand Variant",
        values: [
          { label: "Odoo Compatible", priceExtra: 56000 },
          { label: "Zoho Sync", priceExtra: 30000 },
          { label: "Native LoopOS", priceExtra: 0 },
        ],
      },
    ]
  );

  const [portalDisplay, setPortalDisplay] = useState(true);
  const [volumeMatrix, setVolumeMatrix] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Product>({
    defaultValues: {
      id: existing.id || "prod_brightloop_crm",
      name: existing.name || "Brightloop CRM Suite",
      type: existing.type || "service",
      salesPrice: existing.salesPrice || 120000,
      costPrice: existing.costPrice || 45000,
      active: existing.active ?? true,
      notes: existing.notes || "Core cloud CRM platform with multi-brand tenant synchronization.",
      attributes,
    },
  });

  const salesPricePaise = watch("salesPrice") || 120000;
  const costPricePaise = watch("costPrice") || 45000;
  const isActive = watch("active");

  const salesPriceRupees = salesPricePaise / 100;
  const costPriceRupees = costPricePaise / 100;
  const profitDeltaRupees = salesPriceRupees - costPriceRupees;
  const marginPct =
    salesPriceRupees > 0
      ? Math.max(0, Math.min(100, Math.round((profitDeltaRupees / salesPriceRupees) * 100)))
      : 0;

  const skuCode = (existing.id || "PRD-CRM-001").replace("prod_", "PRD-").toUpperCase();

  const addVariantValue = () => {
    const next = [...attributes];
    if (!next[0]) {
      next.push({ name: "Brand Variant", values: [] });
    }
    next[0].values.push({ label: "Custom Edition", priceExtra: 25000 });
    setAttributes(next);
  };

  const removeVariantValue = (idx: number) => {
    const next = [...attributes];
    next[0].values.splice(idx, 1);
    setAttributes(next);
  };

  const updateVariant = (idx: number, field: "label" | "priceExtra", val: any) => {
    const next = [...attributes];
    if (field === "label") {
      next[0].values[idx].label = val;
    } else {
      next[0].values[idx].priceExtra = Number(val) * 100;
    }
    setAttributes(next);
  };

  const onSubmit = async () => {
    setSuccess(true);
    setTimeout(() => {
      router.push("/admin/products");
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Breadcrumb & Page Subheader */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <Link href="/admin/products" className="hover:text-slate-600 dark:hover:text-slate-300 transition">
              Catalog
            </Link>
            <ChevronRight className="size-3.5 text-slate-400" />
            <Link href="/admin/products" className="hover:text-slate-600 dark:hover:text-slate-300 transition">
              Products
            </Link>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {productId === "new" ? "New Product" : `Edit "${existing.name}"`}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400">
              {skuCode}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Configure software catalog specifications, cost-margin baselines, multi-brand tier pricing, and plan line previews.
          </p>
        </div>

        {/* Quick Micro Status Badges */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300">
            <ShieldCheck className="size-4 text-indigo-600" />
            <span>SAC 997331 Compliant</span>
          </div>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-emerald-600 tabular-nums">
            <TrendingUp className="size-3.5" />
            <span>{marginPct}% Baseline Margin</span>
          </div>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="size-5 text-emerald-600" />
          <span>Product changes saved successfully! Redirecting to catalog...</span>
        </div>
      )}

      {/* Two-Column Master Grid */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" noValidate>
        {/* LEFT MAIN COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. GENERAL INFORMATION CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Package className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    General Information
                  </h2>
                  <p className="text-xs text-slate-500">Core identification and GST statutory classification</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
                Primary SKU
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Product Title *"
                  placeholder="e.g. Brightloop CRM Suite"
                  error={errors.name?.message}
                  {...register("name")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Internal SKU</span>
                  <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1">
                    <Lock className="size-3" /> Auto-generated
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={skuCode}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 select-all cursor-not-allowed"
                  />
                  <Lock className="size-3.5 absolute right-3 top-3 text-slate-400" />
                </div>
              </div>

              <div>
                <Select
                  label="Catalog Type *"
                  options={[
                    { value: "service", label: "Software / SaaS (SAC 997331)" },
                    { value: "goods", label: "Physical Hardware / Add-on" },
                  ]}
                  {...register("type")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Statutory SAC / Tax Classification</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                    18% GST Applicable
                  </span>
                </label>
                <select className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>SAC 997331 (Information Technology Software Licensing Services - 18%)</option>
                  <option>SAC 998313 (IT Consulting, Cloud Setup & SLA Support - 18%)</option>
                  <option>SAC 998319 (Other Hosting and Infrastructure Services - 18%)</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Applied automatically to monthly B2B e-invoices for domestic customers
                </span>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description & Contract Scope
                </label>
                <textarea
                  rows={3}
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Core cloud CRM platform with multi-brand tenant synchronization..."
                  {...register("notes")}
                />
              </div>
            </div>
          </div>

          {/* 2. BASE PRICING & COST STRUCTURE CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Percent className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Base Pricing & Cost Structure
                  </h2>
                  <p className="text-xs text-slate-500">Unit economics baseline prior to client-tier modifiers</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                INR Recurring
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              {/* Sales Price Input */}
              <div className="md:col-span-4 space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Sales Price (Base)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={salesPriceRupees}
                    onChange={(e) => setValue("salesPrice", Number(e.target.value) * 100)}
                    className="w-full h-10 pl-7 pr-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-right tabular-nums text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Billing cadence</span>
                  <span className="font-semibold text-indigo-600">per month</span>
                </div>
              </div>

              {/* Cost Price Input */}
              <div className="md:col-span-4 space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  COGS Baseline
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={costPriceRupees}
                    onChange={(e) => setValue("costPrice", Number(e.target.value) * 100)}
                    className="w-full h-10 pl-7 pr-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-right tabular-nums text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Server & telemetry</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">₹{costPriceRupees} / seat</span>
                </div>
              </div>

              {/* Live Margin Readout Display Card */}
              <div className="md:col-span-4 bg-gradient-to-br from-indigo-50/70 to-indigo-100/40 dark:from-indigo-950/40 dark:to-slate-900 p-4 rounded-xl flex flex-col justify-between border border-indigo-100 dark:border-indigo-900/60 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    Gross Margin
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                    Healthy
                  </span>
                </div>
                <div className="flex items-baseline gap-2 my-1">
                  <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {marginPct}%
                  </span>
                  <span className="text-xs text-slate-500 tabular-nums">
                    +₹{profitDeltaRupees.toFixed(2)} net
                  </span>
                </div>
                <div className="space-y-1 mt-2">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${marginPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Formula: (Sales - Cost) / Sales</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Target: &gt; 60%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. VARIANTS & ATTRIBUTE SURCHARGES BUILDER */}
          <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Layers className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Variants & Add-on Surcharges
                  </h2>
                  <p className="text-xs text-slate-500">
                    Define multi-brand connectors or tier addons with incremental pricing
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="size-3.5" />}
                onClick={addVariantValue}
              >
                Add Variant Tier
              </Button>
            </div>

            {/* Value Rows */}
            <div className="space-y-2.5">
              {attributes[0]?.values.map((v: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition"
                >
                  <GripVertical className="size-4 text-slate-400 cursor-grab" />
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <input
                      type="text"
                      value={v.label}
                      onChange={(e) => updateVariant(idx, "label", e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <span className="text-slate-400">Surcharge:</span>
                      <div className="relative w-36">
                        <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-bold">+₹</span>
                        <input
                          type="number"
                          value={v.priceExtra / 100}
                          onChange={(e) => updateVariant(idx, "priceExtra", e.target.value)}
                          className="w-full h-8 pl-8 pr-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-right text-xs font-bold text-slate-900 dark:text-white tabular-nums outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariantValue(idx)}
                    className="p-1 text-slate-400 hover:text-red-500 transition"
                    aria-label="Remove variant"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Calculated Realization Breakdown Table */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Calculated Realization Breakdown (Auto-derived from rack rate)
              </span>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Variant Combination</th>
                      <th className="py-2.5 px-3 text-right">Surcharge</th>
                      <th className="py-2.5 px-3 text-right">COGS</th>
                      <th className="py-2.5 px-3 text-right">Final Sales Rate</th>
                      <th className="py-2.5 px-3 text-center">Gross Margin</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {attributes[0]?.values.map((v: any, i: number) => {
                      const finalSales = salesPriceRupees + v.priceExtra / 100;
                      const varMargin =
                        finalSales > 0
                          ? Math.round(((finalSales - costPriceRupees) / finalSales) * 100)
                          : 0;
                      return (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                            {v.label}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-slate-500">
                            +₹{(v.priceExtra / 100).toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-slate-500">
                            ₹{costPriceRupees.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums font-bold text-slate-900 dark:text-white">
                            ₹{finalSales.toFixed(2)} <span className="text-[10px] text-slate-400">/ mo</span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] tabular-nums">
                              {varMargin}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              Active
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT STICKY SIDEBAR (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Status & Visibility Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Status & Visibility
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                Published
              </span>
            </div>

            <div className="space-y-4">
              <Toggle
                label="Product Active State"
                description="Eligible for new customer subscriptions"
                checked={isActive}
                onChange={(val) => setValue("active", val)}
              />
              <Toggle
                label="Customer Portal Display"
                description="Allow clients to view in self-serve catalog"
                checked={portalDisplay}
                onChange={setPortalDisplay}
              />
              <Toggle
                label="Volume Matrix Pricing"
                description="Auto-apply tiered seat quantity rules"
                checked={volumeMatrix}
                onChange={setVolumeMatrix}
              />
            </div>
          </div>

          {/* Plan Line Preview Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Eye className="size-4 text-indigo-600" />
              <span>Simulated Quote Line Preview</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex justify-between items-start font-semibold text-slate-900 dark:text-white">
                <span>{watch("name") || "Brightloop CRM Suite"}</span>
                <span className="tabular-nums">₹{salesPriceRupees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-[11px]">
                <span>10x User Seats @ ₹{salesPriceRupees.toFixed(2)}/mo</span>
                <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                  ₹{(salesPriceRupees * 10).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-[11px]">
                <span>Statutory 18% GST (SAC 997331)</span>
                <span className="tabular-nums">₹{(salesPriceRupees * 10 * 0.18).toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center font-bold text-slate-900 dark:text-white text-xs">
                <span>Monthly Total:</span>
                <span className="text-indigo-600 dark:text-indigo-400 tabular-nums">
                  ₹{(salesPriceRupees * 10 * 1.18).toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              This preview matches the printable GST Tax Invoice rendering sent to clients.
            </p>
          </div>

          {/* Save Action CTAs */}
          <div className="flex items-center gap-3">
            <Link href="/admin/products" className="flex-1">
              <Button variant="outline" size="md" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isSubmitting}
              className="flex-1"
            >
              Save Product
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
