import { Discount } from "@/contracts/discount";

export const MOCK_DISCOUNTS: Discount[] = [
  {
    id: "disc_seats_10_plus",
    name: "Seats 10+ Offer",
    kind: "percentage",
    value: 1000, // 10.00% (1000 bps)
    appliesTo: "products",
    productIds: ["prod_extra_seats"],
    minPurchase: 0,
    minQuantity: 10,
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    usageLimit: 50,
    usedCount: 18, // 18 of 50 used
    active: true,
    createdAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "disc_annual_save",
    name: "Annual Upgrade Save",
    kind: "fixed",
    value: 200000, // ₹2,000.00
    appliesTo: "subscription",
    productIds: [],
    minPurchase: 1000000, // ₹10,000.00
    minQuantity: 1,
    startDate: "2026-01-01",
    endDate: null,
    usageLimit: 100,
    usedCount: 42,
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];
