import { Plan } from "@/contracts/plan";

export const MOCK_PLANS: Plan[] = [
  {
    id: "plan_starter_monthly",
    name: "Starter Monthly",
    price: 149900, // ₹1,499.00
    period: "monthly",
    minQuantity: 1,
    availableFrom: "2026-01-01",
    availableTo: null,
    autoClose: false,
    closable: true,
    pausable: true,
    renewable: true,
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "plan_business_yearly",
    name: "Business Yearly",
    price: 1499900, // ₹14,999.00
    period: "yearly",
    minQuantity: 1,
    availableFrom: "2026-01-01",
    availableTo: null,
    autoClose: false,
    closable: true,
    pausable: false,
    renewable: true,
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "plan_team_weekly",
    name: "Team Weekly",
    price: 39900, // ₹399.00
    period: "weekly",
    minQuantity: 1,
    availableFrom: "2026-01-01",
    availableTo: null,
    autoClose: false,
    closable: true,
    pausable: true,
    renewable: true,
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "plan_daily_trial",
    name: "Daily Trial",
    price: 4900, // ₹49.00
    period: "daily",
    minQuantity: 1,
    availableFrom: "2026-01-01",
    availableTo: null,
    autoClose: true,
    closable: true,
    pausable: false,
    renewable: false,
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];
