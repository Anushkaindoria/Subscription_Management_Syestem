import React from "react";
import { SubscriptionDetail } from "@/components/features/subscriptions/SubscriptionDetail";

export default function SubscriptionDetailPage({ params }: { params: { id: string } }) {
  return <SubscriptionDetail id={params.id} />;
}
