import React from "react";
import { CustomerDetail } from "@/components/features/customers/CustomerDetail";

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  return <CustomerDetail customerId={params.id} />;
}
