import { PortalInvoiceDetail } from "@/components/features/portal/PortalInvoiceDetail";

export const metadata = {
  title: "Tax Invoice | LoopOS Portal",
  description: "View itemized bill details, GST calculations, and payment status.",
};

export default function PortalInvoiceDetailPage() {
  return <PortalInvoiceDetail />;
}
