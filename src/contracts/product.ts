import { z } from "zod";

export const AttributeValueSchema = z.object({
  label: z.string(),
  priceExtra: z.number().int(), // Minor units (paise)
});
export type AttributeValue = z.infer<typeof AttributeValueSchema>;

export const ProductAttributeSchema = z.object({
  name: z.string(),
  values: z.array(AttributeValueSchema),
});
export type ProductAttribute = z.infer<typeof ProductAttributeSchema>;

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  type: z.string().default("service"),
  salesPrice: z.number().int(), // Minor units
  costPrice: z.number().int(), // Minor units
  notes: z.string().nullable().optional(),
  attributes: z.array(ProductAttributeSchema).default([]),
  active: z.boolean().default(true),
  createdAt: z.string().optional(),
});
export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = ProductSchema.omit({ id: true, createdAt: true });
export type CreateProduct = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial();
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
