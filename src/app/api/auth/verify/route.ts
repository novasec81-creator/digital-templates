import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Magic-link verification. GET because the token travels in the email link.
 * Sets the session cookie (HttpOnly, SameSite=Lax, Secure in production) and
 * redirects the user to their account page.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const redirectToRaw = req.nextUrl.searchParams.get("redirectTo") ?? "/mes-achats";

  if (!token || token.length !== 64) {
    return NextResponse.json({ error: "Lien invalide." }, { status: 400 });
  }

  const request = await prisma.loginRequest.findUnique({ where: { token } });
  if (!request || request.used || request.expiresAt.getTime() < Date.now()) {
    return NextResponse.json(
      { error: "Ce lien est expiré ou a déjà été utilisé." },
      { status: 403 }
    );
  }

  await prisma.loginRequest.update({ where: { id: request.id }, data: { used: true } });

  const user = await prisma.user.upsert({
    where: { email: request.email },
    update: {},
    create: { email: request.email },
  });

  const sessionCookie = await buildSessionCookie(user.id);

  // Redirect only to internal paths to avoid open-redirect abuse.
  const safePath = redirectToRaw.startsWith("/") && !redirectToRaw.startsWith("//") ? redirectToRaw : "/mes-achats";

  const response = NextResponse.redirect(new URL(safePath, req.url));
  response.headers.set("Set-Cookie", sessionCookie);
  return response;
}