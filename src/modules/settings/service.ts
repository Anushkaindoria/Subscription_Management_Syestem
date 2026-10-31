/**
 * Settings Module Service
 * OWNER: Dev A (@devA)
 */

import { SystemSettingsDTO, UpdateSystemSettingsDTO } from "./schema";
import { settingsRepo } from "./repo";

export class SettingsService {
  async getSettings(): Promise<SystemSettingsDTO> {
    return await settingsRepo.getSettings();
  }

  async updateSettings(dto: UpdateSystemSettingsDTO): Promise<SystemSettingsDTO> {
    return await settingsRepo.updateSettings(dto);
  }
}

export const settingsService = new SettingsService();
