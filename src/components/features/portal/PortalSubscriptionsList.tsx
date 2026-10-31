"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_SUBSCRIPTIONS, MOCK_CUSTOMERS } from "@/mocks";
import { RefreshCw, ArrowRight, Calendar, ShieldCheck, HelpCircle } from "lucide-react";

export function PortalSubscriptionsList() {
  const currentCustomer = MOCK_CUSTOMERS[0];
  const allCustomerSubs = MOCK_SUBSCRIPTIONS.filter(
    (s) => s.customerId === currentCustomer.id,
  );

  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Agreements", count: allCustomerSubs.length },
    {
      id: "active",
      label: "Active",
      count: allCustomerSubs.filter((s) => s.status === "active").length,
    },
    {
      id: "draft",
      label: "Pending Review",
      count: allCustomerSubs.filter((s) => s.status === "draft").length,
    },
    {
      id: "closed",
      label: "Closed / Ended",
      count: allCustomerSubs.filter((s) => s.status === "closed").length,
    },
  ];

  const filtered = allCustomerSubs.filter((sub) => {
    if (activeTab === "all") return true;
    return sub.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Subscriptions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your software licenses, recurring billing intervals, and self-service renewal terms.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Subscriptions Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No subscriptions in this view"
          description="There are currently no agreements matching this filter category."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((sub) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-[#121722] rounded-[16px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {sub.number}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {sub.planName}
                    </h2>
                  </div>
                  <StatusPill status={sub.status} />
                </div>

                {/* Agreement Dates & Terms */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block">Term Duration</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {formatDate(sub.startDate)} - {formatDate(sub.expiryDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Next Renewal / Bill</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {sub.nextBillingDate ? formatDate(sub.nextBillingDate) : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Line Items */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Included Services
                  </div>
                  {sub.lines.map((l) => (
                    <div key={l.id} className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>{l.productName} (×{l.quantity})</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        {formatINR(l.unitPrice * l.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Recurring Total</span>
                  <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {formatINR(sub.totalRecurringMinor || 0)}
                    <span className="text-xs font-sans font-normal text-slate-500">/mo</span>
                  </span>
                </div>
                <Link href={`/portal/subscriptions/${sub.id}`}>
                  <Button variant="outline" size="sm" className="group">
                    Manage Agreement
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Support Card */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Need to modify seat counts or custom enterprise modules?</span>
        </div>
        <a
          href="mailto:billing@loopos.io"
          className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Contact Account Executive
        </a>
      </div>
    </div>
  );
}
