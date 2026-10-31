import React from "react";
import { PlanEditor } from "@/components/features/catalog/PlanEditor";

export default function PlanDetailPage({ params }: { params: { id: string } }) {
  return <PlanEditor planId={params.id} />;
}
