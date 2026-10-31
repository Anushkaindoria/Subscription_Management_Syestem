/**
 * CLI Script: Run Billing Engine Cycle
 * OWNER: Dev A (@devA)
 *
 * Usage:
 *   npx tsx scripts/run-billing.ts
 *   npx tsx scripts/run-billing.ts --dry-run
 *   npx tsx scripts/run-billing.ts --as-of=2026-11-01T00:00:00Z
 */

import { billingService } from "../src/modules/billing";
import { clock } from "../src/lib/clock";
import { Money } from "../src/lib/money";

async function run() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const asOfArg = args.find((a) => a.startsWith("--as-of="));
  const asOfDate = asOfArg ? asOfArg.split("=")[1] : clock.now().toISOString();

  console.log("==================================================");
  console.log("⚡ LoopOS Billing Engine CLI Execution");
  console.log(`📅 Target Billing Date: ${asOfDate}`);
  console.log(`🛡️  Dry-Run Mode:        ${dryRun ? "ENABLED" : "DISABLED"}`);
  console.log("==================================================");

  try {
    const result = await billingService.executeBillingRun({
      dryRun,
      asOfDate,
    });

    console.log("--------------------------------------------------");
    console.log(`✓ Run ID:                   ${result.runId}`);
    console.log(`✓ Subscriptions Evaluated:  ${result.subscriptionsEvaluated}`);
    console.log(`✓ Invoices Generated:       ${result.invoicesGenerated}`);
    console.log(`✓ Idempotent Skips:         ${result.invoicesSkippedIdempotent}`);
    console.log(`✓ Total Billed:             ${Money.format(result.totalBilledMinor)}`);
    console.log(`✓ Execution Time:           ${result.executionTimeMs} ms`);
    console.log("--------------------------------------------------");
    console.log("🎉 Billing cycle batch completed successfully!");
  } catch (error) {
    console.error("❌ Billing run failed:", error);
    process.exit(1);
  }
}

run();
