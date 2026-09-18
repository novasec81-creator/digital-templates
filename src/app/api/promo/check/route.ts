import { NextRequest, NextResponse } from "next/server";
import { promoCheckSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { applyPromoCode } from "@/lib/payments/promo";
import { createRateLimiter, clientIp, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const limiter = createRateLimiter("PROMO");
  const { success } = await limiter(clientIp(req));
  if (!success) return rateLimitResponse();

  const parsed = promoCheckSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: parsed.data.cart.map((i) => i.productId) }, isActive: true },
  });
  const subtotal = products.reduce((s, p) => {
    const line = parsed.data.cart.find((i) => i.productId === p.id);
    return s + p.priceCents * (line?.quantity ?? 1);
  }, 0);

  const result = await applyPromoCode(parsed.data.code, subtotal);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, discountCents: result.discountCents, percent: result.percent });
}