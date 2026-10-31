"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { formatINR, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/StatusPill";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_SUBSCRIPTIONS, MOCK_CUSTOMERS } from "@/mocks";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  Pause,
  Play,
  RotateCw,
  XCircle,
} from "lucide-react";

export function PortalSubscriptionDetail() {
  const params = useParams();
  const router = useRouter();
  const subId = params?.id as string;

  const currentCustomer = MOCK_CUSTOMERS[0];
  const subscription = MOCK_SUBSCRIPTIONS.find(
    (s) => s.id === subId && s.customerId === currentCustomer.id,
  );

  const [activeStatus, setActiveStatus] = useState<string>(
    subscription?.status || "active",
  );
  const [actionModal, setActionModal] = useState<"renew" | "pause" | "cancel" | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!subscription) {
    return (
      <div className="space-y-6">
        <Link
          href="/portal/subscriptions"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to My Subscriptions
        </Link>
        <EmptyState
          title="Subscription not found"
          description="The requested agreement either does not exist or does not belong to your account."
        />
      </div>
    );
  }

  const steps = [
    { id: "draft", label: "Quotation Review", status: "completed" as const },
    { id: "confirmed", label: "Signed Agreement", status: "completed" as const },
    {
      id: "active",
      label: "Active Service",
      status: activeStatus === "active" ? ("current" as const) : ("completed" as const),
    },
    {
      id: "renewal",
      label: "Annual Renewal",
      status: activeStatus === "closed" ? ("completed" as const) : ("upcoming" as const),
    },
  ];

  const handleAction = async (action: "renew" | "pause" | "cancel") => {
    setIsProcessing(true);
    await new Promise((res) => setTimeout(res, 750));
    setIsProcessing(false);

    if (action === "renew") {
      setActiveStatus("active");
      setSuccessMessage("Your subscription has been renewed for another annual term!");
    } else if (action === "pause") {
      setActiveStatus("paused");
      setSuccessMessage("Your subscription has been temporarily paused.");
    } else if (action === "cancel") {
      setActiveStatus("closed");
      setSuccessMessage("Your subscription cancellation request has been recorded.");
    }

    setActionModal(null);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/portal/subscriptions"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Subscriptions
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {subscription.planName}
            </h1>
            <StatusPill status={activeStatus} />
          </div>
          <p className="text-xs font-mono text-slate-500 mt-1">
            Agreement ID: {subscription.number}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const blob = new Blob(
                [`LoopOS Subscription Agreement: ${subscription.number}\nPlan: ${subscription.planName}\nCustomer: ${subscription.customerName}`],
                { type: "text/plain" },
              );
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${subscription.number}-agreement.txt`;
              a.click();
            }}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download PDF
          </Button>

          {activeStatus === "active" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActionModal("pause")}
              >
                <Pause className="w-3.5 h-3.5 mr-1.5" />
                Pause
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActionModal("renew")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <RotateCw className="w-3.5 h-3.5 mr-1.5" />
                Renew Now
              </Button>
            </>
          ) : activeStatus === "paused" ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleAction("renew")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Resume Subscription
            </Button>
          ) : null}
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Stepper Progress */}
      <div className="bg-white dark:bg-[#121722] rounded-[16px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
          Agreement Lifecycle Stage
        </h2>
        <Stepper
          steps={["Quotation Review", "Signed Agreement", "Active Service", "Annual Renewal"]}
          currentStep={activeStatus === "active" ? 2 : activeStatus === "closed" ? 3 : 1}
        />
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-[#121722] rounded-[14px] border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="text-xs text-slate-400">Term Period</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
            {formatDate(subscription.startDate)} - {formatDate(subscription.expiryDate)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Auto-renews upon expiry date
          </div>
        </div>

        <div className="bg-white dark:bg-[#121722] rounded-[14px] border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="text-xs text-slate-400">Payment Terms</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
            {subscription.paymentTerms}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Generated invoices due within 15 days
          </div>
        </div>

        <div className="bg-white dark:bg-[#121722] rounded-[14px] border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="text-xs text-slate-400">Total Recurring</div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            {formatINR(subscription.totalRecurringMinor || 0)}
            <span className="text-xs font-sans font-normal text-slate-500">/mo</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Exclusive of applicable GST (18%)
          </div>
        </div>
      </div>

      {/* Services Breakdown Table */}
      <div className="bg-white dark:bg-[#121722] rounded-[16px] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Included Product Packages & Add-ons
          </h2>
          <span className="text-xs text-slate-400">
            {subscription.lines.length} service line items
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
            <tr>
              <th className="py-3.5 px-6">Service / Product</th>
              <th className="py-3.5 px-4 text-center">Quantity</th>
              <th className="py-3.5 px-4 text-right">Unit Price</th>
              <th className="py-3.5 px-6 text-right">Recurring Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {subscription.lines.map((line) => (
              <tr key={line.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                <td className="py-4 px-6">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {line.productName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ID: {line.productId}
                  </div>
                </td>
                <td className="py-4 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                  {line.quantity}
                </td>
                <td className="py-4 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                  {formatINR(line.unitPrice)}
                </td>
                <td className="py-4 px-6 text-right font-mono font-bold text-slate-900 dark:text-white">
                  {formatINR(line.unitPrice * line.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800">
            <tr>
              <td colSpan={3} className="py-4 px-6 text-right font-bold text-slate-700 dark:text-slate-300">
                Monthly Recurring Commitment:
              </td>
              <td className="py-4 px-6 text-right font-mono font-black text-base text-emerald-600 dark:text-emerald-400">
                {formatINR(subscription.totalRecurringMinor || 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Cancellation / Termination Section */}
      <div className="p-6 rounded-[14px] border border-red-200/80 dark:border-red-950/60 bg-red-50/30 dark:bg-red-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-red-900 dark:text-red-300">
            Terminate Subscription
          </h3>
          <p className="text-xs text-red-700/80 dark:text-red-400 mt-0.5 max-w-xl">
            Canceling your subscription takes effect at the end of the current billing cycle. All data backups will remain accessible for 30 days.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActionModal("cancel")}
          className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-400 shrink-0"
        >
          <XCircle className="w-3.5 h-3.5 mr-1.5" />
          Cancel Subscription
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={actionModal !== null}
        onClose={() => setActionModal(null)}
        title={
          actionModal === "renew"
            ? "Confirm Subscription Renewal"
            : actionModal === "pause"
            ? "Pause Subscription"
            : "Cancel Subscription"
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {actionModal === "renew" &&
              "Renewing this agreement will extend your license period for 12 additional months at the locked recurring rate."}
            {actionModal === "pause" &&
              "Pausing stops scheduled billing runs for this agreement. You can resume at any time without re-entry setup."}
            {actionModal === "cancel" &&
              "Are you sure you want to request cancellation for this agreement? Your customer success manager will be notified."}
          </p>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => setActionModal(null)}
              disabled={isProcessing}
            >
              Back
            </Button>
            <Button
              variant={actionModal === "cancel" ? "danger" : "primary"}
              onClick={() => actionModal && handleAction(actionModal)}
              isLoading={isProcessing}
              className={
                actionModal !== "cancel"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : ""
              }
            >
              {actionModal === "renew"
                ? "Confirm Renewal"
                : actionModal === "pause"
                ? "Pause Agreement"
                : "Confirm Cancellation"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
