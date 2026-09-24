import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Tous les templates",
  description:
    "Tous nos templates numériques : Notion, Excel/Google Sheets, presets Lightroom, Canva, CV.",
};

export const dynamic = "force-dynamic";

const SORT_OPTIONS = [
  { value: "popularite", label: "Popularité" },
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
];

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; tri?: string; min?: string; max?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.categorie;
  const sort = params.tri ?? "popularite";
  const minPrice = params.min ? Number(params.min) : null;
  const maxPrice = params.max ? Number(params.max) : null;

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { products: { where: { isActive: true }, select: { id: true } } },
  });

  const priceFilter: { gte?: number; lte?: number } = {};
  if (minPrice !== null) priceFilter.gte = minPrice * 100;
  if (maxPrice !== null) priceFilter.lte = maxPrice * 100;

  const where: Record<string, unknown> = { isActive: true };
  if (activeCategory) {
    const cat = await prisma.category.findUnique({
      where: { slug: activeCategory },
      select: { id: true },
    });
    if (cat) where.categoryId = cat.id;
  }
  if (priceFilter.gte !== undefined || priceFilter.lte !== undefined) {
    where.priceCents = priceFilter;
  }

  const orderBy =
    sort === "prix-asc"
      ? { priceCents: "asc" as const }
      : sort === "prix-desc"
        ? { priceCents: "desc" as const }
        : sort === "nouveautes"
          ? { createdAt: "desc" as const }
          : { downloadCount: "desc" as const };

  const products = await prisma.product.findMany({
    where,
    include: { category: true, reviews: { where: { isApproved: true }, select: { rating: true } } },
    orderBy,
  });

  const activeCount = categories.find((c) => c.slug === activeCategory)?.products.length ?? products.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
      <p className="mt-2 text-gray-600">
        {activeCount} template{activeCount > 1 ? "s" : ""} disponibles — téléchargement immédiat.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link
          href="/produits"
          className={`rounded-full border px-4 py-2 text-sm font-medium ${
            !activeCategory
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 text-gray-700 hover:border-gray-400"
          }`}
        >
          Tous
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={c.slug === activeCategory ? "/produits" : `/produits?categorie=${c.slug}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              c.slug === activeCategory
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 text-gray-700 hover:border-gray-400"
            }`}
          >
            {c.name} ({c.products.length})
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <form action="/produits" method="get" className="flex flex-wrap items-center gap-3">
          {activeCategory && <input type="hidden" name="categorie" value={activeCategory} />}
          <label className="flex items-center gap-2 text-sm text-gray-600">
            Prix min (€)
            <input
              type="number"
              name="min"
              min={0}
              step={0.5}
              defaultValue={minPrice ?? ""}
              className="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
              aria-label="Prix minimum"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            max
            <input
              type="number"
              name="max"
              min={0}
              step={0.5}
              defaultValue={maxPrice ?? ""}
              className="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
              aria-label="Prix maximum"
            />
          </label>
          <select
            name="tri"
            defaultValue={sort}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            aria-label="Trier les produits"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                Trier : {o.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Filtrer
          </button>
        </form>
      </div>

      {products.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-500">
          Aucun template ne correspond à ces filtres.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}