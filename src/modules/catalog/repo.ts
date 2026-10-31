/**
 * Catalog Module Repository
 * OWNER: Dev B (@devB)
 */

import { db } from "@/lib/db";
import { Product, Plan, QuotationTemplate } from "@prisma/client";

export class CatalogRepository {
  async listProducts(): Promise<Product[]> {
    return await db.product.findMany({
      where: { active: true },
      include: { variants: true },
    });
  }

  async listPlans(): Promise<Plan[]> {
    return await db.plan.findMany({
      where: { active: true },
    });
  }

  async listTemplates(): Promise<QuotationTemplate[]> {
    return await db.quotationTemplate.findMany({
      where: { active: true },
      include: { lines: true },
    });
  }
}

export const catalogRepo = new CatalogRepository();
