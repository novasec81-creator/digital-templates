"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

export function CartBadge() {
  const { count } = useCart();

  return (
    <Link
      href="/panier"
      aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
      className="relative inline-flex items-center rounded-md p-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}