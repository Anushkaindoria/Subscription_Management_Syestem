import { ProductDTO, PlanDTO, QuotationTemplateDTO } from "@/contracts";

export interface CatalogSummary {
  totalProducts: number;
  totalPlans: number;
  totalTemplates: number;
}
