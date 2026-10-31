/**
 * Subscriptions Lifecycle (real database)
 * OWNER: Dev B (@devB)
 *
 * DRAFT -> QUOTATION -> CONFIRMED -> ACTIVE -> CLOSED
 * pause / resume: isPaused flag (status Active hi rehta hai).
 * renew: abhi "not supported yet".
 */

import type { z } from "zod";
import type { SubscriptionStatus as DbStatus } from "@prisma/client";
import type { SubscriptionStatus as ContractStatus } from "@/contracts/enums";
import type {
  Subscription as SubscriptionDTO,
  SubscriptionAction,
  CreateSubscriptionSchema,
} from "@/contracts/subscription";
import { clock } from "@/lib/clock";
import {
  BusinessRuleError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";
import { subscriptionRepo, type SubscriptionRecord } from "./repo";

// Route validate karta hai, par zod ke defaults (quantity, discountPercent) optional aate hain.
type CreateSubscriptionInput = z.input<typeof CreateSubscriptionSchema>;

// Contract mein isPaused nahi hai (Dev A ka file), isliye extra field ke saath.
export type SubscriptionView = SubscriptionDTO & { isPaused: boolean };

type Rule = { from: DbStatus[]; to: DbStatus };

const RULES: Partial<Record<SubscriptionAction, Rule>> = {
  send_quotation: { from: ["DRAFT"], to: "QUOTATION" },
  confirm: { from: ["QUOTATION"], to: "CONFIRMED" },
  activate: { from: ["CONFIRMED"], to: "ACTIVE" },
  close: { from: ["DRAFT", "QUOTATION", "CONFIRMED", "ACTIVE"], to: "CLOSED" },
};

const NOT_SUPPORTED_YET: SubscriptionAction[] = ["renew"];

function num(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function parseDate(value: string, field: string): Date {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new ValidationError(`${field} is not a valid date.`);
  }
  return d;
}

// Contract string <-> database days: "Immediate" = 0, "Net 15" = 15.
function termsToDays(value: string | undefined): number {
  const v = (value ?? "Immediate").trim();
  if (/^immediate$/i.test(v)) return 0;
  const m = /^net\s*(\d{1,3})$/i.exec(v);
  if (!m) {
    throw new ValidationError(`paymentTerms '${value}' is not valid. Use "Immediate" or "Net 15".`);
  }
  return Number(m[1]);
}

function daysToTerms(days: number): string {
  return days <= 0 ? "Immediate" : `Net ${days}`;
}

// Purani rows (number NULL) ke liye id se banaya hua placeholder.
function subscriptionNumber(rec: SubscriptionRecord): string {
  return rec.number ?? `SUB-${rec.createdAt.getUTCFullYear()}-${rec.id.slice(-4).toUpperCase()}`;
}

function toDto(rec: SubscriptionRecord): SubscriptionView {
  const planLine = rec.lines.find((l) => l.planId);
  const lines = rec.lines.map((l) => ({
    id: l.id,
    productId: l.productId,
    productName: l.product.name,
    quantity: l.quantity,
    unitPrice: l.unitPrice,
    discountPercent: 0,
  }));

  return {
    id: rec.id,
    number: subscriptionNumber(rec),
    customerId: rec.customerId,
    customerName: rec.customer.name,
    planId: planLine?.planId ?? "",
    planName: planLine?.plan?.name,
    startDate: rec.startDate.toISOString(),
    expiryDate: rec.endDate ? rec.endDate.toISOString() : null,
    paymentTerms: daysToTerms(rec.paymentTerms),
    status: rec.status.toLowerCase() as ContractStatus,
    nextBillingDate: rec.nextBillingDate ? rec.nextBillingDate.toISOString() : null,
    lines,
    totalRecurringMinor: lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    isPaused: rec.isPaused,
  };
}

export class SubscriptionLifecycle {
  async list(opts: {
    customerId?: string;
    status?: ContractStatus;
    page?: number;
    pageSize?: number;
  }) {
    const page = Math.max(1, num(opts.page, 1));
    const pageSize = Math.min(100, Math.max(1, num(opts.pageSize, 25)));
    const { rows, total } = await subscriptionRepo.listPage({
      customerId: opts.customerId,
      status: opts.status ? (opts.status.toUpperCase() as DbStatus) : undefined,
      page,
      pageSize,
    });
    return {
      items: rows.map(toDto),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  // customerId dene par sirf usi customer ki subscription milti hai (portal ke liye).
  async getById(id: string, opts: { customerId?: string } = {}): Promise<SubscriptionView> {
    const rec = await subscriptionRepo.findById(id);
    if (!rec || (opts.customerId && rec.customerId !== opts.customerId)) {
      throw new NotFoundError("Subscription", id);
    }
    return toDto(rec);
  }

  async create(input: CreateSubscriptionInput): Promise<SubscriptionView> {
    const start = parseDate(input.startDate, "startDate");
    const end = input.expiryDate ? parseDate(input.expiryDate, "expiryDate") : null;
    if (end && end < start) {
      throw new ValidationError("expiryDate cannot be before startDate.");
    }
    const termsDays = termsToDays(input.paymentTerms);
    for (const line of input.lines) {
      if (line.discountPercent && line.discountPercent !== 0) {
        throw new ValidationError(
          "Line discounts are applied by billing, not on subscription lines.",
        );
      }
      if (line.unitPrice < 0) {
        throw new ValidationError("unitPrice cannot be negative.");
      }
    }

    const customer = await subscriptionRepo.findCustomer(input.customerId);
    if (!customer) throw new NotFoundError("Customer", input.customerId);

    const plan = await subscriptionRepo.findPlan(input.planId);
    if (!plan) throw new NotFoundError("Plan", input.planId);
    if (!plan.active) throw new BusinessRuleError("This plan is not active.");

    const productIds = Array.from(new Set(input.lines.map((l) => l.productId)));
    const found = await subscriptionRepo.findProducts(productIds);
    const known = new Set(found.map((p) => p.id));
    const missing = productIds.filter((id) => !known.has(id));
    if (missing.length > 0) throw new NotFoundError("Product", missing.join(", "));

    const created = await subscriptionRepo.createDraft({
      customerId: input.customerId,
      startDate: start,
      endDate: end,
      paymentTerms: termsDays,
      year: clock.now().getUTCFullYear(),
      lines: input.lines.map((l) => ({
        productId: l.productId,
        planId: input.planId,
        quantity: l.quantity ?? 1,
        unitPrice: l.unitPrice,
      })),
    });
    return toDto(created);
  }

  async transition(id: string, action: SubscriptionAction): Promise<SubscriptionView> {
    if (NOT_SUPPORTED_YET.includes(action)) {
      throw new BusinessRuleError(`Action '${action}' is not supported yet.`);
    }
    if (action === "pause" || action === "resume") {
      return this.setPaused(id, action === "pause");
    }
    const rule = RULES[action];
    if (!rule) throw new ValidationError(`Unknown action '${action}'.`);

    const current = await subscriptionRepo.findById(id);
    if (!current) throw new NotFoundError("Subscription", id);

    if (!rule.from.includes(current.status)) {
      throw new BusinessRuleError(
        `Cannot ${action} a subscription that is ${current.status.toLowerCase()}. ` +
          `Allowed from: ${rule.from.map((s) => s.toLowerCase()).join(", ")}.`,
      );
    }

    const data: { nextBillingDate?: Date | null; cancelledAt?: Date | null } = {};
    if (action === "activate") data.nextBillingDate = current.startDate;
    if (action === "close") data.cancelledAt = clock.now();

    const changed = await subscriptionRepo.transitionStatus({
      id,
      from: current.status,
      to: rule.to,
      data,
    });
    if (changed === 0) {
      throw new ConflictError("Subscription was changed by another request. Please retry.");
    }

    const updated = await subscriptionRepo.findById(id);
    if (!updated) throw new NotFoundError("Subscription", id);
    return toDto(updated);
  }

  // Pause/resume: status Active hi rehta hai, sirf isPaused badalta hai.
  private async setPaused(id: string, pause: boolean): Promise<SubscriptionView> {
    const action = pause ? "pause" : "resume";
    const current = await subscriptionRepo.findById(id);
    if (!current) throw new NotFoundError("Subscription", id);

    if (current.status !== "ACTIVE") {
      throw new BusinessRuleError(
        `Cannot ${action} a subscription that is ${current.status.toLowerCase()}. Only active subscriptions can be paused or resumed.`,
      );
    }
    if (pause) {
      if (current.isPaused) throw new BusinessRuleError("Subscription is already paused.");
      const planLine = current.lines.find((l) => l.plan);
      if (planLine?.plan?.pausable === false) {
        throw new BusinessRuleError("This plan cannot be paused.");
      }
    } else if (!current.isPaused) {
      throw new BusinessRuleError("Subscription is not paused.");
    }

    const changed = await subscriptionRepo.setPaused({
      id,
      from: current.isPaused,
      to: pause,
    });
    if (changed === 0) {
      throw new ConflictError("Subscription was changed by another request. Please retry.");
    }

    const updated = await subscriptionRepo.findById(id);
    if (!updated) throw new NotFoundError("Subscription", id);
    return toDto(updated);
  }
}

export const subscriptionLifecycle = new SubscriptionLifecycle();