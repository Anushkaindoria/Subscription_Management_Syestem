/**
 * Catalog Module Service
 * OWNER: Dev B (@devB)
 */

import { ProductDTO, PlanDTO, QuotationTemplateDTO } from "@/contracts";
import { config } from "@/lib/config";
import { catalogRepo } from "./repo";

const MOCK_PRODUCTS: ProductDTO[] = [
  {
    id: "prod_crm",
    name: "LoopCRM Enterprise",
    code: "CRM-ENT",
    description: "Full-cycle customer relationship and lead management platform.",
    active: true,
    variants: [
      {
        id: "var_crm_starter",
        productId: "prod_crm",
        name: "Standard 10 Seats",
        sku: "CRM-10S",
        priceExtra: 0,
        active: true,
      },
      {
        id: "var_crm_unlimited",
        productId: "prod_crm",
        name: "Unlimited Enterprise Seats",
        sku: "CRM-UNL",
        priceExtra: 15000, // +$150.00
        active: true,
      },
    ],
  },
  {
    id: "prod_desk",
    name: "LoopDesk Support Suite",
    code: "DESK-PRO",
    description: "Ticketing, live chat, and automated SLA escalations.",
    active: true,
    variants: [],
  },
];

const MOCK_PLANS: PlanDTO[] = [
  {
    id: "plan_monthly",
    name: "Monthly Pro",
    code: "PRO-M",
    interval: "MONTHLY",
    intervalCount: 1,
    basePrice: 9900, // $99.00
    active: true,
  },
  {
    id: "plan_annual",
    name: "Annual Enterprise",
    code: "ENT-A",
    interval: "ANNUALLY",
    intervalCount: 12,
    basePrice: 99000, // $990.00
    active: true,
  },
];

const MOCK_TEMPLATES: QuotationTemplateDTO[] = [
  {
    id: "tmpl_default",
    name: "Standard B2B SaaS Bundle",
    description: "LoopCRM + Support Suite 12-month agreement",
    durationMonths: 12,
    active: true,
    lines: [
      {
        productId: "prod_crm",
        variantId: "var_crm_starter",
        planId: "plan_annual",
        quantity: 1,
        discountPercent: 10,
        sortOrder: 1,
      },
    ],
  },
];

export class CatalogService {
  async getProducts(): Promise<ProductDTO[]> {
    if (config.isMockApi) {
      return MOCK_PRODUCTS;
    }
    const products = await catalogRepo.listProducts();
    return products.map((p) => ({
      ...p,
      variants: (p as unknown as { variants?: ProductDTO["variants"] }).variants || [],
    }));
  }

  async getPlans(): Promise<PlanDTO[]> {
    if (config.isMockApi) {
      return MOCK_PLANS;
    }
    return (await catalogRepo.listPlans()) as PlanDTO[];
  }

  async getQuotationTemplates(): Promise<QuotationTemplateDTO[]> {
    if (config.isMockApi) {
      return MOCK_TEMPLATES;
    }
    return (await catalogRepo.listTemplates()) as QuotationTemplateDTO[];
  }
}

export const catalogService = new CatalogService();
