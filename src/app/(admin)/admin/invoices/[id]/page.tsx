import React from "react";
import { InvoiceDetail } from "@/components/features/invoices/InvoiceDetail";

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return <InvoiceDetail id={params.id} />;
}
