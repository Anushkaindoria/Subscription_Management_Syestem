import { SystemSettingsDTO } from "./schema";

export interface SystemConfigSnapshot {
  settings: SystemSettingsDTO;
  lastUpdated: string;
}
