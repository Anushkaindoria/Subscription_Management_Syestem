import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../repo", () => ({
  subscriptionRepo: {
    findCustomer: vi.fn(),
    findPlan: vi.fn(),
    findProducts: vi.fn(),
    createDraft: vi.fn(),
    findById: vi.fn(),
    transitionStatus: vi.fn(),
    setPaused: vi.fn(),
    extendEndDate: vi.fn(),
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
    number: null,
    customerId: "cust_1",
    status: "DRAFT",
    isPaused: false,
    paymentTerms: 0,
    renewalInterval: "MONTHLY",
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
        plan: { name: "Starter Monthly", pausable: true, renewable: true },
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
  repo.findPlan.mockResolvedValue({
    id: "plan_1",
    name: "Starter Monthly",
    active: true,
    basePrice: 149900,
  } as never);
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
    expect(dto.paymentTerms).toBe("Immediate");
    expect(dto.isPaused).toBe(false);

    const arg = repo.createDraft.mock.calls[0][0];
    expect(arg.startDate).toBeInstanceOf(Date);
    expect(arg.lines[0].planId).toBe("plan_1");
    expect(arg.paymentTerms).toBe(0);
    expect(typeof arg.year).toBe("number");
  });

  it("uses the plan basePrice and ignores the unitPrice sent by the client", async () => {
    happyCreateMocks();
    await subscriptionLifecycle.create({
      ...validInput,
      lines: [{ productId: "prod_1", quantity: 3, unitPrice: 1, discountPercent: 0 }],
    });
    const arg = repo.createDraft.mock.calls[0][0];
    expect(arg.lines[0].unitPrice).toBe(149900);
    expect(arg.lines[0].quantity).toBe(3);
  });

  it("returns the stored SUB number and maps paymentTerms days to text", async () => {
    happyCreateMocks();
    repo.createDraft.mockResolvedValue(
      makeRecord({ number: "SUB-2026-0007", paymentTerms: 30 }) as never,
    );
    const dto = await subscriptionLifecycle.create(validInput);
    expect(dto.number).toBe("SUB-2026-0007");
    expect(dto.paymentTerms).toBe("Net 30");
  });

  it("maps 'Net 30' to 30 days when saving", async () => {
    happyCreateMocks();
    await subscriptionLifecycle.create({ ...validInput, paymentTerms: "Net 30" });
    expect(repo.createDraft.mock.calls[0][0].paymentTerms).toBe(30);
  });

  it("rejects unknown paymentTerms text and does not touch the database", async () => {
    await expect(
      subscriptionLifecycle.create({ ...validInput, paymentTerms: "Weekly" }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(repo.createDraft).not.toHaveBeenCalled();
  });

  it("rejects an unknown customer", async () => {
    happyCreateMocks();
    repo.findCustomer.mockResolvedValue(null as never);
    await expect(subscriptionLifecycle.create(validInput)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("rejects an inactive plan", async () => {
    happyCreateMocks();
    repo.findPlan.mockResolvedValue({
      id: "plan_1",
      name: "Old",
      active: false,
      basePrice: 100,
    } as never);
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
});

describe("subscription renew (real)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("monthly: moves endDate one month ahead and touches nothing else", async () => {
    const end = new Date("2027-10-01T00:00:00.000Z");
    const next = new Date("2026-12-01T00:00:00.000Z");
    const newEnd = new Date("2027-11-01T00:00:00.000Z");
    repo.findById
      .mockResolvedValueOnce(
        makeRecord({ status: "ACTIVE", endDate: end, nextBillingDate: next }) as never,
      )
      .mockResolvedValueOnce(
        makeRecord({ status: "ACTIVE", endDate: newEnd, nextBillingDate: next }) as never,
      );
    repo.extendEndDate.mockResolvedValue(1);

    const dto = await subscriptionLifecycle.transition("clsub000000001abcd", "renew");

    expect(repo.extendEndDate).toHaveBeenCalledWith({
      id: "clsub000000001abcd",
      from: end,
      to: newEnd,
    });
    expect(repo.transitionStatus).not.toHaveBeenCalled();
    expect(dto.expiryDate).toBe(newEnd.toISOString());
    expect(dto.nextBillingDate).toBe(next.toISOString());
    expect(dto.number).toBe("SUB-2026-ABCD");
    expect(dto.status).toBe("active");
  });

  it("annual: moves endDate one year ahead", async () => {
    const end = new Date("2027-01-01T00:00:00.000Z");
    repo.findById
      .mockResolvedValueOnce(
        makeRecord({ status: "ACTIVE", renewalInterval: "ANNUALLY", endDate: end }) as never,
      )
      .mockResolvedValueOnce(
        makeRecord({
          status: "ACTIVE",
          renewalInterval: "ANNUALLY",
          endDate: new Date("2028-01-01T00:00:00.000Z"),
        }) as never,
      );
    repo.extendEndDate.mockResolvedValue(1);

    await subscriptionLifecycle.transition("clsub000000001abcd", "renew");
    expect(repo.extendEndDate).toHaveBeenCalledWith({
      id: "clsub000000001abcd",
      from: end,
      to: new Date("2028-01-01T00:00:00.000Z"),
    });
  });

  it("cannot renew a subscription that is not active", async () => {
    repo.findById.mockResolvedValue(makeRecord({ status: "CONFIRMED" }) as never);
    await expect(
      subscriptionLifecycle.transition("clsub000000001abcd", "renew"),
    ).rejects.toBeInstanceOf(BusinessRuleError);
    expect(repo.extendEndDate).not.toHaveBeenCalled();
  });

  it("blocks renew when the plan is not renewable", async () => {
    const base = makeRecord({ status: "ACTIVE" });
    const rec = makeRecord({
      status: "ACTIVE",
      lines: [{ ...base.lines[0], plan: { name: "No Renew", pausable: true, renewable: false } }],
    });
    repo.findById.mockResolvedValue(rec as never);
    await expect(
      subscriptionLifecycle.transition("clsub000000001abcd", "renew"),
    ).rejects.toBeInstanceOf(BusinessRuleError);
    expect(repo.extendEndDate).not.toHaveBeenCalled();
  });

  it("rejects renew when there is no end date", async () => {
    repo.findById.mockResolvedValue(makeRecord({ status: "ACTIVE", endDate: null }) as never);
    await expect(
      subscriptionLifecycle.transition("clsub000000001abcd", "renew"),
    ).rejects.toBeInstanceOf(BusinessRuleError);
    expect(repo.extendEndDate).not.toHaveBeenCalled();
  });

  it("gives a conflict when another request changed the end date first", async () => {
    repo.findById.mockResolvedValue(makeRecord({ status: "ACTIVE" }) as never);
    repo.extendEndDate.mockResolvedValue(0);
    await expect(
      subscriptionLifecycle.transition("clsub000000001abcd", "renew"),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("renew on an unknown subscription gives not found", async () => {
    repo.findById.mockResolvedValue(null as never);
    await expect(subscriptionLifecycle.transition("nope", "renew")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});

describe("subscription pause / resume (real)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("pause sets isPaused and keeps status active", async () => {
    repo.findById
      .mockResolvedValueOnce(makeRecord({ status: "ACTIVE", isPaused: false }) as never)
      .mockResolvedValueOnce(makeRecord({ status: "ACTIVE", isPaused: true }) as never);
    repo.setPaused.mockResolvedValue(1);

    const dto = await subscriptionLifecycle.transition("clsub000000001abcd", "pause");
    expect(dto.status).toBe("active");
    expect(dto.isPaused).toBe(true);
    expect(repo.setPaused).toHaveBeenCalledWith({
      id: "clsub000000001abcd",
      from: false,
      to: true,
    });
  });

  it("resume clears isPaused", async () => {
    repo.findById
      .mockResolvedValueOnce(makeRecord({ status: "ACTIVE", isPaused: true }) as never)
      .mockResolvedValueOnce(makeRecord({ status: "ACTIVE", isPaused: false }) as never);
    repo.setPaused.mockResolvedValue(1);

    const dto = await subscriptionLifecycle.transition("clsub000000001abcd", "resume");
    expect(dto.isPaused).toBe(false);
    expect(repo.setPaused).toHaveBeenCalledWith({
      id: "clsub000000001abcd",
      from: true,
      to: false,
    });
  });

  it("cannot pause a subscription that is not active", async () => {
    repo.findById.mockResolvedValue(makeRecord({ status: "CONFIRMED" }) as never);
    await expect(
      subscriptionLifecycle.transition("clsub000000001abcd", "pause"),
    ).rejects.toBeInstanceOf(BusinessRuleError);
    expect(repo.setPaused).not.toHaveBeenCalled();
  });

  it("cannot pause twice", async () => {
    repo.findById.mockResolvedValue(makeRecord({ status: "ACTIVE", isPaused: true }) as never);
    await expect(
      subscriptionLifecycle.transition("clsub000000001abcd", "pause"),
    ).rejects.toBeInstanceOf(BusinessRuleError);
    expect(repo.setPaused).not.toHaveBeenCalled();
  });

  it("cannot resume a subscription that is not paused", async () => {
    repo.findById.mockResolvedValue(makeRecord({ status: "ACTIVE", isPaused: false }) as never);
    await expect(
      subscriptionLifecycle.transition("clsub000000001abcd", "resume"),
    ).rejects.toBeInstanceOf(BusinessRuleError);
    expect(repo.setPaused).not.toHaveBeenCalled();
  });

  it("blocks pause when the plan is not pausable", async () => {
    const base = makeRecord({ status: "ACTIVE" });
    const rec = makeRecord({
      status: "ACTIVE",
      lines: [{ ...base.lines[0], plan: { name: "No Pause", pausable: false, renewable: true } }],
    });
    repo.findById.mockResolvedValue(rec as never);
    await expect(
      subscriptionLifecycle.transition("clsub000000001abcd", "pause"),
    ).rejects.toBeInstanceOf(BusinessRuleError);
    expect(repo.setPaused).not.toHaveBeenCalled();
  });

  it("gives a conflict when another request changed the flag first", async () => {
    repo.findById.mockResolvedValue(makeRecord({ status: "ACTIVE", isPaused: false }) as never);
    repo.setPaused.mockResolvedValue(0);
    await expect(
      subscriptionLifecycle.transition("clsub000000001abcd", "pause"),
    ).rejects.toBeInstanceOf(ConflictError);
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