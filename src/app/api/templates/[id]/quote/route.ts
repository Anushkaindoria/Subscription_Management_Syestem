import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { GenerateQuoteFromTemplateSchema } from "@/contracts/template";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, GenerateQuoteFromTemplateSchema);
    return ok({
      subscriptionNumber: `SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: body.customerId,
      templateId: params.id,
      status: "quotation",
      generatedAt: new Date().toISOString(),
    }, 201);
  } catch (err: any) {
    return fail(err.code || "QUOTE_GEN_FAILED", err.message, 400, err.fields);
  }
}
