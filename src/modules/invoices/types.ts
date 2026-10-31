import { InvoiceDTO } from "@/contracts";

export interface InvoiceSendResult {
  invoiceId: string;
  recipientEmail: string;
  sentAt: string;
}
