import type { InvoiceDTO } from "@/contracts";
import { invoiceService } from "@/modules/invoices";
import { isCustomerVisible } from "./portal-invoice-mapper";

/** Sirf is customer ke (aur Draft ke alawa) invoices. */
export async function listCustomerInvoices(customerId: string): Promise<InvoiceDTO[]> {
  const all = await invoiceService.listInvoices(customerId);
  return all.filter(isCustomerVisible);
}

/**
 * Ownership check: invoice sirf us customer ki list mein dhundhte hain.
 * Dusre customer ka invoice null aata hai (route 404 deta hai).
 */
export async function findCustomerInvoice(
  customerId: string,
  idOrNumber: string,
): Promise<InvoiceDTO | null> {
  const list = await listCustomerInvoices(customerId);
  return list.find((i) => i.id === idOrNumber || i.invoiceNumber === idOrNumber) ?? null;
}