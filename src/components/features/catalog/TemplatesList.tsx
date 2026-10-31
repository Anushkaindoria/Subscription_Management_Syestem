"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { MOCK_CUSTOMERS, MOCK_PRODUCTS, MOCK_PLANS } from "@/mocks";
import { FileSpreadsheet, Plus, Sparkles, Check, ArrowRight } from "lucide-react";

export function TemplatesList() {
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(MOCK_CUSTOMERS[0].id);
  const [quoteSuccess, setQuoteSuccess] = useState<string | null>(null);

  const templates = [
    {
      id: "tmpl_saas_starter",
      name: "SaaS Starter Bundle",
      description: "Standard monthly package for emerging software companies. Includes 5 user seats and priority SLA.",
      product: MOCK_PRODUCTS[0],
      plan: MOCK_PLANS[0],
      defaultLines: [
        { label: "Brightloop CRM Suite (Native)", qty: 1, price: 120000 },
        { label: "Extra Seats Add-on", qty: 5, price: 50000 },
      ],
      totalEstimate: 170000,
    },
    {
      id: "tmpl_enterprise_annual",
      name: "Enterprise Annual Agreement",
      description: "Full-scale corporate contract with yearly upfront commitment, unlimited support, and ERP connectors.",
      product: MOCK_PRODUCTS[0],
      plan: MOCK_PLANS[1],
      defaultLines: [
        { label: "Brightloop CRM Suite (Odoo Connector)", qty: 1, price: 176000 },
        { label: "Priority Support Plan", qty: 1, price: 49900 },
      ],
      totalEstimate: 225900,
    },
  ];

  const handleGenerateQuote = () => {
    setQuoteSuccess(`Quotation generated successfully for ${MOCK_CUSTOMERS.find((c) => c.id === selectedCustomerId)?.name}! Created agreement in QUOTATION state.`);
    setTimeout(() => {
      setSelectedTemplate(null);
      setQuoteSuccess(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Quotation Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standardized subscription product bundles for one-click quotation dispatch.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {tmpl.name}
                  </h3>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    {tmpl.plan.name}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                {tmpl.description}
              </p>

              <div className="space-y-2 mb-6 p-3.5 rounded-[10px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Included Package Items
                </span>
                {tmpl.defaultLines.map((line, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 dark:text-slate-300">
                      {line.qty}x {line.label}
                    </span>
                    <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                      {formatINR(line.price)}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs font-bold">
                  <span>Estimated Total:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {formatINR(tmpl.totalEstimate)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setSelectedTemplate(tmpl)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="w-full"
            >
              Generate Customer Quote
            </Button>
          </div>
        ))}
      </div>

      {/* Quote Generation Modal */}
      {selectedTemplate && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTemplate(null)}
          title={`Generate Quote from ${selectedTemplate.name}`}
          description="Select target customer. A new agreement will be initialized in 'QUOTATION' state ready for client review."
        >
          {quoteSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{quoteSuccess}</span>
            </div>
          ) : (
            <div className="space-y-4">
              <Select
                label="Target Customer"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                options={MOCK_CUSTOMERS.map((c) => ({
                  value: c.id,
                  label: `${c.name} (${c.taxId || "No GST"})`,
                }))}
              />
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-[8px] text-xs text-slate-500">
                Initial billing term: Net 15 days upon customer confirmation.
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setSelectedTemplate(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleGenerateQuote} leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                  Dispatch Quote
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
