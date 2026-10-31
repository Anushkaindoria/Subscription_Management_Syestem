import { describe, it, expect } from "vitest";
import { invoiceService } from "../service";
import { BusinessRuleError } from "@/lib/errors";

describe("Invoices Module", () => {
  it("transitions invoice from CONFIRMED to PAID", async () => {
    const inv = await invoiceService.transitionStatus("inv_mock_001", "PAID");
    expect(inv.status).toBe("PAID");
    expect(inv.paidAmount).toBe(inv.totalAmount);
  });

  it("blocks invalid transition from PAID to DRAFT", async () => {
    await expect(
      invoiceService.transitionStatus("inv_mock_002", "DRAFT"),
    ).rejects.toThrow(BusinessRuleError);
  });

  it("provides structured PDF invoice data", async () => {
    const pdfData = await invoiceService.getPdfData("inv_mock_001");
    expect(pdfData.companyInfo.taxId).toBeDefined();
    expect(pdfData.paymentInstructions.accountNumber).toBeDefined();
  });
});
