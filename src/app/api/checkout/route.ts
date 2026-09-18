import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { createCheckoutSession } from "@/lib/payments/checkout";
import { applyPromoCode } from "@/lib/payments/promo";
import { AFFILIATE_COOKIE } from "@/lib/affiliate";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const { email, items, promoCode } = parsed.data;

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, isActive: true },
  });

  const sqlIds = new Set(products.map((p) => p.id));
  const unknownItem = items.find((i) => !sqlIds.has(i.productId));
  if (unknownItem) {
    return NextResponse.json(
      { error: "Un produit de votre panier n'est plus disponible." },
      { status: 400 }
    );
  }

  const lines = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return {
      productId: product.id,
      title: product.title,
      priceCents: product.priceCents,
      quantity: item.quantity,
      image: product.previewImages[0] ?? undefined,
    };
  });

  const subtotal = lines.reduce((s, l) => s + l.priceCents * l.quantity, 0);

  const promo = await applyPromoCode(promoCode, subtotal);
  if (!promo.ok) {
    return NextResponse.json({ error: promo.error }, { status: 400 });
  }

  const store = await cookies();
  const affiliateCode = store.get(AFFILIATE_COOKIE)?.value ?? undefined;

  try {
    const session = await createCheckoutSession({
      email,
      lines,
      discountCents: promo.discountCents,
      promoCode: promo.code || undefined,
      affiliateCode,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] failed to create Stripe session", err);
    return NextResponse.json(
      { error: "Impossible de créer le paiement. Réessayez dans un instant." },
      { status: 500 }
    );
  }
}