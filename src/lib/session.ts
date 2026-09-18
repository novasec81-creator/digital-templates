import { SignJWT, jwtVerify } from "jose";

export interface SessionPayload {
  userId: string;
  email: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set to a value >= 32 chars in production");
    }
    // Deterministic dev-only fallback so the app runs without env config.
    return new TextEncoder().encode("dev-only-session-secret-please-change-me-!!");
  }
  return new TextEncoder().encode(secret);
}

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (!payload.userId || !payload.email) return null;
    return { userId: String(payload.userId), email: String(payload.email) };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE, SESSION_MAX_AGE };