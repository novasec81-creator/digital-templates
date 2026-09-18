import { prisma } from "@/lib/db";

export const AFFILIATE_COOKIE = "aff";
export const AFFILIATE_CLICKED_COOKIE = "aff_clicked";
export const AFFILIATE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * Records a click on an affiliate link, at most once per visitor (guarded by a
 * separate cookie so the counter is not inflated by page refreshes).
 */
export async function recordAffiliateClick(
  code: string,
  options: { alreadyClicked: boolean; ip?: string }
): Promise<boolean> {
  if (options.alreadyClicked) return false;
  const result = await prisma.affiliateLink
    .update({
      where: { code },
      data: { clicks: { increment: 1 } },
    })
    .catch(() => null);
  if (!result) return false;
  console.log(`[affiliate] click recorded for "${code}"`);
  return true;
}

export function isAffiliateCodeSafe(code: string): boolean {
  return /^[a-z0-9_-]{3,40}$/i.test(code);
}