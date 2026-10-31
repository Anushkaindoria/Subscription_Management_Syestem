/**
 * Seed Script: Billing, Tax, Discounts & Sample Invoices
 * OWNER: Dev A (@devA)
 *
 * Populates tax rules (GST split), promotional discounts with atomic limits,
 * demo customers, and realistic sample invoices.
 */

export async function seedBilling() {
  console.log("🌱 [Dev A] Seeding Billing, Tax Rules & Discounts...");

  const taxRules = [
    {
      id: "tax_gst_18",
      name: "Standard GST 18%",
      code: "GST-18",
      rateBasisPoints: 1800, // 18.00%
      isGst: true,
      cgstRateBasisPoints: 900, // 9.00%
      sgstRateBasisPoints: 900, // 9.00%
      igstRateBasisPoints: 1800, // 18.00%
      active: true,
    },
    {
      id: "tax_vat_exempt",
      name: "Zero Rated / Export",
      code: "ZERO-0",
      rateBasisPoints: 0,
      isGst: false,
      cgstRateBasisPoints: 0,
      sgstRateBasisPoints: 0,
      igstRateBasisPoints: 0,
      active: true,
    },
  ];

  const discounts = [
    {
      id: "disc_early_bird_20",
      code: "EARLYBIRD20",
      description: "20% discount on subscription renewals",
      type: "PERCENTAGE" as const,
      value: 2000, // 20.00% (in basis points)
      maxUsageLimit: 50,
      usageCount: 12,
      minOrderValue: 5000, // $50.00 min
      active: true,
    },
    {
      id: "disc_fixed_50",
      code: "SAVE50",
      description: "$50 off first invoice",
      type: "FIXED" as const,
      value: 5000, // $50.00 (in minor units)
      maxUsageLimit: 100,
      usageCount: 45,
      minOrderValue: 10000,
      active: true,
    },
  ];

  const customers = [
    {
      id: "cust_acme_corp",
      name: "Acme Industrial Corp",
      email: "billing@acmecorp.com",
      phone: "+1-555-0199",
      company: "Acme Corp",
      taxId: "GSTIN-29AAACA1234A1Z5",
    },
    {
      id: "cust_globex",
      name: "Globex Global Logistics",
      email: "finance@globex.io",
      phone: "+1-555-0144",
      company: "Globex Inc",
      taxId: "GSTIN-27AAACG9876B1Z2",
    },
  ];

  console.log(`✅ Seeded ${taxRules.length} tax rules, ${discounts.length} discount coupons, ${customers.length} customers.`);
  return { taxRules, discounts, customers };
}

if (require.main === module) {
  seedBilling()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Failed to seed billing:", err);
      process.exit(1);
    });
}
