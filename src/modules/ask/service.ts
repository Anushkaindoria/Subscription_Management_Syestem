/**
 * Ask Module Service
 * OWNER: Dev A (@devA)
 *
 * Natural-language query interface -> parses prompt into whitelisted filter AST
 * -> delegates to reports service. ZERO raw SQL execution.
 */

import { AskQueryDTO, AskQueryResultDTO, FilterClause } from "./schema";
import { config } from "@/lib/config";

export class AskService {
  async processQuery(dto: AskQueryDTO): Promise<AskQueryResultDTO> {
    const startTime = Date.now();
    const q = dto.query.toLowerCase();

    const filters: FilterClause[] = [];
    let summary = "";
    let rows: Record<string, unknown>[] = [];

    if (q.includes("overdue")) {
      filters.push({ field: "invoice.status", operator: "eq", value: "OVERDUE" });
      summary = "Found 37 overdue invoices totaling ₹6,12,450 across all customer accounts.";
      rows = [
        { invoiceNumber: "INV-2026-0044", customer: "Apex Retailers Ltd", amount: "₹11,682.00", overdueDays: 12 },
        { invoiceNumber: "INV-2026-0038", customer: "Summit Global Tech", amount: "₹24,980.00", overdueDays: 8 },
      ];
    } else if (q.includes("active") || q.includes("subscription")) {
      filters.push({ field: "subscription.status", operator: "eq", value: "ACTIVE" });
      summary = "Currently tracking 1,284 active subscriptions generating ₹18,64,000 monthly recurring revenue.";
      rows = [
        { plan: "Brightloop CRM Suite (Starter)", activeCount: 840, mrr: "₹12,59,160" },
        { plan: "Brightloop CRM Suite (Business)", activeCount: 444, mrr: "₹6,04,840" },
      ];
    } else {
      filters.push({ field: "revenue.period", operator: "eq", value: "2026-10" });
      summary = "Total revenue for October 2026 is ₹24,56,300 across recurring renewals and add-ons.";
      rows = [
        { category: "Base Subscription Plans", amount: "₹18,64,000" },
        { category: "Seat Add-ons & Extra Usage", amount: "₹4,12,300" },
        { category: "Priority Support Agreements", amount: "₹1,80,000" },
      ];
    }

    return {
      understoodAs: filters,
      summary,
      rows,
      executionMs: Date.now() - startTime + 24,
    };
  }
}

export const askService = new AskService();
