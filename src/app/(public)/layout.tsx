import React from "react";
import Link from "next/link";
import { RefreshCw, ReceiptText, LineChart, ShieldCheck } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] dark:bg-[#0A0D14] text-slate-900 dark:text-slate-100 font-sans">
      {/* BRAND PANEL: Split left on desktop, collapses to compact brand header on mobile */}
      <section className="lg:w-1/2 w-full bg-[radial-gradient(120%_120%_at_20%_10%,#312E81_0%,#1E1B4B_40%,#0F172A_100%)] text-white relative flex flex-col justify-between p-5 sm:p-8 lg:p-16 overflow-hidden shrink-0">
        {/* Ambient Glow Effects */}
        <div className="absolute -top-32 -left-32 size-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 size-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Brand Header & Logo (visible on both mobile and desktop) */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            <div className="size-11 rounded-[12px] bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-[#18182E] rounded-[10px] flex items-center justify-center p-2 text-indigo-400 font-black text-xl">
                ∞
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                  LoopOS
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-indigo-200 border border-white/10">
                  v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">by Brightloop Software</p>
            </div>
          </Link>

          {/* Mobile-only badge */}
          <div className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[11px] text-indigo-200 border border-white/10">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Calm Precision</span>
          </div>
        </div>

        {/* Mid: Value Proposition & Feature Rows (Desktop only - collapses on mobile) */}
        <div className="relative z-10 my-10 lg:my-auto max-w-lg hidden lg:flex flex-col py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-indigo-200 mb-6 backdrop-blur-sm w-fit">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Trusted by 1,200+ high-growth businesses in India</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-white mb-6">
            Every renewal billed.
            <br />
            <span className="bg-gradient-to-r from-indigo-200 via-indigo-100 to-purple-200 bg-clip-text text-transparent">
              Every rupee tracked.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 font-normal">
            The unified recurring billing engine engineered for calm precision. Automate subscription lifecycles, GST e-invoices, and cashflow analytics without friction.
          </p>

          {/* 3 Feature Rows matching Stitch Screen 01-login */}
          <div className="space-y-3.5">
            <div className="flex items-start gap-4 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-all">
              <div className="size-10 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                <RefreshCw className="size-5 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white tracking-tight">Automated Subscription Lifecycles</h2>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Seamless handling of trials, prorations, recurring renewals, and grace periods with zero manual intervention.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-all">
              <div className="size-10 rounded-lg bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300 shrink-0 mt-0.5">
                <ReceiptText className="size-5 text-violet-300" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white tracking-tight">Compliant GST Invoicing & Payments</h2>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Generate 100% compliant Indian tax invoices with HSN codes, reverse charges, and instant payment reconciliation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-all">
              <div className="size-10 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                <LineChart className="size-5 text-purple-300" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white tracking-tight">Real-Time MRR & Cashflow Metrics</h2>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Get instant visibility into net revenue retention, churn metrics, and outstanding payments grouped in ₹.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof & Trust Badges (Desktop only) */}
        <div className="relative z-10 pt-6 border-t border-white/10 hidden lg:flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              <span className="inline-flex size-7 rounded-full ring-2 ring-[#1E1B4B] bg-indigo-200 text-indigo-900 font-semibold text-[10px] items-center justify-center">
                AR
              </span>
              <span className="inline-flex size-7 rounded-full ring-2 ring-[#1E1B4B] bg-emerald-200 text-emerald-900 font-semibold text-[10px] items-center justify-center">
                NL
              </span>
              <span className="inline-flex size-7 rounded-full ring-2 ring-[#1E1B4B] bg-amber-200 text-amber-900 font-semibold text-[10px] items-center justify-center">
                KS
              </span>
            </div>
            <span className="text-slate-300 font-medium">Acme Retail, Nova Logistics & 1,200+ teams</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="size-4" />
            <span>SOC-2 & ISO 27001</span>
          </div>
        </div>
      </section>

      {/* RIGHT 50%: Form Card Container */}
      <section className="lg:w-1/2 w-full flex flex-col justify-between p-6 sm:p-10 lg:p-16 flex-1">
        <div className="flex items-center justify-end text-xs text-slate-500 dark:text-slate-400">
          <span>
            Need assistance?{" "}
            <Link
              href="/"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Contact support
            </Link>
          </span>
        </div>

        <div className="w-full max-w-[440px] mx-auto my-auto py-8">
          {children}
        </div>

        <footer className="w-full max-w-[440px] mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-2 border-t border-slate-200/80 dark:border-slate-800">
          <div>© 2026 Brightloop Software Pvt. Ltd.</div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Security
            </Link>
          </div>
        </footer>
      </section>
    </div>
  );
}
