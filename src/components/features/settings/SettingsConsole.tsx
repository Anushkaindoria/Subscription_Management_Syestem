"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema, type Settings } from "@/contracts/settings";
import { MOCK_SETTINGS } from "@/mocks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Building2,
  FileSpreadsheet,
  Clock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Save,
  RotateCcw,
} from "lucide-react";

export function SettingsConsole() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Settings>({
    defaultValues: MOCK_SETTINGS,
  });

  const watchedValues = watch();

  const onSubmit = async (data: Settings) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System & Billing Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure legal entity metadata, GSTIN tax identifiers, sequence prefixes, and dunning rules.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Entity & Legal */}
        <div className="bg-white dark:bg-[#121722] rounded-[14px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Legal Entity & GST Compliance
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Printed on all tax invoices, credit notes, and customer receipts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            <div>
              <Input
                label="Registered Business Name *"
                placeholder="LoopOS Technologies Pvt Ltd"
                {...register("companyName")}
                error={errors.companyName?.message}
              />
            </div>

            <div>
              <Input
                label="GSTIN / Tax ID *"
                placeholder="29AABCL9999Z1Z5"
                {...register("gstinTaxId")}
                error={errors.gstinTaxId?.message}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Registered Office Address *
              </label>
              <textarea
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-[10px] text-sm bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                {...register("companyAddress")}
              />
              {errors.companyAddress && (
                <p className="text-xs text-red-500 mt-1">{errors.companyAddress.message}</p>
              )}
            </div>

            <div>
              <Input
                label="Support & Billing Email *"
                type="email"
                placeholder="billing@loopos.io"
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                {...register("supportEmail")}
                error={errors.supportEmail?.message}
              />
            </div>

            <div>
              <Input
                label="Base Accounting Currency"
                disabled
                value="INR (Indian Rupee - ₹)"
                {...register("currency")}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Numbering Sequences */}
        <div className="bg-white dark:bg-[#121722] rounded-[14px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Document Numbering Sequences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Custom prefixes for automated billing agreements and GST invoice generation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            <div>
              <Input
                label="Invoice Prefix *"
                placeholder="INV-2026-"
                {...register("invoicePrefix")}
                error={errors.invoicePrefix?.message}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Preview: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{watchedValues.invoicePrefix || "INV-2026-"}0001</span>
              </p>
            </div>

            <div>
              <Input
                label="Subscription Prefix *"
                placeholder="SUB-2026-"
                {...register("subscriptionPrefix")}
                error={errors.subscriptionPrefix?.message}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Preview: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{watchedValues.subscriptionPrefix || "SUB-2026-"}0001</span>
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Payment Terms & Reminders */}
        <div className="bg-white dark:bg-[#121722] rounded-[14px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Credit Terms & Dunning Schedule
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Standard payment terms and automated email reminder schedules before invoice due date.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            <div>
              <Input
                label="Default Payment Terms (Days) *"
                type="number"
                placeholder="15"
                {...register("defaultPaymentTermsDays", { valueAsNumber: true })}
                error={errors.defaultPaymentTermsDays?.message}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Invoices default to Net {watchedValues.defaultPaymentTermsDays || 15} days from generation date.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Automated Reminder Triggers
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                  7 days before
                </span>
                <span className="text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                  3 days before
                </span>
                <span className="text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                  1 day before
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Emails dispatched automatically to primary customer billing contact.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset(MOCK_SETTINGS)}
            disabled={!isDirty || isSubmitting}
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Reset Defaults
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
