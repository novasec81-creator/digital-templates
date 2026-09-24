import Link from "next/link";
import type { DemoProduct } from "@/lib/demo-data";
import { PriceTag } from "@/components/ui/PriceTag";
import { RatingStars } from "@/components/ui/RatingStars";

export function ProductCard({ product }: { product: DemoProduct }) {
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className={`relative aspect-[4/3] overflow-hidden ${product.accent}`}>
        <div className="flex h-full items-center justify-center">
          <span className="text-5xl font-bold text-white/25 transition-transform duration-300 group-hover:scale-110">
            {product.title.charAt(0)}
          </span>
        </div>
        {product.isBundle && (
          <span className="absolute left-2 top-2 rounded bg-gray-900/80 px-2 py-0.5 text-xs font-semibold text-white">
            Pack
          </span>
        )}
        <span className="absolute bottom-2 right-2 rounded bg-black/30 px-2 py-0.5 text-xs font-medium text-white/90">
          {product.category.name}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-gray-500">{product.category.name}</p>
        <h3 className="mt-1 line-clamp-2 font-semibold text-gray-900">{product.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <RatingStars rating={avgRating} count={product.reviews.length} />
          <PriceTag priceCents={product.priceCents} compareAtPriceCents={product.compareAtPriceCents} />
        </div>
      </div>
    </Link>
  );
}