/**
 * Settings Module Repository
 * OWNER: Dev A (@devA)
 */

import { SystemSettingsDTO } from "./schema";

let memorySettings: SystemSettingsDTO = {
  companyName: "LoopOS Cloud Technologies Pvt Ltd",
  companyAddress: "742 Evergreen Terrace, Koramangala, Bengaluru 560034",
  gstinTaxId: "29AAACA9999Z1ZX",
  currency: "INR",
  invoicePrefix: "INV-2026-",
  subscriptionPrefix: "SUB-2026-",
  defaultPaymentTermsDays: 15,
  reminderScheduleDays: [7, 3, 1],
  supportEmail: "billing@loopos.local",
};

export class SettingsRepository {
  async getSettings(): Promise<SystemSettingsDTO> {
    return { ...memorySettings };
  }

  async updateSettings(data: Partial<SystemSettingsDTO>): Promise<SystemSettingsDTO> {
    memorySettings = { ...memorySettings, ...data };
    return { ...memorySettings };
  }
}

export const settingsRepo = new SettingsRepository();
