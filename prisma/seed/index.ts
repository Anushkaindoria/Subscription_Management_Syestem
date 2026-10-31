/**
 * Master Database Seed Coordinator
 *
 * Coordinates execution of Dev B catalog seeds followed by Dev A billing seeds.
 */

import { seedCatalog } from "./seed-catalog";
import { seedBilling } from "./seed-billing";

async function main() {
  console.log("==================================================");
  console.log("🚀 Starting LoopOS Database Master Seed Sequence");
  console.log("==================================================");

  try {
    await seedCatalog();
    await seedBilling();
    console.log("==================================================");
    console.log("🎉 All seeds executed successfully!");
    console.log("==================================================");
  } catch (error) {
    console.error("❌ Seed execution failed:", error);
    process.exit(1);
  }
}

main();
