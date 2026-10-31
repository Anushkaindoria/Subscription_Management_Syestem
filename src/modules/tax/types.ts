import { TaxBreakdownDTO } from "@/contracts";

export interface TaxCalculationResult extends TaxBreakdownDTO {
  taxRuleName: string;
}
