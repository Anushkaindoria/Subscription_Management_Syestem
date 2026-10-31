import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay } from "@/app/api/_lib/handler";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    return ok({ id: params.id, name: "Enterprise Growth Bundle", durationMonths: 12, lines: [] });
  } catch (err: any) {
    return fail(err.code || "NOT_FOUND", err.message, 404);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, updated: true });
  } catch (err: any) {
    return fail(err.code || "UPDATE_FAILED", err.message, 400);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    return ok({ id: params.id, deleted: true });
  } catch (err: any) {
    return fail(err.code || "DELETE_FAILED", err.message, 400);
  }
}
