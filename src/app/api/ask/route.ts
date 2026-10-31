import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { AskRequestSchema } from "@/contracts/ask";
import { askService } from "@/modules/ask";

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, AskRequestSchema);
    const result = await askService.processQuery(body);
    return ok(result);
  } catch (err: any) {
    return fail(err.code || "ASK_FAILED", err.message, 400, err.fields);
  }
}
