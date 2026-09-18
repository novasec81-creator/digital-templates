import { prisma } from "@/lib/db";

export type PromoResult =
  | { ok: true; code: string; percent: number | null; discountCents: number }
  | { ok: false; error: string };

/** Pure discount computation (unit-tested, no I/O). */
export function computePromoDiscount(
  subtotalCents: number,
  percent: number | null,
  discountCents: number | null
): number {
  if (discountCents === null && percent === null) return 0;
  const value =
    discountCents !== null
      ? discountCents
      : Math.round((subtotalCents * (percent ?? 0)) / 100);
  return Math.max(0, Math.min(value, subtotalCents));
}

/**
 * Resolves a promo code against a subtotal. Discount is either a percentage or
 * a fixed amount in cents, whichever the code was created with.
 */
export async function applyPromoCode(
  code: string | null | undefined,
  subtotalCents: number
): Promise<PromoResult> {
  if (!code) return { ok: true, code: "", percent: null, discountCents: 0 };
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { ok: true, code: "", percent: null, discountCents: 0 };

  const promo = await prisma.promoCode.findUnique({ where: { code: normalized } });
  if (!promo || !promo.isActive) return { ok: false, error: "Ce code promo n'existe pas." };
  if (promo.expiresAt && promo.expiresAt.getTime() < Date.now())
    return { ok: false, error: "Ce code promo a expiré." };
  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses)
    return { ok: false, error: "Ce code promo a déjà atteint son nombre d'utilisations." };

  const discountCents = computePromoDiscount(subtotalCents, promo.discountPercent, promo.discountCents);

  return {
    ok: true,
    code: normalized,
    percent: promo.discountPercent,
    discountCents: Math.min(discountCents, subtotalCents),
  };
}