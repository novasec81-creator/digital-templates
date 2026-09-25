"use client";

import { useState } from "react";
import Image from "next/image";
import type { DemoProduct } from "@/lib/demo-data";
import { ProductVisual } from "@/components/shop/ProductVisual";

/**
 * Galerie produit. Dès que `product.images` contient de vraies captures,
 * elles s'affichent avec miniatures cliquables. Sinon, un visuel
 * illustratif de type est montré (aucune fausse capture n'est générée).
 */
export function ProductGallery({ product }: { product: DemoProduct }) {
  const [active, setActive] = useState(0);
  const hasImages = product.images.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line shadow-card">
        {hasImages ? (
          <Image
            src={product.images[active]}
            alt={`${product.title} — capture ${active + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
          />
        ) : (
          <ProductVisual
            accent={product.accent}
            visual={product.visual}
            label={`${product.category.name} — aperçu illustratif`}
            className="h-full w-full"
          />
        )}
      </div>

      {hasImages && product.images.length > 1 && (
        <div className="flex gap-2" role="group" aria-label="Miniatures de la galerie">
          {product.images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Capture ${i + 1}`}
              aria-current={active === i}
              className={`relative h-16 w-20 overflow-hidden rounded-lg border transition-colors ${
                active === i
                  ? "border-clay"
                  : "border-line opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {!hasImages && (
        <p className="text-xs text-ink-3">
          Aperçu illustratif du produit — les captures réelles seront ajoutées
          ici dans une prochaine version.
        </p>
      )}
    </div>
  );
}