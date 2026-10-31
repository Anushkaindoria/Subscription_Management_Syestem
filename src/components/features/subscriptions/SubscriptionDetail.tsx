"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { Modal } from "@/components/ui/Modal";
import { MOCK_SUBSCRIPTIONS } from "@/mocks";
import {
  ArrowLeft,
  Building,
  Check,
  Pause,
  Play,
  XCircle,
  FileText,
  Calendar,
  Send,
  Zap,
} from "lucide-react";

export function SubscriptionDetail({ id }: { id: string }) {
  const existing = MOCK_SUBSCRIPTIONS.find((s) => s.id === id) || MOCK_SUBSCRIPTIONS[0];
  const [status, setStatus] = useState<string>(existing.status);
  const [actionModal, setActionModal] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const steps = ["Draft", "Quotation", "Confirmed", "Active", "Closed"];
  const currentStep = steps.map((s) => s.toLowerCase()).indexOf(status.toLowerCase());

  const handleTransition = async (action: string) => {
    try {
      const res = await fetch(`/api/subscriptions/${existing.id}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.data?.status) {
        setStatus(data.data.status);
      } else {
        // Mock fallback transition
        if (action === "send_quotation") setStatus("quotation");
        if (action === "confirm") setStatus("confirmed");
        if (action === "activate") setStatus("active");
        if (action === "pause") setStatus("quotation");
        if (action === "resume") setStatus("active");
        if (action === "close") setStatus("closed");
      }
      setFeedback(`Agreement successfully updated: ${action}`);
      setTimeout(() => setFeedback(null), 3000);
      setActionModal(null);
    } catch {
      setFeedback("Failed to update status.");
    }
  };

  const totalValue = (existing.lines || []).reduce(
    (acc: number, l: any) => acc + (l.unitPrice || 0) * (l.quantity || 1),
    0
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/subscriptions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all agreements
        </Link>
        <span className="text-xs text-slate-400 font-mono">ID: {existing.id}</span>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs font-semibold">
          <Check className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">
                {existing.number}
              </h1>
              <StatusPill status={status} />
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Subscription contract for {existing.customerName}
            </p>
          </div>

          {/* Action Transition Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {status === "draft" && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Send className="w-3.5 h-3.5" />}
                onClick={() => handleTransition("send_quotation")}
              >
                Send Quotation
              </Button>
            )}

            {status === "quotation" && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Check className="w-3.5 h-3.5" />}
                onClick={() => handleTransition("confirm")}
              >
                Confirm Agreement
              </Button>
            )}

            {status === "confirmed" && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Zap className="w-3.5 h-3.5" />}
                onClick={() => handleTransition("activate")}
              >
                Activate Agreement
              </Button>
            )}

            {status === "active" && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Pause className="w-3.5 h-3.5" />}
                  onClick={() => setActionModal("pause")}
                >
                  Pause
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  onClick={() => setActionModal("close")}
                >
                  Terminate
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Visual Lifecycle Stepper */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <Stepper steps={steps} currentStep={currentStep >= 0 ? currentStep : 3} />
        </div>
      </div>

      {/* 2-Column Info: Customer Info & Terms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Building className="w-4 h-4 text-indigo-500" />
            <span>Customer Entity</span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {existing.customerName}
          </div>
          <div className="text-xs text-slate-500 space-y-1">
            <div>GSTIN: 07AABCA1234F1Z5</div>
            <div>billing@acmeretail.in</div>
            <div>New Delhi, India</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Billing Schedule</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Term Start:</span>
              <span className="font-medium">{formatDate(existing.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Next Billing:</span>
              <span className="font-bold text-indigo-600">{formatDate(existing.nextBillingDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Terms:</span>
              <span className="font-medium">{existing.paymentTerms}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Contract Valuation</span>
          </div>
          <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
            {formatINR(totalValue)}
          </div>
          <div className="text-xs text-slate-400">
            Recurring charge billed automatically on schedule.
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Included Agreement Line Items
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">Product / Service</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(existing.lines || []).map((l: any, i: number) => (
                <tr key={i}>
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                    {l.productId === "prod_crm"
                      ? "Brightloop CRM Suite (Native Edition)"
                      : l.productId === "prod_seats"
                      ? "Extra User Seats Add-on"
                      : "Priority Cloud Support SLA"}
                  </td>
                  <td className="py-3 text-center tabular-nums">{l.quantity || 1}</td>
                  <td className="py-3 text-right tabular-nums">{formatINR(l.unitPrice)}</td>
                  <td className="py-3 text-right font-bold tabular-nums">
                    {formatINR((l.unitPrice || 0) * (l.quantity || 1))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {actionModal && (
        <Modal
          isOpen={true}
          onClose={() => setActionModal(null)}
          title={`Confirm ${actionModal.toUpperCase()}`}
          description={`Are you sure you want to ${actionModal} agreement ${existing.number}?`}
        >
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" size="sm" onClick={() => setActionModal(null)}>
              Cancel
            </Button>
            <Button
              variant={actionModal === "close" ? "danger" : "primary"}
              size="sm"
              onClick={() => handleTransition(actionModal)}
            >
              Confirm Action
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
