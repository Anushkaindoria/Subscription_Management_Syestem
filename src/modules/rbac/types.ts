import { RoleType, Permission } from "@/contracts";

export interface RolePermissionsMap {
  [role: string]: Permission[];
}
