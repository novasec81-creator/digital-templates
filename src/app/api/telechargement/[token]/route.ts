import { NextRequest, NextResponse } from "next/server";
import { consumeDownloadToken } from "@/lib/storage/download-token";
import { createRateLimiter, clientIp, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Public download endpoint. The token is random and stored in the DB; it
 * expires after 72h or MAX_DOWNLOADS uses. Rate-limited to 20 req/min/IP.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const limiter = createRateLimiter("DOWNLOAD");
  const { success } = await limiter(clientIp(req));
  if (!success) return rateLimitResponse();

  const { token } = await params;
  if (!token || token.length < 32) {
    return NextResponse.json({ error: "Lien invalide." }, { status: 404 });
  }

  const result = await consumeDownloadToken(token, {
    ip: clientIp(req),
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  if (!result.ok) {
    const titles: Record<string, string> = {
      not_found: "Ce lien de téléchargement est invalide.",
      expired: "Ce lien de téléchargement a expiré (72 heures).",
      exhausted: "Ce lien a atteint le nombre maximal de téléchargements.",
    };
    return NextResponse.json({ error: titles[result.reason] }, { status: 403 });
  }

  return NextResponse.redirect(result.redirectUrl, { status: 302 });
}