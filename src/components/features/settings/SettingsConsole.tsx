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
  ChevronRight,
  RefreshCw,
  Trash2,
  Phone,
  FileText,
  Calendar,
  Hash,
  Palette,
  Webhook,
  Bell,
  Sun,
  Moon,
  Monitor,
  AlertTriangle,
  Gavel,
  Shield,
  Check,
  Layers,
  Sparkles,
} from "lucide-react";

export function SettingsConsole() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState("company-profile");

  // Additional UI states
  const [tradeName, setTradeName] = useState("Brightloop Software");
  const [corporatePan, setCorporatePan] = useState("AAACB9876Q");
  const [corporatePhone, setCorporatePhone] = useState("+91 124 489 1200");
  const [posStateCode, setPosStateCode] = useState("06");
  const [defaultSac, setDefaultSac] = useState("997331");
  const [colorMode, setColorMode] = useState<"light" | "dark" | "system">("light");
  const [compactDensity, setCompactDensity] = useState(false);
  const [currencyFormat, setCurrencyFormat] = useState("inr_lakh");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  // Automation toggles
  const [sendDraftNotice, setSendDraftNotice] = useState(true);
  const [sendPaymentReceipt, setSendPaymentReceipt] = useState(true);
  const [dunningEscalation, setDunningEscalation] = useState(true);
  const [autoVoidUnpaid, setAutoVoidUnpaid] = useState(false);

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

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl pb-16">
      {/* Sub-header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Admin
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Settings</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Settings &amp; Preferences
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage corporate identity, automated invoicing rules, statutory Indian compliance, and system preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset(MOCK_SETTINGS)}
            disabled={!isDirty || isSubmitting}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Discard changes
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Save changes
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Settings and statutory parameters saved successfully to audit vault.</span>
        </div>
      )}

      {/* Two-Column Interior Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Rail (Sticky) */}
        <aside className="lg:col-span-3 flex flex-col gap-4 sticky top-20">
          <div className="bg-white dark:bg-[#121722] rounded-[14px] border border-slate-200/80 dark:border-slate-800 p-2 shadow-xs flex flex-col gap-1">
            <button
              type="button"
              onClick={() => scrollToSection("company-profile")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeSection === "company-profile"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4" />
                <span>Company Profile</span>
              </div>
              {activeSection === "company-profile" && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("billing-defaults")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeSection === "billing-defaults"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Billing Defaults</span>
              </div>
              {activeSection === "billing-defaults" && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("payment-terms")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeSection === "payment-terms"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Payment Terms</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                4
              </span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("email-templates")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeSection === "email-templates"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Email Templates</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("numbering-series")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeSection === "numbering-series"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Hash className="w-4 h-4" />
                <span>Numbering &amp; Series</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("appearance-theme")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeSection === "appearance-theme"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4" />
                <span>Appearance &amp; Theme</span>
              </div>
              {activeSection === "appearance-theme" && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("security-audit")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeSection === "security-audit"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Security &amp; Audit</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("webhooks-api")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeSection === "webhooks-api"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Webhook className="w-4 h-4" />
                <span>Webhooks &amp; API</span>
              </div>
            </button>
          </div>

          {/* Navigation Footnote */}
          <div className="p-3.5 bg-slate-50 dark:bg-[#0A0D14] border border-slate-200/80 dark:border-slate-800 rounded-xl flex items-start gap-2.5 text-slate-500 dark:text-slate-400 text-xs">
            <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                LoopOS Enterprise v2.4.1
              </span>
              <p className="mt-0.5 leading-relaxed text-[11px]">
                All statutory and configuration changes are timestamped in the immutable audit vault.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* SECTION 1: Company Profile */}
            <section
              id="company-profile"
              className="bg-white dark:bg-[#121722] rounded-[14px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Company Profile
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                    Live on Invoices
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Legal business identity, registered corporate tax handles, and branding appearing on customer statements.
                </p>
              </div>

              {/* Logo Upload Field */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0A0D14] border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
                    <RefreshCw className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Brightloop Software
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Vector symbol • brandmark_dark.svg (42 KB)
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      PNG, SVG or WebP up to 2MB recommended
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 sm:flex-initial text-xs h-9 bg-white dark:bg-[#121722]"
                  >
                    Replace logo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 h-9 w-9 flex items-center justify-center"
                    title="Remove logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Company Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Input
                    label="Legal Company Name *"
                    placeholder="Brightloop Technologies Inc."
                    {...register("companyName")}
                    error={errors.companyName?.message}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Trade / Brand Name
                  </label>
                  <input
                    type="text"
                    value={tradeName}
                    onChange={(e) => setTradeName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-[10px] text-sm bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Corporate GSTIN *
                    </label>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified with GST Portal
                    </span>
                  </div>
                  <input
                    type="text"
                    {...register("gstinTaxId")}
                    className="w-full h-10 px-3.5 font-mono text-sm uppercase rounded-[10px] bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  {errors.gstinTaxId && (
                    <p className="text-xs text-rose-500 mt-1">{errors.gstinTaxId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Permanent Account Number (PAN)
                  </label>
                  <input
                    type="text"
                    value={corporatePan}
                    onChange={(e) => setCorporatePan(e.target.value)}
                    className="w-full h-10 px-3.5 font-mono text-sm uppercase rounded-[10px] bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <Input
                    label="Primary Financial Email *"
                    type="email"
                    placeholder="billing@brightloop.io"
                    leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                    {...register("supportEmail")}
                    error={errors.supportEmail?.message}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Corporate Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      value={corporatePhone}
                      onChange={(e) => setCorporatePhone(e.target.value)}
                      className="w-full h-10 pl-9 pr-3.5 rounded-[10px] text-sm bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Registered Corporate Office Address *
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-[10px] text-sm bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none leading-relaxed transition-all"
                    {...register("companyAddress")}
                  />
                  {errors.companyAddress && (
                    <p className="text-xs text-rose-500 mt-1">{errors.companyAddress.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Place of Supply State Code
                  </label>
                  <select
                    value={posStateCode}
                    onChange={(e) => setPosStateCode(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-[10px] text-sm bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="06">Haryana (06) — Intra-State CGST+SGST / Inter-State IGST</option>
                    <option value="07">Delhi (07)</option>
                    <option value="29">Karnataka (29)</option>
                    <option value="27">Maharashtra (27)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Default HSN/SAC Classification
                  </label>
                  <select
                    value={defaultSac}
                    onChange={(e) => setDefaultSac(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-[10px] text-sm bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="997331">997331 (IT &amp; Software Cloud Services)</option>
                    <option value="998313">998313 (Information Technology Consulting)</option>
                    <option value="998314">998314 (Internet Hosting &amp; Infrastructure)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 2: Billing & Invoicing Automation Defaults */}
            <section
              id="billing-defaults"
              className="bg-white dark:bg-[#121722] rounded-[14px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Billing &amp; Invoicing Automation
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                    Global Policy
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Default financial terms, automated offsets, dunning cadences, and settlement retries applied to new subscriptions.
                </p>
              </div>

              {/* Controls Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Default Payment Terms
                  </label>
                  <select
                    value={watchedValues.defaultPaymentTermsDays || 15}
                    onChange={(e) => {
                      reset({
                        ...watchedValues,
                        defaultPaymentTermsDays: parseInt(e.target.value, 10),
                      });
                    }}
                    className="w-full h-10 px-3.5 rounded-[10px] text-sm bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="0">Due on Receipt (Net 0 Days)</option>
                    <option value="15">Net 15 Days (Standard B2B)</option>
                    <option value="30">Net 30 Days (Enterprise Contract)</option>
                    <option value="45">Net 45 Days</option>
                  </select>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Applies automatically to standard proforma and tax invoices.
                  </span>
                </div>

                <div id="numbering-series">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Invoice Numbering Prefix *
                    </label>
                    <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                      Next: {watchedValues.invoicePrefix || "INV-2026-"}0045
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="INV-2026-"
                    {...register("invoicePrefix")}
                    className="w-full h-10 px-3.5 font-mono text-sm rounded-[10px] bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Fiscal prefix follows GST-compliant sequence patterns.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Default Due-day Offset
                  </label>
                  <div className="flex items-center h-10 px-3.5 rounded-[10px] bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                    <input
                      type="number"
                      value={watchedValues.defaultPaymentTermsDays || 15}
                      onChange={(e) =>
                        reset({
                          ...watchedValues,
                          defaultPaymentTermsDays: parseInt(e.target.value, 10) || 15,
                        })
                      }
                      className="w-16 bg-transparent border-0 outline-none text-slate-900 dark:text-white text-sm font-semibold"
                    />
                    <span className="text-slate-500 dark:text-slate-400 text-xs">
                      days after invoice publication
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Auto-Debit Execution Timing
                  </label>
                  <div className="flex items-center h-10 px-3.5 rounded-[10px] bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2 shrink-0" />
                    <span className="font-medium">09:00 IST on Due Date</span>
                    <span className="ml-auto text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                      RBI e-Mandate auto-retry (+3d)
                    </span>
                  </div>
                </div>
              </div>

              {/* Automated Notification Cadences */}
              <div className="flex flex-col gap-3 pt-2" id="email-templates">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Automated Notification Cadences
                </span>

                {/* Toggle 1 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0A0D14] border border-slate-200/70 dark:border-slate-800/80 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-[#121722] text-indigo-600 dark:text-indigo-400 border border-slate-200/60 dark:border-slate-800 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Send draft invoice preview notice
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Dispatches billing forecast and proration details 3 calendar days prior to final billing run.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSendDraftNotice(!sendDraftNotice)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                      sendDraftNotice ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        sendDraftNotice ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 2 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0A0D14] border border-slate-200/70 dark:border-slate-800/80 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-[#121722] text-indigo-600 dark:text-indigo-400 border border-slate-200/60 dark:border-slate-800 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Send payment confirmation &amp; statutory receipts
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Instantly sends digitally signed PDF tax receipt to primary and financial contacts upon capture.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSendPaymentReceipt(!sendPaymentReceipt)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                      sendPaymentReceipt ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        sendPaymentReceipt ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 3 with Dunning */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0A0D14] border border-slate-200/70 dark:border-slate-800/80 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-[#121722] text-amber-600 dark:text-amber-400 border border-slate-200/60 dark:border-slate-800 shrink-0">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            Automated Dunning &amp; Overdue Escalation
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold border border-amber-200 dark:border-amber-900/40">
                            Active Sequence
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Execute escalating dunning emails and temporary subscription freeze workflows.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDunningEscalation(!dunningEscalation)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                        dunningEscalation ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          dunningEscalation ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Sub-cadence badges */}
                  <div className="pl-11 flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-[#121722] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs shadow-xs">
                      <Bell className="w-3.5 h-3.5 text-indigo-600" />
                      1st Reminder: <strong className="ml-1 text-slate-900 dark:text-white">Due +3d</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-[#121722] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs shadow-xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      2nd Escalation: <strong className="ml-1 text-slate-900 dark:text-white">Due +7d</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-[#121722] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs shadow-xs">
                      <Gavel className="w-3.5 h-3.5 text-rose-500" />
                      Critical Halt Notice: <strong className="ml-1 text-slate-900 dark:text-white">Due +15d</strong>
                    </span>
                  </div>
                </div>

                {/* Toggle 4 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0A0D14] border border-slate-200/70 dark:border-slate-800/80 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-[#121722] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800 shrink-0">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Auto-void unpaid invoices after 45 days
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Automatically cancels and issues GST Credit Note for unresolved debt past 45 calendar days.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoVoidUnpaid(!autoVoidUnpaid)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                      autoVoidUnpaid ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        autoVoidUnpaid ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 3: Appearance & Interface Preferences */}
            <section
              id="appearance-theme"
              className="bg-white dark:bg-[#121722] rounded-[14px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1 pb-2 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Appearance &amp; Interface
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  System visual presentation, dense data views, and localized regional formatting for administrative team members.
                </p>
              </div>

              {/* Mode Selectors */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Color Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Light Mode */}
                  <div
                    onClick={() => setColorMode("light")}
                    className={`cursor-pointer relative p-4 rounded-xl border transition-all flex flex-col gap-3 ${
                      colorMode === "light"
                        ? "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-500 dark:border-indigo-500 shadow-sm"
                        : "bg-slate-50 dark:bg-[#0A0D14] border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#121722] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600">
                        <Sun className="w-4 h-4" />
                      </div>
                      {colorMode === "light" ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white block">
                        Light Mode
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                        Crisp slate surfaces with maximal tabular contrast.
                      </span>
                    </div>
                  </div>

                  {/* Dark Mode */}
                  <div
                    onClick={() => setColorMode("dark")}
                    className={`cursor-pointer relative p-4 rounded-xl border transition-all flex flex-col gap-3 ${
                      colorMode === "dark"
                        ? "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-500 dark:border-indigo-500 shadow-sm"
                        : "bg-slate-50 dark:bg-[#0A0D14] border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#121722] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                        <Moon className="w-4 h-4" />
                      </div>
                      {colorMode === "dark" ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white block">
                        Dark Mode
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                        Deep obsidian backdrop for nocturnal telemetry.
                      </span>
                    </div>
                  </div>

                  {/* System Default */}
                  <div
                    onClick={() => setColorMode("system")}
                    className={`cursor-pointer relative p-4 rounded-xl border transition-all flex flex-col gap-3 ${
                      colorMode === "system"
                        ? "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-500 dark:border-indigo-500 shadow-sm"
                        : "bg-slate-50 dark:bg-[#0A0D14] border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#121722] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                        <Monitor className="w-4 h-4" />
                      </div>
                      {colorMode === "system" ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white block">
                        System Default
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                        Matches OS brightness configuration automatically.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Density & Locale settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* Compact Density Toggle */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0A0D14] border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Compact Table Density
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Reduce vertical cell padding to fit 30+ invoice rows per fold.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCompactDensity(!compactDensity)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                      compactDensity ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        compactDensity ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Currency Format */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Currency Display Format
                  </label>
                  <select
                    value={currencyFormat}
                    onChange={(e) => setCurrencyFormat(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-[10px] text-sm bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="inr_lakh">Indian Rupee (₹ with Indian Lakh/Crore: 1,00,000.00)</option>
                    <option value="usd">US Dollar ($ with International grouping: 100,000.00)</option>
                    <option value="eur">Euro (€ with Standard decimal grouping: 100.000,00)</option>
                    <option value="gbp">British Pound (£ with Standard grouping: 100,000.00)</option>
                  </select>
                </div>

                {/* Default Operational Timezone */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Default Operating Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-[10px] text-sm bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="Asia/Kolkata">IST (UTC+05:30) — Asia/Kolkata (Indian Standard Time)</option>
                    <option value="UTC">UTC (UTC+00:00) — Coordinated Universal Time</option>
                    <option value="America/New_York">EST (UTC-05:00) — America/New_York (Eastern Time)</option>
                    <option value="Asia/Singapore">SGT (UTC+08:00) — Asia/Singapore (Singapore Standard Time)</option>
                  </select>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    All subscription cycle transitions and fiscal midnight cutoffs sync to this clock.
                  </span>
                </div>
              </div>
            </section>

            {/* Bottom Floating Sticky Action Bar */}
            <div className="sticky bottom-6 p-4 rounded-[14px] bg-white/90 dark:bg-[#121722]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center justify-between transition-all">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Unsaved changes will be committed across 3 corporate entities</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset(MOCK_SETTINGS)}
                  disabled={!isDirty || isSubmitting}
                  className="text-xs h-9"
                >
                  Reset to defaults
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  className="text-xs h-9 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  Save changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
