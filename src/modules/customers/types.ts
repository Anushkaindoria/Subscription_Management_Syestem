import { CustomerDTO } from "./schema";

export interface CustomerRollup {
  customer: CustomerDTO;
  activeSubscriptionsCount: number;
  totalMrrMinor: number;
  outstandingInvoicesCount: number;
  totalOutstandingMinor: number;
}
