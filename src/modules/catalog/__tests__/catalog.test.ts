import { describe, it, expect } from "vitest";
import { catalogService } from "../service";

describe("Catalog Module", () => {
  it("returns mock products in mock mode", async () => {
    const products = await catalogService.getProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].code).toBe("CRM-ENT");
  });

  it("returns mock plans in mock mode", async () => {
    const plans = await catalogService.getPlans();
    expect(plans.length).toBeGreaterThan(0);
    expect(plans[0].interval).toBe("MONTHLY");
  });
});
