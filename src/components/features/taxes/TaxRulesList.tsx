"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusPill } from "@/components/ui/StatusPill";
import { Percent, Plus, Check, ShieldCheck } from "lucide-react";

export function TaxRulesList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [rules, setRules] = useState([
    {
      id: "tax_gst_18",
      name: "GST 18% (Standard SaaS)",
      code: "GST-18",
      rateBasisPoints: 1800,
      isGst: true,
      cgstRateBasisPoints: 900,
      sgstRateBasisPoints: 900,
      igstRateBasisPoints: 1800,
    },
    {
      id: "tax_gst_12",
      name: "GST 12% (IT Hardware)",
      code: "GST-12",
      rateBasisPoints: 1200,
      isGst: true,
      cgstRateBasisPoints: 600,
      sgstRateBasisPoints: 600,
      igstRateBasisPoints: 1200,
    },
    {
      id: "tax_export_zero",
      name: "Zero Rated Export (SEZ / Overseas)",
      code: "ZERO-0",
      rateBasisPoints: 0,
      isGst: false,
      cgstRateBasisPoints: 0,
      sgstRateBasisPoints: 0,
      igstRateBasisPoints: 0,
    },
  ]);

  const [formState, setFormState] = useState({
    name: "",
    code: "",
    rate: 18,
    isGst: true,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const basisPoints = formState.rate * 100;
    const newRule = {
      id: `tax_${Date.now()}`,
      name: formState.name || "GST Custom Rate",
      code: formState.code || "GST-NEW",
      rateBasisPoints: basisPoints,
      isGst: formState.isGst,
      cgstRateBasisPoints: formState.isGst ? basisPoints / 2 : 0,
      sgstRateBasisPoints: formState.isGst ? basisPoints / 2 : 0,
      igstRateBasisPoints: formState.isGst ? basisPoints : 0,
    };
    setRules([...rules, newRule]);
    setSuccess(`Tax rule "${newRule.name}" created!`);
    setTimeout(() => {
      setSuccess(null);
      setModalOpen(false);
    }, 1200);
  };

  const columns = [
    {
      key: "name",
      header: "Tax Rule / Jurisdiction",
      render: (r: any) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Percent className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{r.name}</div>
            <div className="text-xs text-slate-400 font-mono">{r.code}</div>
          </div>
        </div>
      ),
    },
    {
      key: "rate",
      header: "Effective Rate",
      render: (r: any) => (
        <span className="font-bold text-slate-900 dark:text-white tabular-nums text-sm">
          {(r.rateBasisPoints / 100).toFixed(1)}%
        </span>
      ),
    },
    {
      key: "split",
      header: "Statutory Indian GST Breakdown",
      render: (r: any) => {
        if (!r.isGst) {
          return <span className="text-xs text-slate-400">Exempt / Export Rule</span>;
        }
        return (
          <div className="text-xs space-y-0.5">
            <div className="text-slate-700 dark:text-slate-300">
              Intra-state: CGST ({(r.cgstRateBasisPoints / 100).toFixed(1)}%) + SGST ({(r.sgstRateBasisPoints / 100).toFixed(1)}%)
            </div>
            <div className="text-slate-400">
              Inter-state: IGST ({(r.igstRateBasisPoints / 100).toFixed(1)}%)
            </div>
          </div>
        );
      },
    },
    {
      key: "compliance",
      header: "Compliance",
      render: () => (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
          <ShieldCheck className="w-3.5 h-3.5" /> GST Portal Verified
        </span>
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
              Tax Rules & GST Configuration
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              ADMIN ONLY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Indian Goods & Services Tax (GST) automated intra-state vs. inter-state splits.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
        >
          Add Tax Rule
        </Button>
      </div>

      <DataTable columns={columns} data={rules} />

      {/* Add Tax Rule Modal */}
      {modalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setModalOpen(false)}
          title="Add Statutory Tax Rule"
          description="Define tax percentages and automated state-based GST splitting rules."
        >
          {success ? (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{success}</span>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Rule Name"
                placeholder="e.g. GST 5% Print Media"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Statutory Code"
                  placeholder="GST-05"
                  value={formState.code}
                  onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                  required
                />
                <Input
                  label="Total Tax Rate (%)"
                  type="number"
                  placeholder="18"
                  value={formState.rate}
                  onChange={(e) => setFormState({ ...formState, rate: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-[8px] text-xs text-slate-600 dark:text-slate-300">
                LoopOS automatically splits standard GST 50/50 for intra-state deliveries (CGST + SGST) and applies 100% IGST for inter-state deliveries.
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" size="sm" type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Tax Rule
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
