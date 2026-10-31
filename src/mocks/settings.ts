import { Settings } from "@/contracts/settings";

export const MOCK_SETTINGS: Settings = {
  companyName: "LoopOS Technologies Pvt Ltd",
  companyAddress: "Tech Hub, 4th Block, 80 Feet Road, Koramangala, Bengaluru, Karnataka 560034",
  gstinTaxId: "29AABCL9999Z1Z5",
  currency: "INR",
  invoicePrefix: "INV-2026-",
  subscriptionPrefix: "SUB-2026-",
  defaultPaymentTermsDays: 15,
  reminderScheduleDays: [7, 3, 1],
  supportEmail: "billing@loopos.io",
};
