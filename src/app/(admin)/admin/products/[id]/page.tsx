import React from "react";
import { ProductEditor } from "@/components/features/catalog/ProductEditor";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductEditor productId={params.id} />;
}
