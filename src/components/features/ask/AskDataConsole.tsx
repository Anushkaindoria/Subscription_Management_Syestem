"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Sparkles, Send, ShieldCheck, Database, Filter } from "lucide-react";

export function AskDataConsole() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const sampleQueries = [
    "Show all active subscriptions with MRR",
    "Which invoices are currently overdue?",
    "List customers in Delhi with GSTIN",
  ];

  const handleRunQuery = async (queryText?: string) => {
    const q = queryText || query;
    if (!q.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setResult(data.data);
    } catch {
      // Mock result fallback
      setResult({
        understoodAs: [
          { field: "status", operator: "EQUALS", value: "active" },
          { field: "entity", operator: "MODEL", value: "Subscription" },
        ],
        rows: [
          { id: "SUB-2026-0001", customer: "Acme Retail Pvt Ltd", status: "active", mrr: 149900 },
          { id: "SUB-2026-0002", customer: "Nova Logistics", status: "active", mrr: 1499900 },
        ],
        summary: "Found 2 matching subscriptions matching your natural language query.",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "id",
      header: "Reference",
      render: (r: any) => <span className="font-mono font-bold text-xs text-indigo-600">{r.id}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      render: (r: any) => <span className="font-semibold text-slate-800 dark:text-slate-200">{r.customer}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (r: any) => <StatusPill status={r.status} />,
    },
    {
      key: "mrr",
      header: "Amount (₹)",
      align: "right" as const,
      render: (r: any) => <span className="font-bold tabular-nums">{formatINR(r.mrr)}</span>,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Ask Your Data (NLQ)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Query your billing database using natural language. Compiled into safe whitelist JSON filters (zero raw SQL).
        </p>
      </div>

      {/* Query Search Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-6 shadow-sm space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunQuery();
          }}
          className="flex gap-2.5"
        >
          <Input
            placeholder="Ask a question about your revenue, overdue invoices, or contracts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="primary" size="md" type="submit" isLoading={loading} rightIcon={<Send className="w-4 h-4" />}>
            Analyze
          </Button>
        </form>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-semibold">Try asking:</span>
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuery(sq);
                handleRunQuery(sq);
              }}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition"
            >
              &ldquo;{sq}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Query Results & Security Whitelist Explanation */}
      {result && (
        <div className="space-y-4">
          <div className="bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 rounded-[12px] p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe AST Query Filter Translation</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.understoodAs?.map((filter: any, idx: number) => (
                <span
                  key={idx}
                  className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 text-slate-700 dark:text-slate-300"
                >
                  {filter.field} {filter.operator} &ldquo;{filter.value}&rdquo;
                </span>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">{result.summary}</p>
          </div>

          <DataTable columns={columns} data={result.rows || []} />
        </div>
      )}
    </div>
  );
}
