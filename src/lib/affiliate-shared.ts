export const AFFILIATE_COOKIE = "aff";
export const AFFILIATE_CLICKED_COOKIE = "aff_clicked";
export const AFFILIATE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function isAffiliateCodeSafe(code: string): boolean {
  return /^[a-z0-9_-]{3,40}$/i.test(code);
}