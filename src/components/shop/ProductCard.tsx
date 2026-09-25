import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { DemoProduct } from "@/lib/demo-data";
import { ProductVisual } from "@/components/shop/ProductVisual";
import { price } from "@/lib/constants";

/**
 * Carte produit premium, réutilisable dans toutes les grilles.
 * Le visuel est un motif de type (cf. ProductVisual) tant qu'aucune
 * capture réelle n'est fournie dans `product.images`.
 */
export function ProductCard({ product }: { product: DemoProduct }) {
  const discount =
    product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents
      ? Math.round(
          ((product.compareAtPriceCents - product.priceCents) /
            product.compareAtPriceCents) *
            100
        )
      : null;

  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ProductVisual
          accent={product.accent}
          visual={product.visual}
          label={product.category.name}
          className="h-full w-full"
        />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.isBundle && (
            <span className="rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-paper backdrop-blur-sm">
              Pack
            </span>
          )}
          {product.isNew && !product.isBundle && (
            <span className="rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur-sm">
              Nouveau
            </span>
          )}
        </div>
        {discount && (
          <span className="absolute right-3 top-3 rounded-full bg-clay px-2.5 py-1 text-[11px] font-bold text-paper">
            −{discount} %
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-ink">
          {product.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-[13px] text-ink-2">{product.tagline}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="flex items-baseline gap-2">
            {discount && (
              <span className="text-xs text-ink-3 line-through">
                {price(product.compareAtPriceCents!)}
              </span>
            )}
            <span className="text-base font-bold text-ink">
              {price(product.priceCents)}
            </span>
          </p>
          <span
            aria-hidden="true"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors duration-200 group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}