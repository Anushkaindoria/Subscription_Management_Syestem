/**
 * Seed Script: Demo plans + subscriptions (SUB-2026-0001/2/3)
 * OWNER: Dev B (@devB)
 *
 * Pehle `npm run db:seed:catalog` chalao (customers, products, variants chahiye).
 * Dobara chalane par duplicate nahi banta (plan code / subscription number se check).
 *
 * Chalane ke liye: npm run db:seed:subscriptions
 */

import { PrismaClient, type BillingInterval, type SubscriptionStatus } from "@prisma/client";

type DemoPlan = {
  id: string;
  name: string;
  code: string;
  interval: BillingInterval;
  intervalCount: number;
  basePrice: number; // minor units (paise)
};

const DEMO_PLANS: DemoPlan[] = [
  {
    id: "plan_starter_monthly",
    name: "Starter Monthly",
    code: "PLAN-STARTER-M",
    interval: "MONTHLY",
    intervalCount: 1,
    basePrice: 149900, // Rs 1,499
  },
  {
    id: "plan_business_yearly",
    name: "Business Yearly",
    code: "PLAN-BUSINESS-Y",
    interval: "ANNUALLY",
    intervalCount: 12,
    basePrice: 1499900, // Rs 14,999
  },
  {
    id: "plan_team_weekly",
    name: "Team Weekly",
    code: "PLAN-TEAM-W",
    interval: "WEEKLY",
    intervalCount: 1,
    basePrice: 39900, // Rs 399
  },
  {
    id: "plan_daily_trial",
    name: "Daily Trial",
    code: "PLAN-TRIAL-D",
    interval: "DAILY",
    intervalCount: 1,
    basePrice: 4900, // Rs 49
  },
];

type DemoSub = {
  number: string;
  customerEmail: string;
  planCode: string;
  productCode: string;
  variantSku?: string;
  status: SubscriptionStatus;
  renewalInterval: BillingInterval;
  startDate: Date;
  nextBillingDate: Date | null;
};

// Active wali subscriptions ka nextBillingDate = start + 1 period
// (maan ke ki pehla invoice invoices seed mein pehle se bana hai).
const DEMO_SUBS: DemoSub[] = [
  {
    number: "SUB-2026-0001",
    customerEmail: "billing@acmeretail.in",
    planCode: "PLAN-BUSINESS-Y",
    productCode: "CRM-ENT",
    variantSku: "CRM-ENT-10S",
    status: "ACTIVE",
    renewalInterval: "ANNUALLY",
    startDate: new Date(Date.UTC(2026, 0, 1)),
    nextBillingDate: new Date(Date.UTC(2027, 0, 1)),
  },
  {
    number: "SUB-2026-0002",
    customerEmail: "accounts@novalogistics.com",
    planCode: "PLAN-STARTER-M",
    productCode: "DESK-PRO",
    status: "ACTIVE",
    renewalInterval: "MONTHLY",
    startDate: new Date(Date.UTC(2026, 9, 1)),
    nextBillingDate: new Date(Date.UTC(2026, 10, 1)),
  },
  {
    number: "SUB-2026-0003",
    customerEmail: "kiran@kiranstores.in",
    planCode: "PLAN-STARTER-M",
    productCode: "DESK-PRO",
    status: "CONFIRMED",
    renewalInterval: "MONTHLY",
    startDate: new Date(Date.UTC(2026, 10, 1)),
    nextBillingDate: null,
  },
];

function need<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) {
    throw new Error(`Seed error: ${what} not found. Pehle 'npm run db:seed:catalog' chalao.`);
  }
  return value;
}

export async function persistSubscriptions() {
  const prisma = new PrismaClient();
  try {
    const planByCode = new Map<string, { id: string; basePrice: number }>();
    for (const p of DEMO_PLANS) {
      const row = await prisma.plan.upsert({
        where: { code: p.code },
        create: {
          id: p.id,
          name: p.name,
          code: p.code,
          interval: p.interval,
          intervalCount: p.intervalCount,
          basePrice: p.basePrice,
        },
        update: {
          name: p.name,
          interval: p.interval,
          intervalCount: p.intervalCount,
          basePrice: p.basePrice,
        },
      });
      planByCode.set(p.code, { id: row.id, basePrice: row.basePrice });
    }

    let created = 0;
    let skipped = 0;
    for (const s of DEMO_SUBS) {
      const existing = await prisma.subscription.findUnique({ where: { number: s.number } });
      if (existing) {
        skipped++;
        continue;
      }

      const customer = need(
        await prisma.customer.findUnique({ where: { email: s.customerEmail } }),
        `customer ${s.customerEmail}`,
      );
      const plan = need(planByCode.get(s.planCode), `plan ${s.planCode}`);
      const product = need(
        await prisma.product.findUnique({ where: { code: s.productCode } }),
        `product ${s.productCode}`,
      );
      const variant = s.variantSku
        ? need(
            await prisma.variant.findUnique({ where: { sku: s.variantSku } }),
            `variant ${s.variantSku}`,
          )
        : null;

      await prisma.subscription.create({
        data: {
          number: s.number,
          customerId: customer.id,
          status: s.status,
          startDate: s.startDate,
          nextBillingDate: s.nextBillingDate,
          renewalInterval: s.renewalInterval,
          lines: {
            create: [
              {
                productId: product.id,
                variantId: variant?.id,
                planId: plan.id,
                quantity: 1,
                unitPrice: plan.basePrice + (variant?.priceExtra ?? 0),
              },
            ],
          },
        },
      });
      created++;
    }

    console.log(
      `Saved to database: ${DEMO_PLANS.length} plans, ${created} new subscription(s), ${skipped} already existed.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  persistSubscriptions()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Failed to seed subscriptions:", err);
      process.exit(1);
    });
}