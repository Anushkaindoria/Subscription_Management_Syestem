"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Plan } from "@/contracts/plan";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { MOCK_PLANS } from "@/mocks";
import { formatINR } from "@/lib/format";
import {
  ArrowLeft,
  Check,
  CalendarRange,
  ChevronRight,
  Lock,
  Copy,
  Badge,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Repeat,
  Plus,
  Minus,
  Clock,
  ShieldCheck,
} from "lucide-react";

export function PlanEditor({ planId }: { planId: string }) {
  const router = useRouter();
  const existing = MOCK_PLANS.find((p) => p.id === planId) || MOCK_PLANS[0];
  const [success, setSuccess] = useState(false);
  const [selectedCadence, setSelectedCadence] = useState<string>(
    (existing.period as any) || "yearly"
  );
  const [minSeats, setMinSeats] = useState<number>(existing.minQuantity || 5);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Plan>({
    defaultValues: {
      id: existing.id || "plan_business_yearly",
      active: true,
      name: existing.name || "Business Yearly",
      price: existing.price || 1499900,
      period: (existing.period as any) || "yearly",
      minQuantity: existing.minQuantity || 5,
      availableFrom: existing.availableFrom || "2026-01-01",
      availableTo: existing.availableTo || "2026-12-31",
      autoClose: existing.autoClose ?? false,
      closable: existing.closable ?? true,
      pausable: existing.pausable ?? true,
      renewable: existing.renewable ?? true,
    },
  });

  const skuCode = (existing.id || "PLAN-BZ-Y").replace("plan_", "PLAN-").toUpperCase();
  const planPriceRupees = (watch("price") || 1499900) / 100;

  const handleCadenceSelect = (cadence: "daily" | "weekly" | "monthly" | "yearly") => {
    setSelectedCadence(cadence);
    setValue("period", cadence);
  };

  const onSubmit = async () => {
    setValue("minQuantity", minSeats);
    setSuccess(true);
    setTimeout(() => {
      router.push("/admin/plans");
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Utility Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <Link href="/admin/plans" className="hover:text-slate-600 dark:hover:text-slate-300 transition">
              Catalog
            </Link>
            <ChevronRight className="size-3.5 text-slate-400" />
            <Link href="/admin/plans" className="hover:text-slate-600 dark:hover:text-slate-300 transition">
              Plans
            </Link>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {planId === "new" ? "New Plan" : `Edit "${existing.name}"`}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Lock className="size-3 text-slate-400" />
              {skuCode}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Active
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            {planId === "new" ? "Create Subscription Plan" : `Edit Plan — ${existing.name}`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Configure billing cadences, commitment terms, trial policies, and packaging behaviors for revenue operations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Copy className="size-3.5" />}
            onClick={() => navigator.clipboard.writeText(skuCode)}
          >
            Copy SKU
          </Button>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="size-5 text-emerald-600" />
          <span>Plan configuration saved successfully! Redirecting to plans list...</span>
        </div>
      )}

      {/* 2-Column Bento Layout */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" noValidate>
        {/* LEFT COLUMN: Primary Form Engine (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Details */}
          <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <CalendarRange className="size-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Plan details</h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">Step 1 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Plan Name *"
                  placeholder="e.g. Business Yearly"
                  error={errors.name?.message}
                  {...register("name")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Plan SKU / Code</span>
                  <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1">
                    <Lock className="size-3" /> Immutable
                  </span>
                </label>
                <input
                  type="text"
                  disabled
                  value={skuCode}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 select-all cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description for contracts & invoices
                </label>
                <textarea
                  rows={3}
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Annual multi-seat contract with enterprise priority support..."
                  defaultValue="Annual multi-seat contract with enterprise priority support, dedicated SLA, and multi-tenant consolidation."
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Printed on customer quotations, invoices, and self-serve payment links.
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Pricing and Billing Cadence */}
          <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Pricing and billing cadence
                  </h2>
                  <p className="text-xs text-slate-500">Define rates, billing cycles, and seat commitments</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">Step 2 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Base Recurring Price *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={planPriceRupees}
                    onChange={(e) => setValue("price", Number(e.target.value) * 100)}
                    className="w-full h-10 pl-7 pr-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 text-xs text-slate-400">/{selectedCadence}</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Tax exclusive baseline according to GST Rule 46
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Setup / Provisioning fee</span>
                  <span className="text-emerald-600 font-semibold text-[11px]">Waived</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    disabled
                    value={0}
                    className="w-full h-10 pl-7 pr-12 bg-slate-50 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold"
                  />
                  <span className="absolute right-3 text-xs text-slate-400">INR</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  One-time invoice line item on first billing cycle
                </span>
              </div>
            </div>

            {/* 4 Cadence Radio Cards */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Billing period cadence
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Daily */}
                <div
                  onClick={() => handleCadenceSelect("daily")}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all flex flex-col justify-between h-[100px] ${
                    selectedCadence === "daily"
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Daily</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        selectedCadence === "daily"
                          ? "border-indigo-600 bg-indigo-600"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedCadence === "daily" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">₹49</span>
                    <span className="text-[10px] text-slate-400">/day</span>
                  </div>
                </div>

                {/* Weekly */}
                <div
                  onClick={() => handleCadenceSelect("weekly")}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all flex flex-col justify-between h-[100px] ${
                    selectedCadence === "weekly"
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Weekly</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        selectedCadence === "weekly"
                          ? "border-indigo-600 bg-indigo-600"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedCadence === "weekly" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">₹399</span>
                    <span className="text-[10px] text-slate-400">/wk</span>
                  </div>
                </div>

                {/* Monthly */}
                <div
                  onClick={() => handleCadenceSelect("monthly")}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all flex flex-col justify-between h-[100px] ${
                    selectedCadence === "monthly"
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Monthly</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        selectedCadence === "monthly"
                          ? "border-indigo-600 bg-indigo-600"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedCadence === "monthly" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">₹1,499</span>
                    <span className="text-[10px] text-slate-400">/mo</span>
                  </div>
                </div>

                {/* Yearly */}
                <div
                  onClick={() => handleCadenceSelect("yearly")}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all flex flex-col justify-between h-[100px] ${
                    selectedCadence === "yearly"
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">Yearly</span>
                      <span className="ml-1 text-[9px] font-bold px-1 py-0.2 rounded-full bg-indigo-600 text-white uppercase">
                        Save 16%
                      </span>
                    </div>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        selectedCadence === "yearly"
                          ? "border-indigo-600 bg-indigo-600"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedCadence === "yearly" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">₹14,999</span>
                    <span className="text-[10px] text-slate-400">/yr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Minimum Quantity Stepper */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Minimum seat commitment
                </span>
                <span className="text-[11px] text-slate-500">
                  Clients must purchase at least this number of seats on this plan.
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setMinSeats(Math.max(1, minSeats - 1))}
                  className="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  aria-label="Decrease minimum seats"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-16 text-center text-xs font-bold tabular-nums text-slate-900 dark:text-white">
                  {minSeats} {minSeats === 1 ? "seat" : "seats"}
                </span>
                <button
                  type="button"
                  onClick={() => setMinSeats(minSeats + 1)}
                  className="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  aria-label="Increase minimum seats"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Availability Schedule & Graphical Track */}
          <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Calendar className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Availability schedule
                  </h2>
                  <p className="text-xs text-slate-500">Catalog release windows and contractual availability dates</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">Step 3 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                defaultValue="2026-01-01"
                {...register("availableFrom")}
              />
              <Input
                label="End Date"
                type="date"
                defaultValue="2026-12-31"
                {...register("availableTo")}
              />
            </div>

            {/* Visual Timeline Track */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Contract Window
                </span>
                <span className="text-slate-400 font-mono">342 days remaining</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: "28%" }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>01 Jan 2026</span>
                <span className="text-indigo-600 font-semibold">Today</span>
                <span>31 Dec 2026</span>
              </div>
            </div>
          </div>

          {/* Card 4: Lifecycle Behavior Orchestration */}
          <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Repeat className="size-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Lifecycle behavior
                  </h2>
                  <p className="text-xs text-slate-500">Automated orchestrations, churn defenses, and pause rules</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">Step 4 of 4</span>
            </div>

            {/* 4 iOS-style Toggle Rows */}
            <div className="space-y-4">
              <Toggle
                label="Close automatically when plan ends"
                description="Subscription transitions directly to Closed state without renewing"
                checked={watch("autoClose")}
                onChange={(val) => setValue("autoClose", val)}
              />
              <Toggle
                label="Allow early close"
                description="Customers or sales managers can initiate mid-cycle termination"
                checked={watch("closable")}
                onChange={(val) => setValue("closable", val)}
              />
              <Toggle
                label="Allow subscription pause"
                description="Customers can temporarily freeze billing cycles up to a maximum of 60 days"
                checked={watch("pausable")}
                onChange={(val) => setValue("pausable", val)}
              />
              <Toggle
                label="Allow self-service renewal"
                description="Clients can trigger automated renewal on customer portal"
                checked={watch("renewable")}
                onChange={(val) => setValue("renewable", val)}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Plan Summary & Entitlement Manifest (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-slate-900 rounded-[14px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Plan Summary & Entitlement
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
                {selectedCadence.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Plan Title:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {watch("name") || "Business Yearly"}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Base Rack Rate:</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  ₹{planPriceRupees.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Seat Baseline:</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {minSeats} seats minimum
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Statutory GST:</span>
                <span className="font-semibold text-slate-900 dark:text-white">18% (SAC 997331)</span>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Minimum Contract Value:</span>
                <span className="text-sm font-bold text-indigo-600 tabular-nums">
                  {formatINR(planPriceRupees * 100 * minSeats)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Enforced Contractual Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Subscribers selecting this plan will be provisioned on a Net 15 credit agreement with automated dunning notifications.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link href="/admin/plans" className="flex-1">
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
                Save Plan
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
