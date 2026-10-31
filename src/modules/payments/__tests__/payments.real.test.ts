import { describe, it, expect, beforeEach, vi } from "vitest";

type FakeInvoice = {
  id: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  customerId: string;
};

const store = vi.hoisted(() => ({
  invoices: new Map<string, FakeInvoice>(),
  payments: [] as { amount: number; method: string }[],
}));

const recompute = vi.hoisted(() => vi.fn(async (id: string) => ({ id })));

vi.mock("@/lib/config", () => ({
  config: { isMockApi: false, isProduction: false, port: 3000, jwtSecret: "x", databaseUrl: "" },
}));

vi.mock("@/modules/invoices", () => ({
  invoiceService: { recomputePaid: recompute },
}));

vi.mock("../repo", () => ({
  paymentRepo: {
    findInvoice: async (id: string) => store.invoices.get(id) ?? null,
    recordAgainstInvoice: async (d: {
      invoiceId: string;
      customerId: string;
      amount: number;
      method: string;
      newPaid: number;
      markPaid: boolean;
    }) => {
      const inv = store.invoices.get(d.invoiceId)!;
      inv.paidAmount = d.newPaid;
      if (d.markPaid) inv.status = "PAID";
      store.payments.push({ amount: d.amount, method: d.method });
      return {
        id: "pay_" + store.payments.length,
        invoiceId: d.invoiceId,
        customerId: d.customerId,
        amount: d.amount,
        method: d.method,
        status: "SUCCEEDED",
        transactionRef: null,
        createdAt: new Date("2026-10-31T10:00:00Z"),
      };
    },
  },
}));

import { paymentService } from "../service";
import { BusinessRuleError, NotFoundError } from "@/lib/errors";

// INV-2026-0043 (Nova Logistics): Rs 1,768.82 = 176882 paise
function seed(status = "CONFIRMED") {
  store.invoices.set("inv43", {
    id: "inv43",
    status,
    totalAmount: 176882,
    paidAmount: 0,
    customerId: "cust_nova",
  });
}

describe("Payments (real mode, fake DB)", () => {
  beforeEach(() => {
    store.invoices.clear();
    store.payments.length = 0;
    recompute.mockClear();
  });

  it("rejects payment on a Draft invoice", async () => {
    seed("DRAFT");
    await expect(
      paymentService.recordPayment({ invoiceId: "inv43", amount: 1000, method: "upi" }),
    ).rejects.toBeInstanceOf(BusinessRuleError);
  });

  it("rejects payment on a Paid invoice", async () => {
    seed("PAID");
    await expect(
      paymentService.recordPayment({ invoiceId: "inv43", amount: 1, method: "cash" }),
    ).rejects.toBeInstanceOf(BusinessRuleError);
  });

  it("rejects overpayment", async () => {
    seed();
    await expect(
      paymentService.recordPayment({ invoiceId: "inv43", amount: 176883, method: "upi" }),
    ).rejects.toBeInstanceOf(BusinessRuleError);
    expect(store.payments.length).toBe(0);
    expect(recompute).not.toHaveBeenCalled();
  });

  it("unknown invoice gives NotFound", async () => {
    await expect(
      paymentService.recordPayment({ invoiceId: "nope", amount: 100, method: "upi" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("partial payment keeps invoice Confirmed, full payment makes it Paid", async () => {
    seed();
    const first = await paymentService.recordPayment({ invoiceId: "inv43", amount: 100000, method: "bank_transfer" });
    expect(first.invoiceFullyPaid).toBe(false);
    expect(first.remainingBalanceMinor).toBe(76882);
    expect(store.invoices.get("inv43")!.status).toBe("CONFIRMED");

    const second = await paymentService.recordPayment({ invoiceId: "inv43", amount: 76882, method: "card" });
    expect(second.invoiceFullyPaid).toBe(true);
    expect(second.remainingBalanceMinor).toBe(0);
    expect(store.invoices.get("inv43")!.status).toBe("PAID");
  });

  it("maps contract methods to database methods (card, cheque)", async () => {
    seed();
    await paymentService.recordPayment({ invoiceId: "inv43", amount: 1000, method: "card" });
    await paymentService.recordPayment({ invoiceId: "inv43", amount: 1000, method: "cheque" });
    expect(store.payments.map((p) => p.method)).toEqual(["CREDIT_CARD", "CHEQUE"]);
  });

  it("calls invoiceService.recomputePaid after every recorded payment", async () => {
    seed();
    await paymentService.recordPayment({ invoiceId: "inv43", amount: 1000, method: "upi" });
    await paymentService.recordPayment({ invoiceId: "inv43", amount: 2000, method: "cash" });
    expect(recompute).toHaveBeenCalledTimes(2);
    expect(recompute).toHaveBeenCalledWith("inv43");
  });

  it("still returns the receipt when recomputePaid fails", async () => {
    seed();
    recompute.mockRejectedValueOnce(new Error("boom"));
    const receipt = await paymentService.recordPayment({
      invoiceId: "inv43",
      amount: 1000,
      method: "upi",
    });
    expect(receipt.payment.amount).toBe(1000);
    expect(store.payments.length).toBe(1);
  });
});