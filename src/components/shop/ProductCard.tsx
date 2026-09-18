import Link from "next/link";
import Image from "next/image";
import type { Product } from "@prisma/client";
import { PriceTag } from "@/components/ui/PriceTag";
import { RatingStars } from "@/components/ui/RatingStars";

type ProductWithMeta = Product & {
  category: { name: string; slug: string };
  reviews: { rating: number }[];
};

export function ProductCard({ product }: { product: ProductWithMeta }) {
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        {product.previewImages[0] ? (
          <Image
            src={product.previewImages[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">Aperçu</div>
        )}
        {product.isBundle && (
          <span className="absolute left-2 top-2 rounded bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">
            Pack
          </span>
        )}
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