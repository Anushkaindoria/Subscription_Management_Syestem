/**
 * Seed: users (Dev B). Chalane ke liye PostgreSQL chahiye.
 * Run: npm run db:seed:users
 */
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Demo password (policy ke hisaab se: 9+ chars, upper, lower, special)
const DEMO_PASSWORD = "Brightloop@2026";

const staffUsers = [
  { name: "Riya Sharma", email: "riya.sharma@loopos.local", role: Role.ADMIN },
  { name: "Aman Verma", email: "aman.verma@loopos.local", role: Role.STAFF },
  { name: "Neha Kapoor", email: "neha.kapoor@loopos.local", role: Role.STAFF },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const u of staffUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role },
      create: { ...u, passwordHash },
    });
  }

  // Portal demo: Acme Retail ka customer + uska login
  const acme = await prisma.customer.upsert({
    where: { email: "billing@acmeretail.in" },
    update: {},
    create: {
      name: "Acme Retail Pvt Ltd",
      email: "billing@acmeretail.in",
      company: "Acme Retail Pvt Ltd",
      taxId: "07AABCA1234F1Z5",
    },
  });
  await prisma.user.upsert({
    where: { email: "billing@acmeretail.in" },
    update: { customerId: acme.id },
    create: {
      name: "Acme Retail Admin",
      email: "billing@acmeretail.in",
      passwordHash,
      role: Role.CUSTOMER,
      customerId: acme.id,
    },
  });

  console.log("Users seeded. Demo password: " + DEMO_PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
