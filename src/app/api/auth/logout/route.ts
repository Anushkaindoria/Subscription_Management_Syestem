import { NextRequest } from "next/server";
import { ok, applyMockDelay } from "@/app/api/_lib/handler";
import { SESSION_COOKIE } from "@/modules/auth";

export async function POST(_req: NextRequest) {
  await applyMockDelay(100);
  const res = ok({ message: "Successfully logged out" });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
