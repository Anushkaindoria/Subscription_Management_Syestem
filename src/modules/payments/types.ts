import { PaymentDTO } from "@/contracts";

export interface PaymentReceipt {
  payment: PaymentDTO;
  invoiceFullyPaid: boolean;
  remainingBalanceMinor: number;
}
