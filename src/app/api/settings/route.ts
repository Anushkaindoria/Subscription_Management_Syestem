import { NextRequest } from "next/server";
import { ok, fail, assertAuth, applyMockDelay, parseAndValidate } from "@/app/api/_lib/handler";
import { UpdateSettingsSchema } from "@/contracts/settings";
import { settingsService } from "@/modules/settings";

export async function GET(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const settings = await settingsService.getSettings();
    return ok(settings);
  } catch (err: any) {
    return fail(err.code || "FORBIDDEN", err.message, err.status || 403);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await applyMockDelay();
    assertAuth(req, ["admin"]);
    const body = await parseAndValidate(req, UpdateSettingsSchema);
    const updated = await settingsService.updateSettings(body);
    return ok(updated);
  } catch (err: any) {
    return fail(err.code || "UPDATE_SETTINGS_FAILED", err.message, err.status || 400, err.fields);
  }
}
