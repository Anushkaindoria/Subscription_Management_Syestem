import { NextRequest } from "next/server";
import { ok, assertAuth, applyMockDelay, handleError } from "@/app/api/_lib/handler";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok({
      success: true,
      customerId: params.id,
      inviteUrl: `/portal?token=invite_${params.id}_${Date.now()}`,
    });
  } catch (err) {
    return handleError(err);
  }
}
