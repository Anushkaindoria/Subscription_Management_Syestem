import { describe, it, expect } from "vitest";
import { settingsService } from "../service";

describe("Settings Module", () => {
  it("retrieves system configuration defaults", async () => {
    const settings = await settingsService.getSettings();
    expect(settings.companyName).toContain("LoopOS");
    expect(settings.currency).toBe("INR");
    expect(settings.defaultPaymentTermsDays).toBe(15);
  });

  it("updates numbering prefix", async () => {
    const updated = await settingsService.updateSettings({ invoicePrefix: "INV-2027-" });
    expect(updated.invoicePrefix).toBe("INV-2027-");
    // restore
    await settingsService.updateSettings({ invoicePrefix: "INV-2026-" });
  });
});
