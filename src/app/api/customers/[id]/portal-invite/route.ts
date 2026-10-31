import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok({
      success: true,
      customerId: params.id,
      inviteUrl: `/portal?token=invite_${params.id}_${Date.now()}`,
    });
  } catch (err: any) {
    return fail(err.code || "INVITE_FAILED", err.message, 400);
  }
}
