/**
 * Customers Module Service
 * OWNER: Dev B (@devB)
 */

import { CustomerDTO, CreateCustomerDTO, UpdateCustomerDTO } from "./schema";
import { CustomerRollup } from "./types";
import { customerRepo } from "./repo";
import { config } from "@/lib/config";
import { NotFoundError } from "@/lib/errors";

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

export class CustomerService {
  async listCustomers(): Promise<CustomerDTO[]> {
    if (config.isMockApi) {
      return MOCK_CUSTOMERS;
    }
    const list = await customerRepo.listAll();
    return list.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      company: c.company,
      address: c.address,
      taxId: c.taxId,
      createdAt: c.createdAt.toISOString(),
    }));
  }

  async getCustomerById(id: string): Promise<CustomerDTO> {
    if (config.isMockApi) {
      const found = MOCK_CUSTOMERS.find((c) => c.id === id);
      if (!found) throw new NotFoundError("Customer", id);
      return found;
    }
    const customer = await customerRepo.findById(id);
    if (!customer) throw new NotFoundError("Customer", id);
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      address: customer.address,
      taxId: customer.taxId,
      createdAt: customer.createdAt.toISOString(),
    };
  }

  async getCustomerRollup(id: string): Promise<CustomerRollup> {
    const customer = await this.getCustomerById(id);
    return {
      customer,
      activeSubscriptionsCount: 2,
      totalMrrMinor: 249800, // INR 2,498.00
      outstandingInvoicesCount: 1,
      totalOutstandingMinor: 116820,
    };
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
    const c = await customerRepo.create(dto);
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

  async updateCustomer(id: string, dto: UpdateCustomerDTO): Promise<CustomerDTO> {
    if (config.isMockApi) {
      const customer = await this.getCustomerById(id);
      return { ...customer, ...dto };
    }
    const updated = await customerRepo.update(id, dto);
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      company: updated.company,
      address: updated.address,
      taxId: updated.taxId,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  async sendPortalInvite(id: string): Promise<{ success: boolean; inviteUrl: string }> {
    const customer = await this.getCustomerById(id);
    return {
      success: true,
      inviteUrl: `/portal?token=invite_${customer.id}_${Date.now()}`,
    };
  }
}

export const customerService = new CustomerService();
