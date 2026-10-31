"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanSchema, Plan } from "@/contracts/plan";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { MOCK_PLANS } from "@/mocks";
import { ArrowLeft, Check, CalendarRange } from "lucide-react";

export function PlanEditor({ planId }: { planId: string }) {
  const router = useRouter();
  const existing = MOCK_PLANS.find((p) => p.id === planId) || MOCK_PLANS[0];
  const [success, setSuccess] = useState(false);

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
      minQuantity: existing.minQuantity || 1,
      availableFrom: existing.availableFrom || "2026-01-01",
      availableTo: existing.availableTo || "2026-12-31",
      autoClose: existing.autoClose ?? false,
      closable: existing.closable ?? true,
      pausable: existing.pausable ?? true,
      renewable: existing.renewable ?? true,
    },
  });

  const onSubmit = async () => {
    setSuccess(true);
    setTimeout(() => {
      router.push("/admin/plans");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/plans"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to plans
        </Link>
        <span className="text-xs text-slate-400 font-mono">Plan ID: {planId}</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
            <CalendarRange className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {planId === "new" ? "New Plan Tier" : `Edit Plan: ${existing.name}`}
            </h1>
            <p className="text-xs text-slate-500">Configure recurring billing cycle, pricing, and lifecycle rights.</p>
          </div>
        </div>

        {success && (
          <div className="p-3.5 rounded-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs font-semibold">
            <Check className="w-4 h-4" />
            Plan settings saved! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Plan Name"
              placeholder="e.g. Starter Monthly"
              error={errors.name?.message}
              {...register("name")}
            />

            <Select
              label="Billing Interval"
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "yearly", label: "Yearly" },
                { value: "weekly", label: "Weekly" },
                { value: "daily", label: "Daily Trial" },
              ]}
              {...register("period")}
            />

            <Input
              label="Price (in Paise)"
              type="number"
              placeholder="149900 (₹1,499.00)"
              helperText="Charge recurring per billing interval"
              error={errors.price?.message}
              {...register("price", { valueAsNumber: true })}
            />

            <Input
              label="Minimum Quantity"
              type="number"
              placeholder="1"
              error={errors.minQuantity?.message}
              {...register("minQuantity", { valueAsNumber: true })}
            />

            <Input
              label="Available From"
              type="date"
              error={errors.availableFrom?.message}
              {...register("availableFrom")}
            />

            <Input
              label="Available To"
              type="date"
              error={errors.availableTo?.message}
              {...register("availableTo")}
            />
          </div>

          {/* Customer Lifecycle Permissions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Agreement Lifecycle Flags
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Toggle
                label="Allow Self-Service Renewal"
                checked={watch("renewable")}
                onChange={(val) => setValue("renewable", val)}
              />
              <Toggle
                label="Allow Subscription Pause"
                checked={watch("pausable")}
                onChange={(val) => setValue("pausable", val)}
              />
              <Toggle
                label="Allow Early Termination"
                checked={watch("closable")}
                onChange={(val) => setValue("closable", val)}
              />
              <Toggle
                label="Auto-Close Upon Expiry"
                checked={watch("autoClose")}
                onChange={(val) => setValue("autoClose", val)}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Link href="/admin/plans">
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
              Save Plan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
