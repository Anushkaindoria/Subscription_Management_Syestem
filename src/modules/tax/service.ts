/**
 * Tax Module Service
 * OWNER: Dev A (@devA)
 *
 * Implements GST split calculation (CGST + SGST vs IGST) and zero-float rounding.
 */

import { CalculateTaxDTO, TaxBreakdownDTO, TaxRuleDTO } from "@/contracts";
import { Money } from "@/lib/money";
import { config } from "@/lib/config";
import { taxRepo } from "./repo";

const MOCK_TAX_RULES: TaxRuleDTO[] = [
  {
    id: "tax_gst_18",
    name: "GST 18%",
    code: "GST-18",
    rateBasisPoints: 1800,
    isGst: true,
    cgstRateBasisPoints: 900,
    sgstRateBasisPoints: 900,
    igstRateBasisPoints: 1800,
    active: true,
  },
  {
    id: "tax_zero",
    name: "Zero Rated Export",
    code: "ZERO-0",
    rateBasisPoints: 0,
    isGst: false,
    active: true,
  },
];

export class TaxService {
  async getTaxRules(): Promise<TaxRuleDTO[]> {
    if (config.isMockApi) {
      return MOCK_TAX_RULES;
    }
    const rules = await taxRepo.listActive();
    return rules as TaxRuleDTO[];
  }

  async calculateTax(dto: CalculateTaxDTO): Promise<TaxBreakdownDTO> {
    const rules = await this.getTaxRules();
    const rule = rules.find((r) => r.id === dto.taxRuleId) || rules[0];

    if (!rule || rule.rateBasisPoints === 0) {
      return {
        taxRuleId: dto.taxRuleId,
        rateBasisPoints: 0,
        cgstAmountMinor: 0,
        sgstAmountMinor: 0,
        igstAmountMinor: 0,
        totalTaxAmountMinor: 0,
      };
    }

    const taxableAmount = dto.taxableAmountMinor ?? dto.amount ?? 0;
    if (rule.isGst) {
      if (dto.isInterState) {
        // Inter-state: 100% IGST
        const igst = Money.multiplyBasisPoints(
          taxableAmount,
          rule.igstRateBasisPoints ?? rule.rateBasisPoints,
        );
        return {
          taxRuleId: rule.id,
          rateBasisPoints: rule.rateBasisPoints,
          cgstAmountMinor: 0,
          sgstAmountMinor: 0,
          igstAmountMinor: igst,
          totalTaxAmountMinor: igst,
        };
      } else {
        // Intra-state: CGST (9%) + SGST (9%)
        const cgst = Money.multiplyBasisPoints(
          taxableAmount,
          rule.cgstRateBasisPoints ?? rule.rateBasisPoints / 2,
        );
        const sgst = Money.multiplyBasisPoints(
          taxableAmount,
          rule.sgstRateBasisPoints ?? rule.rateBasisPoints / 2,
        );
        return {
          taxRuleId: rule.id,
          rateBasisPoints: rule.rateBasisPoints,
          cgstAmountMinor: cgst,
          sgstAmountMinor: sgst,
          igstAmountMinor: 0,
          totalTaxAmountMinor: cgst + sgst,
        };
      }
    }

    const total = Money.multiplyBasisPoints(taxableAmount, rule.rateBasisPoints);
    return {
      taxRuleId: rule.id,
      rateBasisPoints: rule.rateBasisPoints,
      cgstAmountMinor: 0,
      sgstAmountMinor: 0,
      igstAmountMinor: 0,
      totalTaxAmountMinor: total,
    };
  }
}

export const taxService = new TaxService();
