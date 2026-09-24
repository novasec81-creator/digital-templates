import { prisma } from "@/lib/db";

export {
  AFFILIATE_COOKIE,
  AFFILIATE_CLICKED_COOKIE,
  AFFILIATE_TTL_SECONDS,
  isAffiliateCodeSafe,
} from "./affiliate-shared";

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