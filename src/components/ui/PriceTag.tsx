import { price } from "@/lib/constants";
import { getDiscountPercent } from "@/lib/utils";

/**
 * Affichage prix + prix barré + réduction.
 * Le pourcentage est toujours dérivé des prix par getDiscountPercent,
 * comme sur les cartes produit (aucune incohérence possible).
 */
export function PriceTag({
  priceCents,
  compareAtPriceCents,
  className,
}: {
  priceCents: number;
  compareAtPriceCents?: number | null;
  className?: string;
}) {
  const discount = getDiscountPercent(priceCents, compareAtPriceCents);

  return (
    <div className={className}>
      <span className="text-3xl font-extrabold tracking-tight text-ink">
        {price(priceCents)}
      </span>
      {discount && (
        <>
          <span className="ml-3 text-sm text-ink-3 line-through">
            {price(compareAtPriceCents!)}
          </span>
          <span className="ml-2 inline-block rounded-full bg-clay-soft px-2 py-0.5 text-xs font-bold text-clay">
            −{discount} %
          </span>
        </>
      )}
    </div>
  );
}