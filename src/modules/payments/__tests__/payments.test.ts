import { describe, it, expect } from "vitest";
import { paymentService } from "../service";

describe("Payments Module", () => {
  it("records payment successfully in mock mode", async () => {
    const receipt = await paymentService.recordPayment({
      invoiceId: "inv_mock_001",
      amount: 11682,
      method: "CREDIT_CARD",
      transactionRef: "ch_test_123",
    });

    expect(receipt.payment.status).toBe("SUCCEEDED");
    expect(receipt.payment.amount).toBe(11682);
    expect(receipt.invoiceFullyPaid).toBe(true);
  });
});
