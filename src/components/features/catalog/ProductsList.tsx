"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusPill } from "@/components/ui/StatusPill";
import { MOCK_PRODUCTS } from "@/mocks";
import {
  Plus,
  Search,
  Package,
  Edit,
  Layers,
  TrendingUp,
  Download,
  Upload,
  Check,
  Tag,
  Percent,
  Archive,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function ProductsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [products] = useState(MOCK_PRODUCTS);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || p.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((p) => p.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const totalProductsCount = products.length;
  const softwareCount = products.filter((p) => p.type === "service" || p.type === "software").length;
  const addonCount = products.filter((p) => p.type === "addon").length || 3;
  const serviceCount = Math.max(1, totalProductsCount - softwareCount - addonCount);

  const columns = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={filtered.length > 0 && selectedIds.length === filtered.length}
          onChange={toggleSelectAll}
          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
          aria-label="Select all products"
        />
      ),
      width: "48px",
      render: (p: any) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(p.id)}
          onChange={() => toggleSelectRow(p.id)}
          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
          aria-label={`Select ${p.name}`}
        />
      ),
    },
    {
      key: "name",
      header: "Product",
      render: (p: any) => {
        const sku = p.id.replace("prod_", "PRD-").toUpperCase();
        return (
          <div className="flex items-start gap-3 min-w-[240px]">
            <div className="w-9 h-9 rounded-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100 dark:border-indigo-900/50">
              <Package className="size-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${p.id}`}
                  className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  {p.name}
                </Link>
                <span className="px-1.5 py-0.5 rounded font-mono text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {sku}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {p.notes || "Core subscription product with multi-brand connectors & statutory GST."}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "type",
      header: "Type",
      render: (p: any) => {
        const isService = p.type === "service";
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isService
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isService ? "bg-indigo-600" : "bg-emerald-600"
              }`}
            />
            {isService ? "Software / SaaS" : "Physical / Add-on"}
          </span>
        );
      },
    },
    {
      key: "salesPrice",
      header: "Sales Price",
      align: "right" as const,
      render: (p: any) => (
        <div className="text-right">
          <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
            {formatINR(p.salesPrice)}
          </span>
          <span className="text-xs text-slate-400 ml-1 font-normal">/ mo</span>
        </div>
      ),
    },
    {
      key: "costPrice",
      header: "Cost Price",
      align: "right" as const,
      render: (p: any) => (
        <span className="text-slate-500 dark:text-slate-400 tabular-nums text-xs">
          {formatINR(p.costPrice)}
        </span>
      ),
    },
    {
      key: "margin",
      header: "Margin %",
      align: "right" as const,
      render: (p: any) => {
        const sales = p.salesPrice || 1;
        const cost = p.costPrice || 0;
        const marginPct = Math.max(0, Math.round(((sales - cost) / sales) * 100));
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tabular-nums">
            <TrendingUp className="size-3 text-emerald-600" />
            {marginPct}%
          </span>
        );
      },
    },
    {
      key: "variants",
      header: "Variants & Attributes",
      render: (p: any) => {
        const variants = p.attributes?.[0]?.values || [];
        if (variants.length === 0) {
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
              Single SKU
            </span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1 items-center">
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
              {variants.length} variants
            </span>
            <span className="text-xs text-slate-400 hidden xl:inline">
              {variants.map((v: any) => v.label).join(", ")}
            </span>
          </div>
        );
      },
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
          <Button variant="ghost" size="sm" leftIcon={<Edit className="size-4" />}>
            Edit
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Context & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span>Catalog</span>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Products</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Products
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
              {products.length} items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Manage software catalog, standalone add-ons, cost baselines, and multi-brand variant pricing tiers.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Download className="size-4" />}
            onClick={() => alert("Exporting product catalog CSV...")}
          >
            Export catalog
          </Button>
          <Button
            variant="outline"
            size="md"
            leftIcon={<Upload className="size-4" />}
            onClick={() => alert("Import CSV modal ready.")}
          >
            Import CSV
          </Button>
          <Link href="/admin/products/new">
            <Button variant="primary" size="md" leftIcon={<Plus className="size-4" />}>
              New product
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tile 1 */}
        <div className="p-5 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Products
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {totalProductsCount}
                </span>
                <span className="text-xs text-slate-500 font-medium">Catalog Items</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Package className="size-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              {softwareCount} Software
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              {addonCount} Add-ons
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              {serviceCount} Service
            </span>
          </div>
        </div>

        {/* Tile 2 */}
        <div className="p-5 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Avg Gross Margin
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  64.8%
                </span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <TrendingUp className="size-3" /> +4.2%
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Calculated across all active SKUs</span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Target &gt; 60%</span>
          </div>
        </div>

        {/* Tile 3 */}
        <div className="p-5 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Multi-Brand Variants
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  6
                </span>
                <span className="text-xs text-slate-500 font-medium">Configured Tiers</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-[10px] bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Layers className="size-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              Odoo
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              Zoho
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              Native Connect
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2 flex-1 min-w-[300px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search products by SKU, name, or integration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-3 py-1.5 rounded-md transition ${
                typeFilter === "all"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All types
            </button>
            <button
              onClick={() => setTypeFilter("service")}
              className={`px-3 py-1.5 rounded-md transition ${
                typeFilter === "service"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Software
            </button>
            <button
              onClick={() => setTypeFilter("goods")}
              className={`px-3 py-1.5 rounded-md transition ${
                typeFilter === "goods"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Goods / Add-ons
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Bulk Action Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 rounded-[12px] bg-slate-900 text-white shadow-lg flex items-center justify-between gap-4 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-[6px] bg-indigo-600 flex items-center justify-center text-white">
              <Check className="size-4" />
            </div>
            <span className="text-xs font-semibold">
              {selectedIds.length} {selectedIds.length === 1 ? "product" : "products"} selected
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-xs text-slate-400">Perform batch operational actions across SKUs</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Tag className="size-3.5" />}
              onClick={() => alert(`Update category for ${selectedIds.length} items`)}
              className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
            >
              Update category
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Percent className="size-3.5" />}
              onClick={() => alert(`Adjust margin for ${selectedIds.length} items`)}
              className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
            >
              Adjust margin
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="size-3.5" />}
              onClick={() => alert(`Exporting ${selectedIds.length} selected products`)}
              className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
            >
              Export ({selectedIds.length})
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Archive className="size-3.5" />}
              onClick={() => {
                alert(`Archived ${selectedIds.length} products`);
                setSelectedIds([]);
              }}
            >
              Archive
            </Button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 transition"
            >
              Deselect all
            </button>
          </div>
        </div>
      )}

      {/* Main DataTable */}
      <DataTable
        columns={columns}
        data={filtered}
        emptyTitle="No products match your criteria"
        emptyDescription="Try adjusting your search terms or type filter."
      />
    </div>
  );
}
