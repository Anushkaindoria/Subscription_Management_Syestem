import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { CreateTaxRuleSchema, TaxRule } from "@/contracts/tax";

const MOCK_TAX_RULES: TaxRule[] = [
  {
    id: "tax_gst_18",
    name: "GST 18% (Standard Rate)",
    code: "GST-18",
    rateBasisPoints: 1800,
    isGst: true,
    cgstRateBasisPoints: 900,
    sgstRateBasisPoints: 900,
    igstRateBasisPoints: 1800,
    active: true,
  },
  {
    id: "tax_gst_zero",
    name: "Zero Rated Export",
    code: "GST-0",
    rateBasisPoints: 0,
    isGst: false,
    active: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(MOCK_TAX_RULES, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "FORBIDDEN", err.message, err.status || 403);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, CreateTaxRuleSchema);
    const tax = { id: `tax_${Date.now()}`, ...body, createdAt: new Date().toISOString() };
    return ok(tax, 201);
  } catch (err: any) {
    return fail(err.code || "CREATE_TAX_FAILED", err.message, err.status || 400, err.fields);
  }
}
