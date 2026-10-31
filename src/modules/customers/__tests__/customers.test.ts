import { describe, it, expect } from "vitest";
import { customerService } from "../service";

describe("Customers Module", () => {
  it("lists mock customers including Acme Retail Pvt Ltd with valid GSTIN", async () => {
    const list = await customerService.listCustomers();
    expect(list.length).toBeGreaterThan(0);
    const acme = list.find((c) => c.name.includes("Acme Retail"));
    expect(acme).toBeDefined();
    expect(acme?.taxId).toBe("07AABCA1234F1Z5");
  });

  it("generates portal invite URL", async () => {
    const invite = await customerService.sendPortalInvite("cust_acme_retail");
    expect(invite.success).toBe(true);
    expect(invite.inviteUrl).toContain("/portal?token=");
  });
});
