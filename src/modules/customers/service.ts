/**
 * Customers Module Service
 * OWNER: Dev B (@devB)
 */

import { CustomerDTO, CreateCustomerDTO, UpdateCustomerDTO } from "./schema";
import { CustomerRollup } from "./types";
import { customerRepo } from "./repo";
import { config } from "@/lib/config";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: string | null;
  taxId: string | null;
  createdAt: Date;
};

// GSTIN: 2 digit state code + PAN (5 letters, 4 digits, 1 letter) + entity + Z + checksum
const GSTIN_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const MOCK_CUSTOMERS: CustomerDTO[] = [
  {
    id: "cust_acme_retail",
    name: "Acme Retail Pvt Ltd",
    email: "billing@acmeretail.in",
    phone: "+91-98765-43210",
    company: "Acme Retail Pvt Ltd",
    address: "Block B, Industrial Area, Okhla Phase 1, New Delhi 110020",
    taxId: "07AABCA1234F1Z5", // Delhi GSTIN
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "cust_nova_logistics",
    name: "Nova Logistics",
    email: "accounts@novalogistics.com",
    phone: "+91-98230-11223",
    company: "Nova Logistics LLP",
    address: "Logistics Park, Navi Mumbai 400705",
    taxId: "27AABCN5678G1Z1",
    createdAt: "2026-02-10T00:00:00.000Z",
  },
  {
    id: "cust_kiran_stores",
    name: "Kiran Stores",
    email: "kiran@kiranstores.in",
    phone: "+91-99887-76655",
    company: "Kiran General Stores",
    address: "Market Road, Bengaluru 560002",
    taxId: "29AABCK9988D1Z4",
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "cust_zenith_edutech",
    name: "Zenith Edutech",
    email: "finance@zenithedu.io",
    phone: "+91-97112-33445",
    company: "Zenith Technologies Inc",
    address: "Cyber City, Gurugram 122002",
    taxId: "06AABCZ4455E1Z7",
    createdAt: "2026-04-12T00:00:00.000Z",
  },
  {
    id: "cust_pixel_studio",
    name: "Pixel Studio",
    email: "hello@pixelstudio.design",
    phone: "+91-91234-56789",
    company: "Pixel Creative Lab",
    address: "Indiranagar, Bengaluru 560038",
    taxId: "29AABCP1122M1Z9",
    createdAt: "2026-05-20T00:00:00.000Z",
  },
];

function num(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toDto(c: CustomerRow): CustomerDTO {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    company: c.company,
    address: c.address,
    taxId: c.taxId,
    createdAt: c.createdAt.toISOString(),
  };
}

// undefined = field bheja hi nahi (badalna nahi), null/"" = khaali karna.
function cleanText(value: string | null | undefined): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const t = value.trim();
  return t === "" ? null : t;
}

function cleanTaxId(value: string | null | undefined): string | null | undefined {
  const t = cleanText(value);
  if (t === undefined || t === null) return t;
  const upper = t.toUpperCase();
  if (!GSTIN_PATTERN.test(upper)) {
    throw new ValidationError("taxId must be a valid 15-character GSTIN (e.g. 07AABCA1234F1Z5).");
  }
  return upper;
}

function pageOf<T>(items: T[], total: number, page: number, pageSize: number) {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export class CustomerService {
  async listCustomers(): Promise<CustomerDTO[]> {
    if (config.isMockApi) {
      return MOCK_CUSTOMERS;
    }
    const list = await customerRepo.listAll();
    return list.map(toDto);
  }

  async listPage(opts: { q?: string; page?: number; pageSize?: number }) {
    const page = Math.max(1, num(opts.page, 1));
    const pageSize = Math.min(100, Math.max(1, num(opts.pageSize, 25)));
    const q = opts.q?.trim() || undefined;

    if (config.isMockApi) {
      const needle = q?.toLowerCase();
      const all = needle
        ? MOCK_CUSTOMERS.filter(
            (c) => c.name.toLowerCase().includes(needle) || c.email.toLowerCase().includes(needle),
          )
        : MOCK_CUSTOMERS;
      const start = (page - 1) * pageSize;
      return pageOf(all.slice(start, start + pageSize), all.length, page, pageSize);
    }

    const { rows, total } = await customerRepo.listPage({ q, page, pageSize });
    return pageOf(rows.map(toDto), total, page, pageSize);
  }

  async getCustomerById(id: string): Promise<CustomerDTO> {
    if (config.isMockApi) {
      const found = MOCK_CUSTOMERS.find((c) => c.id === id);
      if (!found) throw new NotFoundError("Customer", id);
      return found;
    }
    const customer = await customerRepo.findById(id);
    if (!customer) throw new NotFoundError("Customer", id);
    return toDto(customer);
  }

  async getCustomerRollup(id: string): Promise<CustomerRollup> {
    const customer = await this.getCustomerById(id);
    if (config.isMockApi) {
      return {
        customer,
        activeSubscriptionsCount: 2,
        totalMrrMinor: 249800, // INR 2,498.00
        outstandingInvoicesCount: 1,
        totalOutstandingMinor: 116820,
      };
    }
    return { customer, ...(await customerRepo.rollup(id)) };
  }

  async createCustomer(dto: CreateCustomerDTO): Promise<CustomerDTO> {
    if (config.isMockApi) {
      const created: CustomerDTO = {
        id: `cust_${Date.now()}`,
        ...dto,
        createdAt: new Date().toISOString(),
      };
      return created;
    }

    const email = dto.email.trim().toLowerCase();
    if (await customerRepo.findByEmail(email)) {
      throw new ConflictError("A customer with this email already exists.");
    }

    const created = await customerRepo.create({
      name: dto.name.trim(),
      email,
      phone: cleanText(dto.phone),
      company: cleanText(dto.company),
      address: cleanText(dto.address),
      taxId: cleanTaxId(dto.taxId),
    });
    return toDto(created);
  }

  async updateCustomer(id: string, dto: UpdateCustomerDTO): Promise<CustomerDTO> {
    if (config.isMockApi) {
      const customer = await this.getCustomerById(id);
      return { ...customer, ...dto };
    }

    const existing = await customerRepo.findById(id);
    if (!existing) throw new NotFoundError("Customer", id);

    let email: string | undefined;
    if (dto.email !== undefined) {
      email = dto.email.trim().toLowerCase();
      if (email !== existing.email && (await customerRepo.findByEmail(email))) {
        throw new ConflictError("A customer with this email already exists.");
      }
    }

    const updated = await customerRepo.update(id, {
      name: dto.name?.trim(),
      email,
      phone: cleanText(dto.phone),
      company: cleanText(dto.company),
      address: cleanText(dto.address),
      taxId: cleanTaxId(dto.taxId),
    });
    return toDto(updated);
  }

  // Abhi sirf placeholder link; asli invite email baad mein.
  async sendPortalInvite(id: string): Promise<{ success: boolean; inviteUrl: string }> {
    const customer = await this.getCustomerById(id);
    return {
      success: true,
      inviteUrl: `/portal?token=invite_${customer.id}_${Date.now()}`,
    };
  }
}

export const customerService = new CustomerService();