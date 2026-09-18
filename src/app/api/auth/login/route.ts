import { NextRequest, NextResponse } from "next/server";
import { loginRequestSchema } from "@/lib/validations";
import { generateToken } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { sendLoginLink } from "@/lib/email";
import { createRateLimiter, clientIp, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const LOGIN_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  const limiter = createRateLimiter("AUTH");
  const { success } = await limiter(clientIp(req));
  if (!success) return rateLimitResponse();

  const parsed = loginRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  const { email, redirectTo } = parsed.data;

  // Rate-limit per-email in the DB too (5 requests / 15 min).
  const recent = await prisma.loginRequest.count({
    where: { email, createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) } },
  });
  if (recent >= 5) {
    return NextResponse.json(
      { error: "Trop de demandes pour cet email. Réessayez plus tard." },
      { status: 429 }
    );
  }

  const token = generateToken(32);
  await prisma.loginRequest.create({
    data: {
      email,
      token,
      expiresAt: new Date(Date.now() + LOGIN_TOKEN_TTL_MS),
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const magicUrl = `${appUrl}/api/auth/verify?token=${token}&redirectTo=${encodeURIComponent(
    redirectTo ?? "/mes-achats"
  )}`;

  try {
    await sendLoginLink(email, magicUrl);
  } catch {
    // Even if the email fails to send, keep the flow idempotent (dev mode logs).
    console.warn("[auth] unable to send login email, link:", magicUrl);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}