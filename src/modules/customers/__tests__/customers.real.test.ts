import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/config", () => ({ config: { isMockApi: false } }));
vi.mock("../repo", () => ({
  customerRepo: {
    listAll: vi.fn(),
    listPage: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    rollup: vi.fn(),
  },
}));

import { customerRepo } from "../repo";
import { customerService } from "../service";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";

const repo = vi.mocked(customerRepo);

function row(overrides: Record<string, unknown> = {}) {
  return {
    id: "cust_1",
    name: "Acme Retail Pvt Ltd",
    email: "billing@acmeretail.in",
    phone: null,
    company: null,
    address: null,
    taxId: "07AABCA1234F1Z5",
    createdAt: new Date("2026-01-15T00:00:00.000Z"),
    updatedAt: new Date("2026-01-15T00:00:00.000Z"),
    ...overrides,
  };
}

describe("customers (real)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("creates a customer with lowercase email and uppercase GSTIN", async () => {
    repo.findByEmail.mockResolvedValue(null);
    repo.create.mockResolvedValue(row() as never);

    const dto = await customerService.createCustomer({
      name: "  Acme Retail Pvt Ltd ",
      email: " Billing@AcmeRetail.in ",
      taxId: "07aabca1234f1z5",
    });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Acme Retail Pvt Ltd",
        email: "billing@acmeretail.in",
        taxId: "07AABCA1234F1Z5",
      }),
    );
    expect(dto.createdAt).toBe("2026-01-15T00:00:00.000Z");
  });

  it("rejects a duplicate email with a conflict", async () => {
    repo.findByEmail.mockResolvedValue(row() as never);
    await expect(
      customerService.createCustomer({ name: "Acme", email: "billing@acmeretail.in" }),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("rejects an invalid GSTIN", async () => {
    repo.findByEmail.mockResolvedValue(null);
    await expect(
      customerService.createCustomer({ name: "Acme", email: "a@b.in", taxId: "NOT-A-GSTIN" }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("turns a blank GSTIN into null", async () => {
    repo.findByEmail.mockResolvedValue(null);
    repo.create.mockResolvedValue(row({ taxId: null }) as never);
    await customerService.createCustomer({ name: "Acme", email: "a@b.in", taxId: "   " });
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ taxId: null }));
  });

  it("gives not found for an unknown customer", async () => {
    repo.findById.mockResolvedValue(null);
    await expect(customerService.getCustomerById("nope")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("does not let an update take another customer's email", async () => {
    repo.findById.mockResolvedValue(row() as never);
    repo.findByEmail.mockResolvedValue(row({ id: "cust_2", email: "other@x.in" }) as never);
    await expect(
      customerService.updateCustomer("cust_1", { email: "other@x.in" }),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("updates only the fields that were sent", async () => {
    repo.findById.mockResolvedValue(row() as never);
    repo.update.mockResolvedValue(row({ name: "New Name" }) as never);
    const dto = await customerService.updateCustomer("cust_1", { name: " New Name " });
    expect(repo.update).toHaveBeenCalledWith(
      "cust_1",
      expect.objectContaining({ name: "New Name", email: undefined, taxId: undefined }),
    );
    expect(dto.name).toBe("New Name");
  });

  it("clamps page size and passes the search text", async () => {
    repo.listPage.mockResolvedValue({ rows: [row()], total: 1 } as never);
    const result = await customerService.listPage({ q: "acme", page: 0, pageSize: 500 });
    expect(repo.listPage).toHaveBeenCalledWith({ q: "acme", page: 1, pageSize: 100 });
    expect(result.totalPages).toBe(1);
    expect(result.items).toHaveLength(1);
  });

  it("builds the rollup from real numbers", async () => {
    repo.findById.mockResolvedValue(row() as never);
    repo.rollup.mockResolvedValue({
      activeSubscriptionsCount: 3,
      totalMrrMinor: 450000,
      outstandingInvoicesCount: 2,
      totalOutstandingMinor: 99900,
    });
    const rollup = await customerService.getCustomerRollup("cust_1");
    expect(rollup.activeSubscriptionsCount).toBe(3);
    expect(rollup.totalOutstandingMinor).toBe(99900);
    expect(rollup.customer.id).toBe("cust_1");
  });
});