import { describe, it, expect, vi, afterEach } from "vitest";

// Force the REAL engine (not the mock branch)
vi.mock("@/lib/config", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/lib/config")>();
  return { ...mod, config: { ...mod.config, isMockApi: false } };
});

import { db } from "@/lib/db";
import { billingService } from "@/modules/billing";
import { invoiceService } from "@/modules/invoices";

const d = (iso: string) => new Date(`${iso}T00:00:00.000Z`);
const tag = () => Math.random().toString(36).slice(2, 8);

let ids: { customerId: string; productId: string; subId: string; discountId?: string };

async function setup(opts?: { discountLimit?: number }) {
  const t = tag();
  const customer = await db.customer.create({
    data: { name: `T-${t}`, email: `t-${t}@test.local`, taxId: "08AAAAA0000A1Z5" },
  });
  const product = await db.product.create({ data: { name: `P-${t}`, code: `P-${t}` } });
  let discountId: string | undefined;
  if (opts?.discountLimit !== undefined) {
    const disc = await db.discount.create({
      data: { code: `D-${t}`, type: "PERCENTAGE", value: 1000, maxUsageLimit: opts.discountLimit },
    });
    discountId = disc.id;
  }
  const sub = await db.subscription.create({
    data: {
      customerId: customer.id,
      status: "ACTIVE",
      startDate: d("2026-01-31"),
      nextBillingDate: d("2026-01-31"),
      renewalInterval: "MONTHLY",
      lines: {
        create: [{ productId: product.id, quantity: 1, unitPrice: 149900, discountId }],
      },
    },
  });
  ids = { customerId: customer.id, productId: product.id, subId: sub.id, discountId };
}

afterEach(async () => {
  if (!ids) return;
  await db.invoice.deleteMany({ where: { subscriptionId: ids.subId } });
  await db.subscription.deleteMany({ where: { id: ids.subId } });
  await db.customer.deleteMany({ where: { id: ids.customerId } });
  await db.product.deleteMany({ where: { id: ids.productId } });
  if (ids.discountId) await db.discount.deleteMany({ where: { id: ids.discountId } });
});

describe("billing engine (real DB)", () => {
  it("running twice creates no duplicate invoices", async () => {
    await setup();
    const asOf = "2026-02-01T00:00:00.000Z";
    await billingService.executeBillingRun({ asOfDate: asOf, dryRun: false });
    await billingService.executeBillingRun({ asOfDate: asOf, dryRun: false });
    const invoices = await db.invoice.findMany({ where: { subscriptionId: ids.subId } });
    expect(invoices).toHaveLength(1);
    expect(invoices[0].totalAmount).toBe(176882); // 149900 + 18% GST
  });

  it("catches up all missed periods after downtime", async () => {
    await setup();
    await billingService.executeBillingRun({ asOfDate: "2026-03-31T00:00:00.000Z", dryRun: false });
    const invoices = await db.invoice.findMany({
      where: { subscriptionId: ids.subId },
      orderBy: { periodStart: "asc" },
    });
    expect(invoices.map((i) => i.periodStart.toISOString().slice(0, 10))).toEqual([
      "2026-01-31",
      "2026-02-28",
      "2026-03-31",
    ]);
    const sub = await db.subscription.findUnique({ where: { id: ids.subId } });
    expect(sub?.nextBillingDate?.toISOString().slice(0, 10)).toBe("2026-04-30");
  });

  it("dry run saves nothing", async () => {
    await setup();
    const res = await billingService.executeBillingRun({
      asOfDate: "2026-03-31T00:00:00.000Z",
      dryRun: true,
    });
    expect(res.invoicesGenerated).toBe(0);
    expect(await db.invoice.count({ where: { subscriptionId: ids.subId } })).toBe(0);
  });

  it("stops applying a discount once its usage limit is exhausted", async () => {
    await setup({ discountLimit: 1 });
    await billingService.executeBillingRun({ asOfDate: "2026-02-28T00:00:00.000Z", dryRun: false });
    const invoices = await db.invoice.findMany({
      where: { subscriptionId: ids.subId },
      orderBy: { periodStart: "asc" },
    });
    expect(invoices).toHaveLength(2);
    expect(invoices[0].discountAmount).toBe(14990); // 10% of 149900
    expect(invoices[1].discountAmount).toBe(0); // limit of 1 already used
    const disc = await db.discount.findUnique({ where: { id: ids.discountId } });
    expect(disc?.usageCount).toBe(1);
  });

  it('cancel returns discount usage', async () => {
    await setup({ discountLimit: 5 });
    await billingService.executeBillingRun({ asOfDate: '2026-01-31T00:00:00.000Z', dryRun: false });
    const inv = await db.invoice.findFirstOrThrow({ where: { subscriptionId: ids.subId } });
    expect((await db.discount.findUnique({ where: { id: ids.discountId } }))?.usageCount).toBe(1);
    await invoiceService.transitionStatus(inv.id, 'VOID');
    expect((await db.discount.findUnique({ where: { id: ids.discountId } }))?.usageCount).toBe(0);
    expect((await db.invoice.findUniqueOrThrow({ where: { id: inv.id } })).status).toBe('CANCELLED');
  });

  it('paused subscription is not billed', async () => {
    await setup({ discountLimit: 5 });
    await db.subscription.update({ where: { id: ids.subId }, data: { isPaused: true } });
    await billingService.executeBillingRun({ asOfDate: '2026-01-31T00:00:00.000Z', dryRun: false });
    expect(await db.invoice.count({ where: { subscriptionId: ids.subId } })).toBe(0);
  });
});
