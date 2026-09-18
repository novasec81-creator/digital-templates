import { NextRequest, NextResponse } from "next/server";

export const RATE_LIMIT = {
  DOWNLOAD: { limit: 20, windowSeconds: 60 },
  REVIEW: { limit: 10, windowSeconds: 60 },
  PROMO: { limit: 10, windowSeconds: 60 },
  AUTH: { limit: 5, windowSeconds: 300 },
  CONTACT: { limit: 3, windowSeconds: 300 },
};

/**
 * Rate limiter. Uses Upstash Redis when configured, otherwise falls back to a
 * per-process in-memory limiter (fine for development, Vercel serverless needs
 * Upstash to be shared across function instances).
 */
export function createRateLimiter(scope: keyof typeof RATE_LIMIT) {
  const { limit, windowSeconds } = RATE_LIMIT[scope];

  const hasUpstash = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );

  return async function rateLimit(identifier: string) {
    if (hasUpstash) {
      try {
        const { Ratelimit } = await import("@upstash/ratelimit");
        const { Redis } = await import("@upstash/redis");
        const redis = Redis.fromEnv();
        const limiter = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
          prefix: `ratelimit:${scope}`,
        });
        return await limiter.limit(identifier);
      } catch {
        // fall through to in-memory limiter
      }
    }
    return inMemory(scope, identifier, limit, windowSeconds);
  };
}

const buckets = new Map<string, { count: number; resetAt: number }>();

function inMemory(
  scope: string,
  identifier: string,
  limit: number,
  windowSeconds: number
): { success: boolean; remaining: number } {
  const now = Date.now();
  const key = `${scope}:${identifier}`;
  const current = buckets.get(key);
  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { success: true, remaining: limit - 1 };
  }
  if (current.count >= limit) {
    return { success: false, remaining: 0 };
  }
  current.count += 1;
  return { success: true, remaining: limit - current.count };
}

export function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { error: "Trop de requêtes. Réessayez dans un moment." },
    { status: 429 }
  );
}