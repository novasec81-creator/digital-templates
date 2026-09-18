import { price } from "@/lib/constants";

export function PriceTag({
  priceCents,
  compareAtPriceCents,
  className,
}: {
  priceCents: number;
  compareAtPriceCents?: number | null;
  className?: string;
}) {
  const hasDiscount = compareAtPriceCents && compareAtPriceCents > priceCents;

  return (
    <div className={className}>
      {hasDiscount && (
        <span className="mr-2 text-sm text-gray-400 line-through">
          {price(compareAtPriceCents!)}
        </span>
      )}
      <span className="font-semibold text-gray-900">{price(priceCents)}</span>
      {hasDiscount && (
        <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-700">
          -{Math.round(((compareAtPriceCents! - priceCents) / compareAtPriceCents!) * 100)}%
        </span>
      )}
    </div>
  );
}