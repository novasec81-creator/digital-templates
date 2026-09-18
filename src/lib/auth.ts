import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import {
  createSessionToken,
  verifySessionToken,
  SESSION_COOKIE,
} from "@/lib/session";

export type AuthedUser = { id: string; email: string };

/** Returns the current user from the session cookie, or null. */
export async function getSessionUser(): Promise<AuthedUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true },
  });
  return user ? { id: user.id, email: user.email } : null;
}

/** Creates a session cookie for a user id. Set via Set-Cookie header. */
export async function buildSessionCookie(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  const token = await createSessionToken({ userId: user.id, email: user.email });
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}; ${
    process.env.NODE_ENV === "production" ? "Secure; " : ""
  }`;
}