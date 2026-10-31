"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusPill } from "@/components/ui/StatusPill";
import { MOCK_DISCOUNTS } from "@/mocks";
import { Tag, Plus, Check, Percent } from "lucide-react";

export function DiscountsList() {
  const [discounts, setDiscounts] = useState(MOCK_DISCOUNTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    name: "",
    kind: "percentage",
    value: 10,
    appliesTo: "products",
    minQuantity: 10,
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    usageLimit: 50,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newDisc = {
      id: `disc_${Date.now()}`,
      name: formState.name || "Festive Growth Offer",
      kind: formState.kind as any,
      value: formState.value,
      appliesTo: formState.appliesTo as any,
      productIds: [],
      minQuantity: formState.minQuantity,
      minPurchase: 0,
      active: true,
      startDate: formState.startDate,
      endDate: formState.endDate,
      usageLimit: formState.usageLimit,
      usedCount: 0,
    };
    setDiscounts([...discounts, newDisc as any]);
    setSuccess(`Discount "${newDisc.name}" created!`);
    setTimeout(() => {
      setSuccess(null);
      setModalOpen(false);
    }, 1200);
  };

  const columns = [
    {
      key: "name",
      header: "Coupon / Discount Name",
      render: (d: any) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Tag className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{d.name}</div>
            <div className="text-xs text-slate-400 capitalize">{d.appliesTo} Discount</div>
          </div>
        </div>
      ),
    },
    {
      key: "value",
      header: "Value / Rate",
      render: (d: any) => (
        <span className="font-bold text-emerald-600 tabular-nums">
          {d.kind === "percentage" ? `${d.value}% OFF` : `₹${d.value / 100} Fixed`}
        </span>
      ),
    },
    {
      key: "minQuantity",
      header: "Min Quantity",
      align: "center" as const,
      render: (d: any) => <span className="tabular-nums font-semibold">{d.minQuantity || "None"}</span>,
    },
    {
      key: "validity",
      header: "Validity Period",
      render: (d: any) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {formatDate(d.startDate)} – {formatDate(d.endDate)}
        </span>
      ),
    },
    {
      key: "usage",
      header: "Usage Count",
      render: (d: any) => (
        <div className="space-y-1">
          <div className="text-xs font-semibold tabular-nums text-slate-800 dark:text-slate-200">
            {d.usedCount} of {d.usageLimit || "∞"} used
          </div>
          <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${Math.min(100, ((d.usedCount || 0) / (d.usageLimit || 50)) * 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: () => <StatusPill status="active" />,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Promotional Discounts & Coupons
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              ADMIN ONLY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure volume discounts, coupon redemption caps, and time-bounded promotional campaigns.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
        >
          Create Discount
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={discounts}
        emptyTitle="No active discounts"
        emptyDescription="Create discount campaigns to drive customer subscriptions."
      />

      {/* Create Discount Modal */}
      {modalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setModalOpen(false)}
          title="Create Promotional Discount"
          description="Define discount percentage or fixed deductions applied during invoice generation."
        >
          {success ? (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{success}</span>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Campaign / Rule Name"
                placeholder="e.g. Seats 10+ Volume Discount"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Discount Kind"
                  value={formState.kind}
                  onChange={(e) => setFormState({ ...formState, kind: e.target.value })}
                  options={[
                    { value: "percentage", label: "Percentage Reduction (%)" },
                    { value: "fixed", label: "Fixed Amount (Paise)" },
                  ]}
                />

                <Input
                  label="Discount Value"
                  type="number"
                  placeholder="10"
                  value={formState.value}
                  onChange={(e) => setFormState({ ...formState, value: Number(e.target.value) })}
                  helperText={formState.kind === "percentage" ? "10 = 10% off" : "Fixed minor units"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Minimum Quantity Rule"
                  type="number"
                  value={formState.minQuantity}
                  onChange={(e) => setFormState({ ...formState, minQuantity: Number(e.target.value) })}
                  helperText="Required quantity to trigger discount"
                />

                <Input
                  label="Total Usage Limit"
                  type="number"
                  value={formState.usageLimit}
                  onChange={(e) => setFormState({ ...formState, usageLimit: Number(e.target.value) })}
                  helperText="Max redemptions allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Active Start Date"
                  type="date"
                  value={formState.startDate}
                  onChange={(e) => setFormState({ ...formState, startDate: e.target.value })}
                />
                <Input
                  label="Expiry Date"
                  type="date"
                  value={formState.endDate}
                  onChange={(e) => setFormState({ ...formState, endDate: e.target.value })}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" size="sm" type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Rule
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
