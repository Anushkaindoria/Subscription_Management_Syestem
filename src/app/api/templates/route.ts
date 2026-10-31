import { NextRequest } from "next/server";
import { ok, assertAuth, applyMockDelay, parseAndValidate, handleError } from "@/app/api/_lib/handler";
import { CreateQuotationTemplateSchema, QuotationTemplate } from "@/contracts/template";

const MOCK_TEMPLATES: QuotationTemplate[] = [
  {
    id: "tmpl_saas_bundle",
    name: "Enterprise Growth Bundle",
    description: "Brightloop CRM Suite + Extra Seats + Priority Support",
    durationMonths: 12,
    active: true,
    lines: [
      { productId: "prod_brightloop_crm", quantity: 1, discountPercent: 10 },
      { productId: "prod_extra_seats", quantity: 5, discountPercent: 10 },
    ],
  },
];

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok(MOCK_TEMPLATES);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, CreateQuotationTemplateSchema);
    const tmpl = { id: `tmpl_${Date.now()}`, ...body };
    return ok(tmpl, 201);
  } catch (err) {
    return handleError(err);
  }
}
