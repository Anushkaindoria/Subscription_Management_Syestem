import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "loopos_session";
const SESSION_HOURS = 8;

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "customer";
  customerId: string | null;
};

// Secret .env se aata hai. Missing ya chhota ho to turant error.
function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET missing hai ya 32 chars se chhota hai");
  }
  return secret;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

// Signature banane ka kaam: data + secret se HMAC-SHA256
function hmac(data: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(data).digest();
}

// Token banao: header.body.signature (standard JWT format)
export function signSession(payload: SessionPayload): string {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(
    JSON.stringify({
      sub: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      customerId: payload.customerId,
      iat: now,
      exp: now + SESSION_HOURS * 60 * 60,
    })
  );
  const data = `${header}.${body}`;
  return `${data}.${b64url(hmac(data, getSecret()))}`;
}

// Token check karo: sahi hai to payload, warna null
export function verifySession(
  token: string | undefined | null
): SessionPayload | null {
  if (!token) return null;
  const secret = getSecret(); // try ke bahar, taaki config error chhup na jaye

  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;

  // Signature match karo (timingSafeEqual: timing attack se bachav)
  const expected = hmac(`${header}.${body}`, secret);
  const given = Buffer.from(signature, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return null; // tampered token
  }

  try {
    const h = JSON.parse(Buffer.from(header, "base64url").toString());
    if (h.alg !== "HS256") return null;

    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    const now = Math.floor(Date.now() / 1000);
    if (typeof p.exp !== "number" || p.exp < now) return null; // expired

    const role = p.role;
    if (
      typeof p.sub !== "string" ||
      typeof p.email !== "string" ||
      typeof p.name !== "string" ||
      (role !== "admin" && role !== "staff" && role !== "customer")
    ) {
      return null;
    }
    return {
      userId: p.sub,
      email: p.email,
      name: p.name,
      role,
      customerId: typeof p.customerId === "string" ? p.customerId : null,
    };
  } catch {
    return null;
  }
}

// Cookie ki settings
export function sessionCookieOptions() {
  return {
    httpOnly: true, // JavaScript se cookie padh nahi sakte (XSS se bachav)
    sameSite: "lax" as const, // CSRF se basic bachav
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  };
}