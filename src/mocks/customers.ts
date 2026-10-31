import { Customer } from "@/contracts/customer";

export const MOCK_CUSTOMERS: Customer[] = [
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
