"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusPill } from "@/components/ui/StatusPill";
import { MOCK_PRODUCTS } from "@/mocks";
import { Plus, Search, Package, Edit, Layers } from "lucide-react";

export function ProductsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products] = useState(MOCK_PRODUCTS);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      header: "Product Name",
      render: (p: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center font-bold">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <Link
              href={`/admin/products/${p.id}`}
              className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 transition"
            >
              {p.name}
            </Link>
            <div className="text-xs text-slate-400 capitalize">{p.type}</div>
          </div>
        </div>
      ),
    },
    {
      key: "variants",
      header: "Variants & Attributes",
      render: (p: any) => {
        const variants = p.attributes?.[0]?.values || [];
        if (variants.length === 0) return <span className="text-xs text-slate-400">Standard</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {variants.map((v: any, i: number) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <Layers className="w-3 h-3 text-slate-400" />
                {v.label} {v.priceExtra > 0 ? `(+₹${v.priceExtra / 100})` : ""}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "salesPrice",
      header: "Base Price",
      align: "right" as const,
      render: (p: any) => (
        <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
          {formatINR(p.salesPrice)}
        </span>
      ),
    },
    {
      key: "costPrice",
      header: "Cost Price",
      align: "right" as const,
      render: (p: any) => (
        <span className="text-slate-500 tabular-nums">
          {formatINR(p.costPrice)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: () => <StatusPill status="active" />,
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (p: any) => (
        <Link href={`/admin/products/${p.id}`}>
          <Button variant="ghost" size="sm" leftIcon={<Edit className="w-3.5 h-3.5" />}>
            Edit
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage subscription software, add-ons, and multi-attribute brand variants.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Create Product
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search products by title or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyTitle="No products match your criteria"
        emptyDescription="Try adjusting your search terms or add a new product."
      />
    </div>
  );
}
