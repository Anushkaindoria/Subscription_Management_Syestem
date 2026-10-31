/**
 * Seed Script: Catalog, Plans and demo customers
 * OWNER: Dev B (@devB)
 *
 * seedCatalog()    -> sirf data deta hai (koi database call nahi).
 * persistCatalog() -> wahi data database mein likhta hai (upsert, dobara chalane par duplicate nahi banta).
 *
 * Chalane ke liye: npm run db:seed:catalog
 */

import { PrismaClient } from "@prisma/client";

export async function seedCatalog() {
  console.log("[Dev B] Preparing Catalog & Plans data...");

  const products = [
    {
      id: "prod_cloud_crm",
      name: "LoopCRM Enterprise",
      code: "CRM-ENT",
      description: "Omnichannel customer relationship and sales pipeline platform.",
      active: true,
    },
    {
      id: "prod_loop_desk",
      name: "LoopDesk Support Suite",
      code: "DESK-PRO",
      description: "AI-assisted ticket routing, SLA monitoring, and customer portal.",
      active: true,
    },
  ];

  const variants = [
    {
      id: "var_crm_seats_10",
      productId: "prod_cloud_crm",
      name: "Base (up to 10 Seats)",
      sku: "CRM-ENT-10S",
      priceExtra: 0,
    },
    {
      id: "var_crm_seats_50",
      productId: "prod_cloud_crm",
      name: "Growth (up to 50 Seats)",
      sku: "CRM-ENT-50S",
      priceExtra: 15000, // +$150.00 / mo
    },
    {
      id: "var_crm_seats_unlimited",
      productId: "prod_cloud_crm",
      name: "Enterprise Unlimited",
      sku: "CRM-ENT-UNL",
      priceExtra: 45000, // +$450.00 / mo
    },
  ];

  const plans = [
    {
      id: "plan_monthly_pro",
      name: "Monthly Professional",
      code: "PLAN-M-PRO",
      interval: "MONTHLY",
      intervalCount: 1,
      basePrice: 9900, // $99.00 / mo
    },
    {
      id: "plan_quarterly_pro",
      name: "Quarterly Professional (5% off)",
      code: "PLAN-Q-PRO",
      interval: "QUARTERLY",
      intervalCount: 3,
      basePrice: 28200, // $282.00 / quarter
    },
    {
      id: "plan_annual_enterprise",
      name: "Annual Enterprise (2 months free)",
      code: "PLAN-A-ENT",
      interval: "ANNUALLY",
      intervalCount: 12,
      basePrice: 99000, // $990.00 / year
    },
  ];

  const quotationTemplates = [
    {
      id: "tmpl_saas_standard",
      name: "Standard B2B SaaS Bundle",
      description: "CRM Base + Support Suite bundled with 10% annual discount.",
      durationMonths: 12,
    },
  ];

  console.log(
    `Prepared ${products.length} products, ${variants.length} variants, ${plans.length} plans.`,
  );
  return { products, variants, plans, quotationTemplates };
}

const DEMO_CUSTOMERS = [
  {
    name: "Acme Retail Pvt Ltd",
    email: "billing@acmeretail.in",
    phone: "+91-98765-43210",
    company: "Acme Retail Pvt Ltd",
    address: "Block B, Industrial Area, Okhla Phase 1, New Delhi 110020",
    taxId: "07AABCA1234F1Z5",
  },
  {
    name: "Nova Logistics",
    email: "accounts@novalogistics.com",
    phone: "+91-98230-11223",
    company: "Nova Logistics LLP",
    address: "Logistics Park, Navi Mumbai 400705",
    taxId: "27AABCN5678G1Z1",
  },
  {
    name: "Kiran Stores",
    email: "kiran@kiranstores.in",
    phone: "+91-99887-76655",
    company: "Kiran General Stores",
    address: "Market Road, Bengaluru 560002",
    taxId: "29AABCK9988D1Z4",
  },
  {
    name: "Zenith Edutech",
    email: "finance@zenithedu.io",
    phone: "+91-97112-33445",
    company: "Zenith Technologies Inc",
    address: "Cyber City, Gurugram 122002",
    taxId: "06AABCZ4455E1Z7",
  },
  {
    name: "Pixel Studio",
    email: "hello@pixelstudio.design",
    phone: "+91-91234-56789",
    company: "Pixel Creative Lab",
    address: "Indiranagar, Bengaluru 560038",
    taxId: "29AABCP1122M1Z9",
  },
];

function must(map: Map<string, string>, key: string): string {
  const value = map.get(key);
  if (!value) throw new Error(`Seed error: id '${key}' was not created.`);
  return value;
}

export async function persistCatalog() {
  const prisma = new PrismaClient();
  try {
    const data = await seedCatalog();

    // Agar same code/sku pehle se kisi aur id se maujood ho, to uski asli id use hoti hai.
    const productIds = new Map<string, string>();
    for (const p of data.products) {
      const row = await prisma.product.upsert({
        where: { code: p.code },
        create: { id: p.id, name: p.name, code: p.code, description: p.description, active: p.active },
        update: { name: p.name, description: p.description, active: p.active },
      });
      productIds.set(p.id, row.id);
    }

    const variantIds = new Map<string, string>();
    for (const v of data.variants) {
      const row = await prisma.variant.upsert({
        where: { sku: v.sku },
        create: {
          id: v.id,
          productId: must(productIds, v.productId),
          name: v.name,
          sku: v.sku,
          priceExtra: v.priceExtra,
        },
        update: { name: v.name, priceExtra: v.priceExtra },
      });
      variantIds.set(v.id, row.id);
    }

    const planIds = new Map<string, string>();
    for (const p of data.plans) {
      const interval = p.interval as "MONTHLY" | "QUARTERLY" | "ANNUALLY";
      const row = await prisma.plan.upsert({
        where: { code: p.code },
        create: {
          id: p.id,
          name: p.name,
          code: p.code,
          interval,
          intervalCount: p.intervalCount,
          basePrice: p.basePrice,
        },
        update: { name: p.name, interval, intervalCount: p.intervalCount, basePrice: p.basePrice },
      });
      planIds.set(p.id, row.id);
    }

    for (const t of data.quotationTemplates) {
      await prisma.quotationTemplate.upsert({
        where: { id: t.id },
        create: { id: t.id, name: t.name, description: t.description, durationMonths: t.durationMonths },
        update: { name: t.name, description: t.description, durationMonths: t.durationMonths },
      });
      await prisma.quotationTemplateLine.deleteMany({ where: { templateId: t.id } });
      await prisma.quotationTemplateLine.createMany({
        data: [
          {
            templateId: t.id,
            productId: must(productIds, "prod_cloud_crm"),
            variantId: must(variantIds, "var_crm_seats_10"),
            planId: must(planIds, "plan_annual_enterprise"),
            quantity: 1,
            discountPercent: 10,
            sortOrder: 1,
          },
          {
            templateId: t.id,
            productId: must(productIds, "prod_loop_desk"),
            planId: must(planIds, "plan_annual_enterprise"),
            quantity: 1,
            discountPercent: 10,
            sortOrder: 2,
          },
        ],
      });
    }

    // Demo customers: pehle se maujood ho to waise hi rehne do (update khaali).
    for (const c of DEMO_CUSTOMERS) {
      await prisma.customer.upsert({ where: { email: c.email }, create: c, update: {} });
    }

    console.log(
      `Saved to database: ${data.products.length} products, ${data.variants.length} variants, ` +
        `${data.plans.length} plans, ${data.quotationTemplates.length} template(s), ${DEMO_CUSTOMERS.length} customers.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  persistCatalog()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Failed to seed catalog:", err);
      process.exit(1);
    });
}