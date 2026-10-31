import { Product } from "@/contracts/product";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_brightloop_crm",
    name: "Brightloop CRM Suite",
    type: "recurring_software",
    salesPrice: 120000, // ₹1,200.00
    costPrice: 45000, // ₹450.00
    notes: "Core omnichannel CRM engine for sales pipeline and customer interaction.",
    attributes: [
      {
        name: "Brand Integration",
        values: [
          { label: "Native Engine", priceExtra: 0 },
          { label: "Zoho Connector", priceExtra: 30000 }, // +₹300.00
          { label: "Odoo Connector", priceExtra: 56000 }, // +₹560.00
        ],
      },
    ],
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "prod_extra_seats",
    name: "Extra Seats Add-on",
    type: "add_on_seat",
    salesPrice: 25000, // ₹250.00
    costPrice: 8000, // ₹80.00
    notes: "Additional team seat licenses with role-based access delegation.",
    attributes: [],
    active: true,
    createdAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "prod_priority_support",
    name: "Priority Support",
    type: "support_tier",
    salesPrice: 50000, // ₹500.00
    costPrice: 15000, // ₹150.00
    notes: "24/7 designated support rep, 1-hour SLA response guarantee.",
    attributes: [],
    active: true,
    createdAt: "2026-01-10T00:00:00.000Z",
  },
];
