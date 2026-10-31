import { NextRequest } from "next/server";
import {
  ok,
  assertAuth,
  paginate,
  applyMockDelay,
  parseAndValidate,
  handleError,
} from "@/app/api/_lib/handler";
import { CreateSubscriptionSchema } from "@/contracts/subscription";
import { SubscriptionStatusValues, type SubscriptionStatus } from "@/contracts/enums";
import { ValidationError } from "@/lib/errors";
import { MOCK_SUBSCRIPTIONS } from "@/mocks/subscriptions";
import { subscriptionLifecycle } from "@/modules/subscriptions";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "25", 10);
    const status = req.nextUrl.searchParams.get("status");

    if (process.env.MOCK_API !== "true") {
      if (status && !(SubscriptionStatusValues as readonly string[]).includes(status)) {
        throw new ValidationError(
          `Invalid status '${status}'. Allowed: ${SubscriptionStatusValues.join(", ")}.`,
        );
      }
      return ok(
        await subscriptionLifecycle.list({
          status: (status as SubscriptionStatus | null) ?? undefined,
          page,
          pageSize,
        }),
      );
    }

    let items = MOCK_SUBSCRIPTIONS;
    if (status) items = items.filter((s) => s.status === status);
    return ok(paginate(items, page, pageSize));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin", "staff"]);
    const body = await parseAndValidate(req, CreateSubscriptionSchema);

    if (process.env.MOCK_API !== "true") {
      return ok(await subscriptionLifecycle.create(body), 201);
    }

    const sub = {
      id: `sub_${Date.now()}`,
      number: `SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      ...body,
      status: "draft" as const,
      nextBillingDate: null,
    };
    return ok(sub, 201);
  } catch (err) {
    return handleError(err);
  }
}