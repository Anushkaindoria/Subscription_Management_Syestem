/**
 * Seed Script: Catalog & Plans
 * OWNER: Dev B (@devB)
 *
 * Populates products, variants, recurring plans, and quotation templates.
 */

export async function seedCatalog() {
  console.log("🌱 [Dev B] Seeding Catalog & Plans...");

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

  console.log(`✅ Seeded ${products.length} products, ${variants.length} variants, ${plans.length} plans.`);
  return { products, variants, plans, quotationTemplates };
}

if (require.main === module) {
  seedCatalog()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Failed to seed catalog:", err);
      process.exit(1);
    });
}
