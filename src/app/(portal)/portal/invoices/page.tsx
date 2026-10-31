import { PortalInvoicesList } from "@/components/features/portal/PortalInvoicesList";

export const metadata = {
  title: "Invoices & Receipts | LoopOS Portal",
  description: "Download tax invoices and settle outstanding bill balances.",
};

export default function PortalInvoicesPage() {
  return <PortalInvoicesList />;
}
