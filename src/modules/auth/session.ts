import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "loopos_session";
const SESSION_HOURS = 8;

export type SessionPayload = {
  userId: string;
  email: string;
  role: "admin" | "staff" | "customer";
  customerId: string | null;
};

// Secret .env se aata hai. Chhota ya missing ho to turant error.
function getKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET missing hai ya 32 chars se chhota hai");
  }
  return new TextEncoder().encode(secret);
}

// Token banao: user ki info ko sign karke ek string bana deta hai
export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    customerId: payload.customerId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(getKey());
}

// Token check karo: sahi hai to payload, warna null
export async function verifySession(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  const key = getKey(); // try ke bahar, taaki config error chhup na jaye
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    const role = payload.role;
    if (
      !payload.sub ||
      typeof payload.email !== "string" ||
      (role !== "admin" && role !== "staff" && role !== "customer")
    ) {
      return null;
    }
    return {
      userId: payload.sub,
      email: payload.email,
      role,
      customerId:
        typeof payload.customerId === "string" ? payload.customerId : null,
    };
  } catch {
    return null; // expired ya tampered token
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