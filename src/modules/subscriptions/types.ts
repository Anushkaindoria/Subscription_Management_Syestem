import { SubscriptionStatusType } from "@/contracts";

export interface AllowedTransitionsMap {
  [current: string]: SubscriptionStatusType[];
}
