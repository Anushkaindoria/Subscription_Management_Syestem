"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, Product } from "@/contracts/product";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { MOCK_PRODUCTS } from "@/mocks";
import { ArrowLeft, Plus, Trash2, Check, Package, AlertCircle } from "lucide-react";

export function ProductEditor({ productId }: { productId: string }) {
  const router = useRouter();
  const existing = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];
  const [attributes, setAttributes] = useState(
    existing.attributes || [
      {
        name: "Brand Variant",
        values: [
          { label: "Odoo Compatible", priceExtra: 56000 },
          { label: "Zoho Sync", priceExtra: 30000 },
          { label: "Native LoopOS", priceExtra: 0 },
        ],
      },
    ]
  );
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Product>({
    defaultValues: {
      id: existing.id || "prod_brightloop_crm",
      name: existing.name || "Brightloop CRM Suite",
      type: existing.type || "service",
      salesPrice: existing.salesPrice || 120000,
      costPrice: existing.costPrice || 45000,
      active: true,
      notes: existing.notes || "Core cloud subscription product with multi-brand connectors.",
      attributes,
    },
  });

  const addVariantValue = () => {
    const next = [...attributes];
    next[0].values.push({ label: "Custom Edition", priceExtra: 25000 });
    setAttributes(next);
  };

  const removeVariantValue = (idx: number) => {
    const next = [...attributes];
    next[0].values.splice(idx, 1);
    setAttributes(next);
  };

  const onSubmit = async () => {
    setSuccess(true);
    setTimeout(() => {
      router.push("/admin/products");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to catalog
        </Link>
        <span className="text-xs text-slate-400 font-mono">ID: {productId}</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {productId === "new" ? "New Product" : `Edit Product: ${existing.name}`}
            </h1>
            <p className="text-xs text-slate-500">Configure base price, GST classification, and price extras.</p>
          </div>
        </div>

        {success && (
          <div className="p-3.5 rounded-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs font-semibold">
            <Check className="w-4 h-4" />
            Product saved successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Product Title"
              placeholder="e.g. Enterprise Cloud Suite"
              error={errors.name?.message}
              {...register("name")}
            />

            <Select
              label="Product Type"
              options={[
                { value: "service", label: "Service / Recurring Subscription" },
                { value: "goods", label: "Physical Hardware" },
              ]}
              {...register("type")}
            />

            <Input
              label="Sales Price (in Paise)"
              type="number"
              placeholder="120000 (₹1,200.00)"
              helperText="Base unit price before variant increments"
              error={errors.salesPrice?.message}
              {...register("salesPrice", { valueAsNumber: true })}
            />

            <Input
              label="Cost Price (in Paise)"
              type="number"
              placeholder="45000 (₹450.00)"
              helperText="Cost of goods / server hosting cost"
              error={errors.costPrice?.message}
              {...register("costPrice", { valueAsNumber: true })}
            />
          </div>

          <Input
            label="Internal Notes"
            placeholder="Operational guidelines, billing terms, support SLAs..."
            error={errors.notes?.message}
            {...register("notes")}
          />

          {/* Variants Configuration Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Brand Variants & Attributes
                </h3>
                <p className="text-xs text-slate-500">
                  Allow customers to configure add-on connectors with extra charges.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addVariantValue}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Variant
              </Button>
            </div>

            <div className="space-y-2.5">
              {attributes[0]?.values.map((v: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-[10px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
                >
                  <input
                    type="text"
                    value={v.label}
                    onChange={(e) => {
                      const next = [...attributes];
                      next[0].values[idx].label = e.target.value;
                      setAttributes(next);
                    }}
                    className="flex-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[8px] px-3 py-2 text-slate-900 dark:text-white"
                  />
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span>+₹</span>
                    <input
                      type="number"
                      value={v.priceExtra / 100}
                      onChange={(e) => {
                        const next = [...attributes];
                        next[0].values[idx].priceExtra = Number(e.target.value) * 100;
                        setAttributes(next);
                      }}
                      className="w-24 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[8px] px-2.5 py-2 text-slate-900 dark:text-white text-right tabular-nums font-semibold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariantValue(idx)}
                    className="text-slate-400 hover:text-red-500 transition p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Link href="/admin/products">
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
              Save Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
