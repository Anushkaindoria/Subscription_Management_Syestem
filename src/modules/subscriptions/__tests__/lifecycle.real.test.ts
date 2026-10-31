import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../repo", () => ({
  subscriptionRepo: {
    findCustomer: vi.fn(),
    findPlan: vi.fn(),
    findProducts: vi.fn(),
    createDraft: vi.fn(),
    findById: vi.fn(),
    transitionStatus: vi.fn(),
    listPage: vi.fn(),
  },
}));

import { subscriptionRepo } from "../repo";
import { subscriptionLifecycle } from "../lifecycle";
import {
  BusinessRuleError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";

const repo = vi.mocked(subscriptionRepo);

function makeRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "clsub000000001abcd",
    customerId: "cust_1",
    status: "DRAFT",
    startDate: new Date("2026-11-01T00:00:00.000Z"),
    endDate: new Date("2027-10-31T00:00:00.000Z"),
    nextBillingDate: null,
    createdAt: new Date("2026-10-31T09:00:00.000Z"),
    customer: { name: "Acme Retail Pvt Ltd" },
    lines: [
      {
        id: "line_1",
        productId: "prod_1",
        planId: "plan_1",
        quantity: 2,
        unitPrice: 149900,
        product: { name: "Brightloop CRM Suite" },
        plan: { name: "Starter Monthly" },
      },
    ],
    ...overrides,
  };
}

const validInput = {
  customerId: "cust_1",
  planId: "plan_1",
  startDate: "2026-11-01",
  expiryDate: "2027-10-31",
  paymentTerms: "Immediate",
  lines: [{ productId: "prod_1", quantity: 2, unitPrice: 149900, discountPercent: 0 }],
};

function happyCreateMocks() {
  repo.findCustomer.mockResolvedValue({ id: "cust_1", name: "Acme Retail Pvt Ltd" } as never);
  repo.findPlan.mockResolvedValue({ id: "plan_1", name: "Starter Monthly", active: true } as never);
  repo.findProducts.mockResolvedValue([{ id: "prod_1" }] as never);
  repo.createDraft.mockResolvedValue(makeRecord() as never);
}

describe("subscription create (real)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("creates a draft subscription and returns the contract shape", async () => {
    happyCreateMocks();
    const dto = await subscriptionLifecycle.create(validInput);

    expect(dto.status).toBe("draft");
    expect(dto.number).toBe("SUB-2026-ABCD");
    expect(dto.totalRecurringMinor).toBe(299800);
    expect(dto.planId).toBe("plan_1");

    const arg = repo.createDraft.mock.calls[0][0];
    expect(arg.startDate).toBeInstanceOf(Date);
    expect(arg.lines[0].planId).toBe("plan_1");
  });

  it("rejects an unknown customer", async () => {
    happyCreateMocks();
    repo.findCustomer.mockResolvedValue(null as never);
    await expect(subscriptionLifecycle.create(validInput)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("rejects an inactive plan", async () => {
    happyCreateMocks();
    repo.findPlan.mockResolvedValue({ id: "plan_1", name: "Old", active: false } as never);
    await expect(subscriptionLifecycle.create(validInput)).rejects.toBeInstanceOf(
      BusinessRuleError,
    );
  });

  it("rejects an unknown product", async () => {
    happyCreateMocks();
    repo.findProducts.mockResolvedValue([] as never);
    await expect(subscriptionLifecycle.create(validInput)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("rejects expiry before start and does not touch the database", async () => {
    await expect(
      subscriptionLifecycle.create({ ...validInput, expiryDate: "2026-01-01" }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(repo.createDraft).not.toHaveBeenCalled();
  });

  it("rejects a non-zero line discount", async () => {
    const input = {
      ...validInput,
      lines: [{ productId: "prod_1", quantity: 1, unitPrice: 100, discountPercent: 10 }],
    };
    await expect(subscriptionLifecycle.create(input)).rejects.toBeInstanceOf(ValidationError);
  });
});

describe("subscription transitions (real)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("send_quotation moves DRAFT to QUOTATION", async () => {
    repo.findById
      .mockResolvedValueOnce(makeRecord({ status: "DRAFT" }) as never)
      .mockResolvedValueOnce(makeRecord({ status: "QUOTATION" }) as never);
    repo.transitionStatus.mockResolvedValue(1);

    const dto = await subscriptionLifecycle.transition("clsub000000001abcd", "send_quotation");
    expect(dto.status).toBe("quotation");
    expect(repo.transitionStatus).toHaveBeenCalledWith(
      expect.objectContaining({ from: "DRAFT", to: "QUOTATION" }),
    );
  });

  it("rejects an invalid transition (confirm on a draft)", async () => {
    repo.findById.mockResolvedValue(makeRecord({ status: "DRAFT" }) as never);
    await expect(
      subscriptionLifecycle.transition("clsub000000001abcd", "confirm"),
    ).rejects.toBeInstanceOf(BusinessRuleError);
    expect(repo.transitionStatus).not.toHaveBeenCalled();
  });

  it("activate sets nextBillingDate to the start date", async () => {
    const start = new Date("2026-11-01T00:00:00.000Z");
    repo.findById
      .mockResolvedValueOnce(makeRecord({ status: "CONFIRMED", startDate: start }) as never)
      .mockResolvedValueOnce(makeRecord({ status: "ACTIVE", nextBillingDate: start }) as never);
    repo.transitionStatus.mockResolvedValue(1);

    const dto = await subscriptionLifecycle.transition("clsub000000001abcd", "activate");
    expect(dto.status).toBe("active");
    expect(dto.nextBillingDate).toBe(start.toISOString());
    expect(repo.transitionStatus).toHaveBeenCalledWith(
      expect.objectContaining({ data: { nextBillingDate: start } }),
    );
  });

  it("close from ACTIVE sets cancelledAt", async () => {
    repo.findById
      .mockResolvedValueOnce(makeRecord({ status: "ACTIVE" }) as never)
      .mockResolvedValueOnce(makeRecord({ status: "CLOSED" }) as never);
    repo.transitionStatus.mockResolvedValue(1);

    const dto = await subscriptionLifecycle.transition("clsub000000001abcd", "close");
    expect(dto.status).toBe("closed");
    expect(repo.transitionStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "ACTIVE",
        to: "CLOSED",
        data: { cancelledAt: expect.any(Date) },
      }),
    );
  });

  it("a closed subscription cannot move again", async () => {
    repo.findById.mockResolvedValue(makeRecord({ status: "CLOSED" }) as never);
    await expect(
      subscriptionLifecycle.transition("clsub000000001abcd", "activate"),
    ).rejects.toBeInstanceOf(BusinessRuleError);
  });

  it("returns 409 style conflict when another request changed the status first", async () => {
    repo.findById.mockResolvedValue(makeRecord({ status: "DRAFT" }) as never);
    repo.transitionStatus.mockResolvedValue(0);
    await expect(
      subscriptionLifecycle.transition("clsub000000001abcd", "send_quotation"),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("unknown subscription gives not found", async () => {
    repo.findById.mockResolvedValue(null as never);
    await expect(subscriptionLifecycle.transition("nope", "confirm")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it.each(["pause", "resume", "renew"] as const)("%s is not supported yet", async (action) => {
    await expect(
      subscriptionLifecycle.transition("clsub000000001abcd", action),
    ).rejects.toBeInstanceOf(BusinessRuleError);
    expect(repo.findById).not.toHaveBeenCalled();
  });
});

describe("subscription getById ownership (real)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("hides another customer's subscription as not found", async () => {
    repo.findById.mockResolvedValue(makeRecord({ customerId: "cust_1" }) as never);
    await expect(
      subscriptionLifecycle.getById("clsub000000001abcd", { customerId: "cust_2" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("returns the subscription to its own customer", async () => {
    repo.findById.mockResolvedValue(makeRecord({ customerId: "cust_1" }) as never);
    const dto = await subscriptionLifecycle.getById("clsub000000001abcd", {
      customerId: "cust_1",
    });
    expect(dto.customerId).toBe("cust_1");
  });
});