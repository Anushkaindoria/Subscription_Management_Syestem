import { NextRequest } from "next/server";
import { ok, assertAuth, paginate, applyMockDelay, handleError } from "@/app/api/_lib/handler";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    const user = assertAuth(req, ["customer"]);
    const customerId = user.customerId || "cust_acme_retail";
    const subs = MOCK_SUBSCRIPTIONS.filter((s) => s.customerId === customerId);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    return ok(paginate(subs, page, pageSize));
  } catch (err) {
    return handleError(err);
  }
}
