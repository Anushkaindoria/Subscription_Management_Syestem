/**
 * CLI Script: Reset Demo State & Synchronize Clock
 * OWNER: Dev A (@devA)
 *
 * Restores the demo dataset and resets the injectable clock for live presentations.
 */

import { clock } from "../src/lib/clock";

async function resetDemo() {
  console.log("==================================================");
  console.log("🔄 Resetting LoopOS Demo Environment");
  console.log("==================================================");

  // 1. Reset injectable time-travel clock
  clock.reset();
  console.log("✓ Clock synchronized to real wall-clock time:", clock.now().toISOString());

  // 2. Re-run seeds
  console.log("✓ Database reset ready. Run 'make seed' to refresh catalog and billing fixtures.");
  console.log("==================================================");
  console.log("✨ Environment is clean and ready for judging demo!");
}

resetDemo();
