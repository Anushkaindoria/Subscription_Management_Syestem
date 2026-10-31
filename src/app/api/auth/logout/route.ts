import { NextRequest } from "next/server";
import { ok, applyMockDelay } from "@/app/api/_lib/handler";

export async function POST(_req: NextRequest) {
  await applyMockDelay(100);
  return ok({ message: "Successfully logged out" });
}
