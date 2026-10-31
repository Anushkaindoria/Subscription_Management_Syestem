/**
 * Billing Module Service
 * OWNER: Dev A (@devA)
 *
 * Implements:
 * 1. Idempotent invoice generation (no duplicate invoices for same billing period)
 * 2. Catch-up billing for lapsed cycles
 * 3. Dry-run mode for previewing billing impacts without mutating DB
 * 4. Discounts (usage-limited) and GST (CGST+SGST or IGST) in integer paise
 */

import { Prisma, TaxRule } from "@prisma/client";
import { BillingRunRequestDTO, BillingRunResultDTO } from "@/contracts";
import { config } from "@/lib/config";
import { clock } from "@/lib/clock";
import { Money } from "@/lib/money";
import { addPeriods, Interval } from "@/lib/billing-period";
import {
  billingRepo,
  DiscountLimitError,
  DueSubscription,
  NewInvoiceInput,
} from "./repo";

const PAYMENT_TERMS_DAYS = 15;
const MAX_CYCLES_PER_SUB = 366; // safety cap for catch-up loops
const MAX_ANCHOR_SEARCH = 5000;
const DEFAULT_TAX_CODE = "GST-18";
// PLACEHOLDER: set to YOUR company's GST state code (first 2 digits of its GSTIN).
// Customer GSTIN with a different state code -> IGST, otherwise CGST + SGST.
const COMPANY_STATE_CODE = "08";

type LineDiscount = NonNullable<DueSubscription["lines"][number]["discount"]>;

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

function isInterState(taxId: string | null | undefined): boolean {
  const code = taxId?.slice(0, 2);
  return !!code && /^\d{2}$/.test(code) && code !== COMPANY_STATE_CODE;
}

function taxRates(rule: TaxRule, interState: boolean) {
  if (!rule.isGst) return { cgst: 0, sgst: 0, igst: rule.rateBasisPoints };
  if (interState) return { cgst: 0, sgst: 0, igst: rule.igstRateBasisPoints ?? rule.rateBasisPoints };
  return { cgst: rule.cgstRateBasisPoints ?? 0, sgst: rule.sgstRateBasisPoints ?? 0, igst: 0 };
}

function discountUsable(
  d: LineDiscount,
  gross: number,
  asOf: Date,
  usage: Map<string, number>,
  blocked: Set<string>,
): boolean {
  if (!d.active || blocked.has(d.id)) return false;
  if (d.validFrom && asOf.getTime() < d.validFrom.getTime()) return false;
  if (d.validUntil && asOf.getTime() > d.validUntil.getTime()) return false;
  if (d.minOrderValue !== null && gross < d.minOrderValue) return false;
  const used = usage.get(d.id) ?? d.usageCount;
  if (d.maxUsageLimit !== null && used >= d.maxUsageLimit) return false;
  return true;
}

function priceSubscription(
  sub: DueSubscription,
  rule: TaxRule,
  asOf: Date,
  usage: Map<string, number>,
  blocked: Set<string>,
) {
  const rates = taxRates(rule, isInterState(sub.customer.taxId));
  const discountIds = new Set<string>();

  const lines = sub.lines.map((l) => {
    const unitPrice = l.unitPrice + (l.variant?.priceExtra ?? 0);
    const gross = unitPrice * l.quantity;

    let discountAmount = 0;
    if (l.discount && discountUsable(l.discount, gross, asOf, usage, blocked)) {
      discountAmount = Money.applyDiscount(gross, l.discount.type, l.discount.value).discountAmount;
      if (discountAmount > 0) discountIds.add(l.discount.id);
    }

    const taxable = gross - discountAmount;
    const taxAmount = Money.calculateGst(taxable, rates.cgst, rates.sgst, rates.igst).totalTaxAmount;

    const parts = [l.product.name];
    if (l.variant) parts.push(`- ${l.variant.name}`);
    if (l.plan) parts.push(`(${l.plan.name})`);

    return {
      description: parts.join(" "),
      quantity: l.quantity,
      unitPrice,
      taxAmount,
      discountAmount,
      totalAmount: taxable + taxAmount,
    };
  });

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const discountAmount = lines.reduce((s, l) => s + l.discountAmount, 0);
  const taxAmount = lines.reduce((s, l) => s + l.taxAmount, 0);
  return {
    lines,
    subtotal,
    discountAmount,
    taxAmount,
    totalAmount: subtotal - discountAmount + taxAmount,
    discountIds: [...discountIds],
  };
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

    let taxRule: TaxRule | null = null;
    if (dueSubscriptions.length > 0) {
      taxRule = await billingRepo.findTaxRuleByCode(DEFAULT_TAX_CODE);
      if (!taxRule) {
        throw new Error(`Tax rule ${DEFAULT_TAX_CODE} not found. Run: npm run db:seed:billing`);
      }
    }

    // Local view of discount usage during this run (updated after each invoice)
    const usage = new Map<string, number>();
    const blocked = new Set<string>();

    for (const sub of dueSubscriptions) {
      if (!sub.nextBillingDate || !taxRule) continue;
      const interval: Interval = sub.renewalInterval;
      const { anchor, index } = resolveAnchor(sub.startDate, sub.nextBillingDate, interval);

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

        let pricing = priceSubscription(sub, taxRule, asOf, usage, blocked);

        if (dto.dryRun) {
          // Preview only: nothing saved, but simulate usage so later cycles price correctly
          totalBilledMinor += pricing.totalAmount;
          for (const id of pricing.discountIds) {
            const d = sub.lines.find((l) => l.discount?.id === id)?.discount;
            usage.set(id, (usage.get(id) ?? d?.usageCount ?? 0) + 1);
          }
          continue;
        }

        let created: { id: string; totalAmount: number } | null = null;
        let skipped = false;

        for (let attempt = 0; attempt < 5 && !created && !skipped; attempt++) {
          pricing = priceSubscription(sub, taxRule, asOf, usage, blocked);
          const input: NewInvoiceInput = {
            subscriptionId: sub.id,
            periodStart,
            periodEnd,
            dueDate: addPeriods(periodStart, "DAILY", PAYMENT_TERMS_DAYS),
            subtotal: pricing.subtotal,
            taxAmount: pricing.taxAmount,
            discountAmount: pricing.discountAmount,
            totalAmount: pricing.totalAmount,
            discountIds: pricing.discountIds,
            lines: pricing.lines,
          };
          try {
            created = await billingRepo.createInvoiceAndAdvance(input, year);
          } catch (err) {
            if (err instanceof DiscountLimitError) {
              // Limit reached (maybe by another run): reprice without this discount
              blocked.add(err.discountId);
              continue;
            }
            if (
              err instanceof Prisma.PrismaClientKnownRequestError &&
              err.code === "P2002" &&
              (await billingRepo.checkInvoiceExists(sub.id, periodStart, periodEnd))
            ) {
              skipped = true; // another run created this period first
              continue;
            }
            throw err;
          }
        }

        if (skipped) {
          invoicesSkippedIdempotent++;
          await billingRepo.advanceNextBillingDate(sub.id, periodEnd);
          continue;
        }
        if (!created) throw new Error(`Could not create invoice for subscription ${sub.id}`);

        invoicesGenerated++;
        totalBilledMinor += created.totalAmount;
        generatedInvoiceIds.push(created.id);
        for (const id of pricing.discountIds) {
          const d = sub.lines.find((l) => l.discount?.id === id)?.discount;
          usage.set(id, (usage.get(id) ?? d?.usageCount ?? 0) + 1);
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