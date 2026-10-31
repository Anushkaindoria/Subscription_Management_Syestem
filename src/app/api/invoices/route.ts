import { NextRequest } from "next/server";
import { ok, fail, assertAuth, paginate, applyMockDelay } from "@/app/api/_lib/handler";
import { MOCK_INVOICES } from "@/mocks/invoices";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(MOCK_INVOICES, page, pageSize));
  } catch (err: any) {
    return fail(err.code || "ERROR", err.message, err.status || 500);
  }
}
