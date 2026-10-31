import { describe, it, expect } from "vitest";
import { askService } from "../service";

describe("Ask Module", () => {
  it("translates overdue invoice query into structured filters without raw SQL", async () => {
    const result = await askService.processQuery({
      query: "Show me all overdue invoices from this month",
    });

    expect(result.understoodAs.length).toBeGreaterThan(0);
    expect(result.understoodAs[0].field).toBe("invoice.status");
    expect(result.summary).toContain("overdue invoices");
    expect(result.rows.length).toBeGreaterThan(0);
  });
});
