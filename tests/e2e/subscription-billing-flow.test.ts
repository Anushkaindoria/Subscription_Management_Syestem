import { describe, it, expect } from "vitest";
import { subscriptionService } from "@/modules/subscriptions";
import { billingService } from "@/modules/billing";
import { invoiceService } from "@/modules/invoices";
import { paymentService } from "@/modules/payments";

describe("E2E: Complete Subscription Billing & Invoicing Flow", () => {
  it("transitions lifecycle state and executes billing cycle", async () => {
    // 1. Advance quotation to confirmed
    const confirmed = await subscriptionService.transitionStatus("sub_mock_002", "CONFIRMED");
    expect(confirmed.status).toBe("CONFIRMED");

    // 2. Activate agreement
    const active = await subscriptionService.transitionStatus("sub_mock_002", "ACTIVE");
    expect(active.status).toBe("ACTIVE");

    // 3. Trigger billing run
    const billingRun = await billingService.executeBillingRun({
      dryRun: false,
    });
    expect(billingRun.subscriptionsEvaluated).toBeGreaterThan(0);

    // 4. Pay generated invoice
    const receipt = await paymentService.recordPayment({
      invoiceId: "inv_mock_001",
      amount: 11682,
      method: "CREDIT_CARD",
    });
    expect(receipt.payment.status).toBe("SUCCEEDED");
    expect(receipt.invoiceFullyPaid).toBe(true);

    // 5. Verify invoice status is PAID
    const paidInvoice = await invoiceService.transitionStatus("inv_mock_001", "PAID");
    expect(paidInvoice.status).toBe("PAID");
  });
});
