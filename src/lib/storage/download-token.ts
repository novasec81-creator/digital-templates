import { prisma } from "@/lib/db";
import { generateToken } from "@/lib/utils";
import { createPresignedDownloadUrl } from "@/lib/storage/s3";

export const DOWNLOAD_TOKEN_TTL_HOURS = 72;
export const MAX_DOWNLOADS = 5;

/** Pure helpers (unit-tested, no I/O). */

export function isTokenExpired(expiresAt: Date, now: Date = new Date()): boolean {
  return expiresAt.getTime() < now.getTime();
}

export function computeRemaining(maxDownloads: number, downloadCount: number): number {
  return Math.max(0, maxDownloads - downloadCount);
}

export function canDownload(
  downloadCount: number,
  maxDownloads: number,
  expiresAt: Date,
  now: Date = new Date()
): boolean {
  return !isTokenExpired(expiresAt, now) && computeRemaining(maxDownloads, downloadCount) > 0;
}

/**
 * Creates one download token per order item after a successful payment.
 * Each token is random, time-limited (72h) and max-limited (5 downloads).
 */
export async function createDownloadTokensForOrder(
  orderId: string
): Promise<{ orderItemId: string; token: string; expiresAt: Date }[]> {
  const items = await prisma.orderItem.findMany({
    where: { orderId },
    orderBy: { id: "asc" },
  });

  const tokens: { orderItemId: string; token: string; expiresAt: Date }[] = [];
  for (const item of items) {
    const token = generateToken(32);
    const expiresAt = new Date(Date.now() + DOWNLOAD_TOKEN_TTL_HOURS * 3600 * 1000);
    await prisma.downloadToken.create({
      data: { orderItemId: item.id, token, expiresAt },
    });
    tokens.push({ orderItemId: item.id, token, expiresAt });
  }
  return tokens;
}

export type TokenValidation =
  | { ok: true; redirectUrl: string; remaining: number }
  | { ok: false; reason: "not_found" | "expired" | "exhausted"; remaining?: number };

/**
 * Validates a download token, increments usage atomically and returns a
 * short-lived presigned URL to the file.
 */
export async function consumeDownloadToken(
  token: string,
  meta: { ip?: string; userAgent?: string }
): Promise<TokenValidation> {
  const found = await prisma.downloadToken.findUnique({
    where: { token },
    include: {
      orderItem: {
        include: { order: { select: { status: true } }, product: true },
      },
    },
  });

  if (!found) return { ok: false, reason: "not_found" };
  if (found.orderItem.order.status !== "PAID")
    return { ok: false, reason: "not_found" };
  if (found.expiresAt.getTime() < Date.now())
    return { ok: false, reason: "expired", remaining: 0 };

  const remaining = found.maxDownloads - found.downloadCount;
  if (remaining <= 0)
    return { ok: false, reason: "exhausted", remaining: 0 };

  const updated = await prisma.$transaction(async (tx) => {
    const fresh = await tx.downloadToken.update({
      where: { token },
      data: {
        downloadCount: { increment: 1 },
        lastDownloadAt: new Date(),
      },
    });
    await tx.downloadLog.create({
      data: {
        tokenId: fresh.id,
        ip: meta.ip?.slice(0, 45) ?? null,
        userAgent: meta.userAgent?.slice(0, 300) ?? null,
      },
    });
    return fresh;
  });

  const redirectUrl = await createPresignedDownloadUrl(
    found.orderItem.product.fileKey
  );

  return {
    ok: true,
    redirectUrl,
    remaining: updated.maxDownloads - updated.downloadCount,
  };
}

/** Tokens available for direct download (account area, no time limit). */
export async function getActiveTokensForOrder(orderId: string) {
  return prisma.downloadToken.findMany({
    where: { orderItem: { orderId }, expiresAt: { gt: new Date() } },
    include: { orderItem: { include: { product: true } } },
  });
}