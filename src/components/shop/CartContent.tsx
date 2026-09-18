"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { PriceTag } from "@/components/ui/PriceTag";
import { price } from "@/lib/constants";
import { trackClient } from "@/lib/analytics";

export type CartLineProduct = {
  id: string;
  title: string;
  slug: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
  previewImages: string[];
};

export function CartContent({ lines }: { lines: CartLineProduct[] }) {
  const { items, setQuantity, removeItem, clear } = useCart();

  const detailed = items
    .map((item) => {
      const product = lines.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotal = detailed.reduce((sum, d) => sum + d.product.priceCents * d.quantity, 0);

  if (detailed.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Votre panier est vide</h1>
        <p className="mt-2 text-gray-600">Parcourez la boutique et trouvez votre prochain template.</p>
        <Link
          href="/produits"
          className="mt-6 inline-block rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Voir les templates
        </Link>
      </div>
    );
  }

  function beginCheckout() {
    trackClient("begin_checkout", {
      items: detailed.map((d) => ({
        item_id: d.product.id,
        item_name: d.product.title,
        quantity: d.quantity,
        price: d.product.priceCents / 100,
      })),
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Panier</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-4">
          {detailed.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-4 rounded-xl border border-gray-200 p-4">
              <Link href={`/produits/${product.slug}`} className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-md bg-gray-100">
                {product.previewImages[0] ? (
                  <Image src={product.previewImages[0]} alt={product.title} fill sizes="96px" className="object-cover" />
                ) : null}
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/produits/${product.slug}`} className="font-medium text-gray-900 hover:underline">
                      {product.title}
                    </Link>
                    <PriceTag
                      priceCents={product.priceCents}
                      compareAtPriceCents={product.compareAtPriceCents}
                      className="mt-1 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(product.id);
                      trackClient("remove_from_cart", { item_id: product.id });
                    }}
                    aria-label={`Retirer ${product.title} du panier`}
                    className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(product.id, quantity - 1)}
                    aria-label="Diminuer la quantité"
                    className="rounded-md border border-gray-300 p-1.5 hover:bg-gray-50"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(product.id, quantity + 1)}
                    aria-label="Augmenter la quantité"
                    className="rounded-md border border-gray-300 p-1.5 hover:bg-gray-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold">Résumé</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Sous-total</dt>
              <dd className="font-medium">{price(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">TVA</dt>
              <dd className="font-medium">Incluse</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{price(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={beginCheckout}
            className="mt-6 block w-full rounded-md bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-gray-800"
          >
            Passer au paiement
          </Link>
          <button
            type="button"
            onClick={() => {
              clear();
              trackClient("remove_from_cart", { cleared: true });
            }}
            className="mt-3 w-full rounded-md px-4 py-2 text-sm text-gray-500 hover:text-red-600"
          >
            Vider le panier
          </button>
        </aside>
      </div>
    </div>
  );
}