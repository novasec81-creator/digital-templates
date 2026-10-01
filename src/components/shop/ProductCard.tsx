import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { DemoProduct } from "@/lib/demo-data";
import { getCoverImage, getHoverImage } from "@/lib/demo-data";
import { ProductVisual, productVisualAlt } from "@/components/shop/ProductVisual";
import { price } from "@/lib/constants";
import { getDiscountPercent } from "@/lib/utils";

/**
 * Carte produit, utilisée dans toutes les grilles (accueil, catalogue,
 * fiches, recommandations).
 *
 * Règles de présentation :
 * - la première vraie capture remplace l'illustration ; sinon le visuel
 *   illustratif de la catégorie est affiché ;
 * - la deuxième image (si elle existe) apparaît au survol sur desktop, en
 *   fondu ; rien ne dépend du survol sur mobile ni au clavier ;
 * - toute la carte est cliquable, avec un lien explicite et un `aria-label`
 *   complet pour les lecteurs d'écran.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: DemoProduct;
  /** `true` pour les cartes visibles sans défilement (LCP). */
  priority?: boolean;
}) {
  const discount = getDiscountPercent(
    product.priceCents,
    product.compareAtPriceCents
  );
  const cover = getCoverImage(product);
  const hover = getHoverImage(product);

  return (
    <Link
      href={`/produits/${product.slug}`}
      aria-label={`${product.title} — ${price(product.priceCents)}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
        {cover ? (
          <>
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              priority={priority}
              loading={priority ? undefined : "lazy"}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 25vw"
              className="object-cover"
            />
            {/* Seconde capture au survol : purement décorative, desktop uniquement. */}
            {hover && (
              <Image
                src={hover.src}
                alt=""
                aria-hidden="true"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 0px, 25vw"
                className="hidden object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block"
              />
            )}
          </>
        ) : (
          <ProductVisual
            visual={product.visual}
            compact
            className="h-full w-full transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.isBundle && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-paper">
              Pack
            </span>
          )}
          {product.isNew && !product.isBundle && (
            <span className="rounded-full border border-line bg-paper/95 px-2.5 py-1 text-[11px] font-semibold text-ink">
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
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
          {product.category.name}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-semibold leading-snug text-ink">
          {product.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-2">
          {product.tagline}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
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
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink-3 transition-colors duration-200 group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        {/* Repli textuel : garantit un nom et un prix même sans visuel. */}
        <span className="sr-only">{cover ? "" : productVisualAlt(product.visual)}</span>
      </div>
    </Link>
  );
}