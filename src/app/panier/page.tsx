import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { CART_COOKIE, parseCartCookie } from "@/lib/cart";
import { CartContent, type CartLineProduct } from "@/components/shop/CartContent";

export const metadata: Metadata = { title: "Panier" };

export default async function CartPage() {
  const store = await cookies();
  const cart = parseCartCookie(store.get(CART_COOKIE)?.value);

  if (cart.length === 0) {
    return (
      <CartContent lines={[]} />
    );
  }

  const products = await prisma.product.findMany({
    where: { id: { in: cart.map((i) => i.productId) }, isActive: true },
  });

  if (products.length === 0) redirect("/produits");

  const lines: CartLineProduct[] = products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    priceCents: p.priceCents,
    compareAtPriceCents: p.compareAtPriceCents,
    previewImages: p.previewImages,
  }));

  return <CartContent lines={lines} />;
}