/**
 * Billing Module Service
 * OWNER: Dev A (@devA)
 *
 * Implements:
 * 1. Idempotent invoice generation (no duplicate invoices for same billing period)
 * 2. Catch-up billing for lapsed cycles
 * 3. Dry-run mode for previewing billing impacts without mutating DB
 */

import { Prisma } from "@prisma/client";
import { BillingRunRequestDTO, BillingRunResultDTO } from "@/contracts";
import { config } from "@/lib/config";
import { clock } from "@/lib/clock";
import { addPeriods, Interval } from "@/lib/billing-period";
import { billingRepo, DueSubscription, NewInvoiceInput } from "./repo";

const PAYMENT_TERMS_DAYS = 15;
const MAX_CYCLES_PER_SUB = 366; // safety cap for catch-up loops
const MAX_ANCHOR_SEARCH = 5000;
// TEMPORARY: flat GST-18 in integer paise. Step 45 replaces this with real tax + discount logic.
const TEMP_GST_BPS = 1800;

/**
 * Find the anchor (original start date) and cycle index k so that
 * addPeriods(anchor, interval, k) === nextBillingDate. Using the original anchor
 * keeps month-end billing correct (31 Jan -> 28 Feb -> 31 Mar).
 */
function resolveAnchor(startDate: Date, nextBilling: Date, interval: Interval) {
  for (let k = 0; k < MAX_ANCHOR_SEARCH; k++) {
    const p = addPeriods(startDate, interval, k);
    if (p.getTime() === nextBilling.getTime()) return { anchor: startDate, index: k };
    if (p.getTime() > nextBilling.getTime()) break;
  }
  return { anchor: nextBilling, index: 0 }; // fallback if dates are not aligned
}

function priceSubscription(sub: DueSubscription) {
  const lines = sub.lines.map((l) => {
    const unitPrice = l.unitPrice + (l.variant?.priceExtra ?? 0);
    const net = unitPrice * l.quantity;
    const taxAmount = Math.round((net * TEMP_GST_BPS) / 10000);
    const parts = [l.product.name];
    if (l.variant) parts.push(`- ${l.variant.name}`);
    if (l.plan) parts.push(`(${l.plan.name})`);
    return {
      description: parts.join(" "),
      quantity: l.quantity,
      unitPrice,
      taxAmount,
      discountAmount: 0,
      totalAmount: net + taxAmount,
    };
  });
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const taxAmount = lines.reduce((s, l) => s + l.taxAmount, 0);
  return { lines, subtotal, taxAmount, discountAmount: 0, totalAmount: subtotal + taxAmount };
}

export class BillingService {
  async executeBillingRun(dto: BillingRunRequestDTO): Promise<BillingRunResultDTO> {
    const startTime = Date.now();
    const asOf = dto.asOfDate ? new Date(dto.asOfDate) : clock.now();

    if (config.isMockApi) {
      return {
        runId: `run_${Date.now()}`,
        asOfDate: asOf.toISOString(),
        isDryRun: dto.dryRun,
        subscriptionsEvaluated: 4,
        invoicesGenerated: dto.dryRun ? 0 : 2,
        invoicesSkippedIdempotent: 2,
        totalBilledMinor: 19800,
        generatedInvoiceIds: dto.dryRun ? [] : ["inv_mock_gen_01", "inv_mock_gen_02"],
        executionTimeMs: Date.now() - startTime + 12,
      };
    }

    const dueSubscriptions = await billingRepo.findDueSubscriptions(asOf);
    let invoicesGenerated = 0;
    let invoicesSkippedIdempotent = 0;
    let totalBilledMinor = 0;
    const generatedInvoiceIds: string[] = [];
    const year = clock.now().getUTCFullYear();

    for (const sub of dueSubscriptions) {
      if (!sub.nextBillingDate) continue;
      const interval: Interval = sub.renewalInterval;
      const { anchor, index } = resolveAnchor(sub.startDate, sub.nextBillingDate, interval);
      const pricing = priceSubscription(sub);

      // Catch-up loop: bill every missed period until we pass asOf
      for (let i = 0; i < MAX_CYCLES_PER_SUB; i++) {
        const periodStart = addPeriods(anchor, interval, index + i);
        const periodEnd = addPeriods(anchor, interval, index + i + 1);
        if (periodStart.getTime() > asOf.getTime()) break;
        if (sub.endDate && periodStart.getTime() >= sub.endDate.getTime()) break;

        const exists = await billingRepo.checkInvoiceExists(sub.id, periodStart, periodEnd);
        if (exists) {
          invoicesSkippedIdempotent++;
          if (!dto.dryRun) await billingRepo.advanceNextBillingDate(sub.id, periodEnd);
          continue;
        }

        if (dto.dryRun) {
          totalBilledMinor += pricing.totalAmount; // preview only, nothing saved
          continue;
        }

        const input: NewInvoiceInput = {
          subscriptionId: sub.id,
          periodStart,
          periodEnd,
          dueDate: addPeriods(periodStart, "DAILY", PAYMENT_TERMS_DAYS),
          subtotal: pricing.subtotal,
          taxAmount: pricing.taxAmount,
          discountAmount: pricing.discountAmount,
          totalAmount: pricing.totalAmount,
          lines: pricing.lines,
        };

        try {
          const invoice = await billingRepo.createInvoiceAndAdvance(input, year);
          invoicesGenerated++;
          totalBilledMinor += invoice.totalAmount;
          generatedInvoiceIds.push(invoice.id);
        } catch (err) {
          // Race: another run created this period first -> treat as idempotent skip
          if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2002" &&
            (await billingRepo.checkInvoiceExists(sub.id, periodStart, periodEnd))
          ) {
            invoicesSkippedIdempotent++;
            await billingRepo.advanceNextBillingDate(sub.id, periodEnd);
            continue;
          }
          throw err;
        }
      }
    }

    return {
      runId: `run_${Date.now()}`,
      asOfDate: asOf.toISOString(),
      isDryRun: dto.dryRun,
      subscriptionsEvaluated: dueSubscriptions.length,
      invoicesGenerated,
      invoicesSkippedIdempotent,
      totalBilledMinor,
      generatedInvoiceIds,
      executionTimeMs: Date.now() - startTime,
    };
  }
}

export const billingService = new BillingService();