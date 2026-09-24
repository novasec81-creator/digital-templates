"use client";

import { useMemo, useState } from "react";
import type { DemoCategory, DemoProduct } from "@/lib/demo-data";
import { ProductCard } from "@/components/shop/ProductCard";

const SORT_OPTIONS = [
  { value: "popularite", label: "Popularité" },
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
];

export function ProductsBrowser({
  products,
  categories,
}: {
  products: DemoProduct[];
  categories: DemoCategory[];
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("popularite");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    let list = products.filter((p) => {
      if (category && p.category.slug !== category) return false;
      if (min !== null && p.priceCents < min * 100) return false;
      if (max !== null && p.priceCents > max * 100) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "prix-asc":
          return a.priceCents - b.priceCents;
        case "prix-desc":
          return b.priceCents - a.priceCents;
        case "nouveautes":
          return String(b.id).localeCompare(String(a.id));
        default:
          return b.downloads - a.downloads;
      }
    });

    return list;
  }, [products, category, sort, minPrice, maxPrice]);

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`rounded-full border px-4 py-2 text-sm font-medium ${
            !category
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 text-gray-700 hover:border-gray-400"
          }`}
        >
          Tous
        </button>
        {categories.map((c) => {
          const count = products.filter((p) => p.category.slug === c.slug).length;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(category === c.slug ? null : c.slug)}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                category === c.slug
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 text-gray-700 hover:border-gray-400"
              }`}
            >
              {c.name} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            Prix min (€)
            <input
              type="number"
              min={0}
              step={0.5}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
              aria-label="Prix minimum"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            max
            <input
              type="number"
              min={0}
              step={0.5}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
              aria-label="Prix maximum"
            />
          </label>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          aria-label="Trier les produits"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Trier : {o.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-500">
          Aucun template ne correspond à ces filtres.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}