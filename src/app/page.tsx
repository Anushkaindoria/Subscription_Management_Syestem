import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Coins,
  Receipt,
  Lock,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0A0D14] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-50 selection:text-indigo-600">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-9 rounded-[10px] bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-sm shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#18182E] rounded-[8px] flex items-center justify-center text-indigo-400 font-black text-base">
                ∞
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                LoopOS
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                v2.4
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Link href="#gateways" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Role Gateways
            </Link>
            <Link href="#architecture" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Engine Specs
            </Link>
            <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Authentication
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs">
                Sign In
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="primary" size="sm" className="text-xs" rightIcon={<ArrowRight className="size-4" />}>
                Launch Console
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-medium text-slate-700 dark:text-slate-200 mb-8 backdrop-blur-sm">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Calm Precision</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>Recurring Billing & Tax Engine for Indian B2B</span>
            <Sparkles className="size-4 text-indigo-500" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6">
            Every renewal billed.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Every rupee tracked.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            LoopOS is the unified recurring billing and subscription lifecycle management system built for high-growth SaaS, digital services, and enterprise platforms in India.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
            <Link href="/admin">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-sm font-semibold" rightIcon={<ArrowRight className="size-4" />}>
                Access Admin Console
              </Button>
            </Link>
            <Link href="/portal">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-sm font-semibold">
                Customer Self-Service Portal
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm font-semibold">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Trust / Compliance Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80 pt-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span>SOC-2 Type II Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Receipt className="size-4 text-indigo-500" />
              <span>100% Indian GST & HSN Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="size-4 text-amber-500" />
              <span>Paise-Precision Minor Units</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="size-4 text-purple-500" />
              <span>Strict Role-Based Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* THREE ROLE CARDS GATEWAY */}
      <section id="gateways" className="py-16 sm:py-20 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Role Gateways
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Engineered for every stakeholder
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Experience the platform from each distinct operational perspective with complete data fidelity.
            </p>
          </div>

          {/* The Three Role Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {/* Card 1: Executive Admin */}
            <div className="bg-white dark:bg-slate-900 rounded-[14px] border border-slate-200 dark:border-slate-800 p-7 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="size-11 rounded-[10px] bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <ShieldCheck className="size-5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Admin Console
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                  Executive Administration
                </h3>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                  Revenue Operations & Governance
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Complete executive control over billing batch runs, revenue analytics, tax configuration, staff permissions, and time-travel simulation.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mb-8">
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Automated billing run execution & preview dry-runs</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Real-time MRR, ARR, and receivables aging reports</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Indian GST rules (CGST/SGST vs IGST) & discount engine</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Fast-forward time travel for invoice testing</span>
                  </div>
                </div>
              </div>

              <Link href="/admin" className="w-full block">
                <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowRight className="size-4" />}>
                  Enter Admin Console
                </Button>
              </Link>
            </div>

            {/* Card 2: Staff Operations */}
            <div className="bg-white dark:bg-slate-900 rounded-[14px] border border-slate-200 dark:border-slate-800 p-7 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="size-11 rounded-[10px] bg-violet-50 dark:bg-violet-950/60 border border-violet-200/60 dark:border-violet-800/80 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <Users className="size-5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                    Staff Workspace
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                  Staff Operations
                </h3>
                <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-3">
                  Customer & Contract Lifecycles
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Day-to-day subscription desk for account managers. Manage customer accounts, plan catalogs, quotation packages, and offline payment entries.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mb-8">
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Customer portfolio directory with GSTIN verification</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Contract lifecycle: Draft → Confirmed → Active → Closed</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Quotation bundle generator and plan add-ons</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Manual offline payment recording & receipt dispatch</span>
                  </div>
                </div>
              </div>

              <Link href="/admin/subscriptions" className="w-full block">
                <Button variant="secondary" size="md" className="w-full" rightIcon={<ArrowRight className="size-4" />}>
                  Open Staff Workspace
                </Button>
              </Link>
            </div>

            {/* Card 3: Customer Portal */}
            <div className="bg-white dark:bg-slate-900 rounded-[14px] border border-slate-200 dark:border-slate-800 p-7 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="size-11 rounded-[10px] bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Building2 className="size-5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Customer Portal
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                  Customer Self-Service
                </h3>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3">
                  Subscriber Billing & Licenses
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Empower end-clients to view active subscriptions, manage renewals, download official GST tax invoices, and pay online with zero friction.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mb-8">
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Real-time subscription status, seat quotas & terms</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Itemized GST tax invoices with PDF downloads</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Instant online payment reconciliation (UPI / Cards)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Self-service billing address & GSTIN management</span>
                  </div>
                </div>
              </div>

              <Link href="/portal" className="w-full block">
                <Button variant="secondary" size="md" className="w-full" rightIcon={<ArrowRight className="size-4" />}>
                  Enter Customer Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Engine Architecture Highlights */}
      <section id="architecture" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Architected for enterprise reliability
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Engineered with strict design tokens, domain boundary isolation, and forensic financial precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="size-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Coins className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Paise-Level Precision</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              All financial figures are stored as integer minor units. Zero floating-point rounding discrepancies across invoices, taxes, and prorations.
            </p>
          </div>

          <div className="p-6 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="size-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Clock className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Fast-Forward Clock</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Injectable clock allows administrators to jump forward 30, 60, or 90 days to test renewals, dunning, and invoice generation instantaneously.
            </p>
          </div>

          <div className="p-6 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="size-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Layers className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Modular Monolith</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Strict domain boundaries between billing, catalog, subscriptions, auth, and analytics, backed by contracts and route manifests.
            </p>
          </div>

          <div className="p-6 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="size-10 rounded-lg bg-violet-50 dark:bg-violet-950/60 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Receipt className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">GST Indian Formatting</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Full support for intra-state (CGST + SGST) and inter-state (IGST) taxation with automatic Indian numbering grouping (₹ XX,XX,XXX.XX).
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-800 dark:text-slate-200">LoopOS</span>
            <span>•</span>
            <span>© 2026 Brightloop Software Pvt. Ltd. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Admin Console
            </Link>
            <Link href="/portal" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Customer Portal
            </Link>
            <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
