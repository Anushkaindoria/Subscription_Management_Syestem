import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdateTaxRuleSchema } from "@/contracts/tax";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, name: "GST 18%", rateBasisPoints: 1800, isGst: true });
  } catch (err: any) {
    return fail(err.code || "NOT_FOUND", err.message, err.status || 404);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, UpdateTaxRuleSchema);
    return ok({ id: params.id, ...body });
  } catch (err: any) {
    return fail(err.code || "UPDATE_TAX_FAILED", err.message, err.status || 400, err.fields);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, deleted: true });
  } catch (err: any) {
    return fail(err.code || "DELETE_FAILED", err.message, err.status || 400);
  }
}
