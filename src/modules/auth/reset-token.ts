import { createHmac, createHash, timingSafeEqual } from "crypto";

const RESET_MINUTES = 30;

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET missing hai ya chhota hai");
  return s + ":password-reset";
}

// Purane password hash ka fingerprint: password badalte hi ye badal jata hai
export function fingerprint(passwordHash: string): string {
  return createHash("sha256").update(passwordHash).digest("hex").slice(0, 16);
}

export function createResetToken(userId: string, passwordHash: string): string {
  const exp = Math.floor(Date.now() / 1000) + RESET_MINUTES * 60;
  const body = Buffer.from(
    JSON.stringify({ u: userId, e: exp, f: fingerprint(passwordHash) })
  ).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readResetToken(
  token: string
): { userId: string; fp: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = createHmac("sha256", secret()).update(body).digest();
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof p.u !== "string" || typeof p.f !== "string" || typeof p.e !== "number") return null;
    if (p.e < Math.floor(Date.now() / 1000)) return null; // expired
    return { userId: p.u, fp: p.f };
  } catch {
    return null;
  }
}
