import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedBilling() {
  console.log("[Dev A] Seeding tax rules and discounts...");

  const taxRules = [
    {
      code: "GST-18",
      name: "Standard GST 18%",
      rateBasisPoints: 1800,
      isGst: true,
      cgstRateBasisPoints: 900,
      sgstRateBasisPoints: 900,
      igstRateBasisPoints: 1800,
    },
    {
      code: "ZERO-0",
      name: "Zero Rated / Export",
      rateBasisPoints: 0,
      isGst: false,
      cgstRateBasisPoints: 0,
      sgstRateBasisPoints: 0,
      igstRateBasisPoints: 0,
    },
  ];

  for (const t of taxRules) {
    await prisma.taxRule.upsert({
      where: { code: t.code },
      update: t,
      create: t,
    });
  }

  await prisma.discount.upsert({
    where: { code: "SEATS10" },
    update: {},
    create: {
      code: "SEATS10",
      description: "Seats 10+ Offer",
      type: "PERCENTAGE",
      value: 1000, // 10.00% in basis points
      minOrderValue: 0,
      maxUsageLimit: 50,
      usageCount: 18,
      validFrom: new Date("2026-10-01T00:00:00.000Z"),
      validUntil: new Date("2026-12-31T23:59:59.000Z"),
      active: true,
    },
  });

  console.log("[Dev A] Seeded 2 tax rules and 1 discount (Seats 10+ Offer).");
}

if (require.main === module) {
  seedBilling()
    .then(() => prisma.$disconnect())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Failed to seed billing:", err);
      process.exit(1);
    });
}