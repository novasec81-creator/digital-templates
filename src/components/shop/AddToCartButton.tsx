"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { trackClient } from "@/lib/analytics";

export function AddToCartButton({
  productId,
  title,
  priceCents,
  full,
}: {
  productId: string;
  title: string;
  priceCents: number;
  full?: boolean;
}) {
  const { addItem, hasItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(productId, 1);
    setAdded(true);
    trackClient("buy_clicked", { product_id: productId, title, price: priceCents });
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={hasItem(productId)}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed ${
        added || hasItem(productId)
          ? "bg-green-600 text-white"
          : full
            ? "w-full bg-gray-900 text-white hover:bg-gray-800"
            : "bg-gray-900 text-white hover:bg-gray-800"
      }`}
    >
      {added || hasItem(productId) ? (
        <>
          <Check className="h-4 w-4" /> Dans le panier
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" /> Ajouter au panier
        </>
      )}
    </button>
  );
}