import { StaffMemberDTO } from "./schema";

export interface StaffAuditLog {
  staffId: string;
  action: "CREATED" | "ACTIVATED" | "DEACTIVATED";
  performedBy: string;
  timestamp: string;
}
