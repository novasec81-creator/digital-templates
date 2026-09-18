import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { CART_COOKIE, parseCartCookie } from "@/lib/cart";
import { CheckoutFlow, type CheckoutLine } from "@/components/shop/CheckoutFlow";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Paiement" };

export default async function CheckoutPage() {
  const store = await cookies();
  const user = await getSessionUser();
  const cart = parseCartCookie(store.get(CART_COOKIE)?.value);

  if (cart.length === 0) redirect("/panier");

  const products = await prisma.product.findMany({
    where: { id: { in: cart.map((i) => i.productId) }, isActive: true },
  });

  const lines: CheckoutLine[] = products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    priceCents: p.priceCents,
    compareAtPriceCents: p.compareAtPriceCents,
    previewImages: p.previewImages,
  }));

  return (
    <CheckoutFlow initialEmail={user?.email ?? ""} lines={lines} />
  );
}