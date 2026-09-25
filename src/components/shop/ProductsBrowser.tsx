"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type { DemoCategory, DemoProduct } from "@/lib/demo-data";
import { ProductCard } from "@/components/shop/ProductCard";

const SORT_OPTIONS = [
  { value: "recommande", label: "Notre sélection" },
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
];

function readInit() {
  if (typeof window === "undefined") return { q: "", tri: "" };
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get("q") ?? "",
    tri: params.get("tri") ?? "",
  };
}

export function ProductsBrowser({
  products,
  categories,
}: {
  products: DemoProduct[];
  categories: DemoCategory[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("recommande");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const { q, tri } = readInit();
    // Lecture ponctuelle de l'URL au montage : acceptable ici.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q) setQuery(q);
    if (tri && SORT_OPTIONS.some((o) => o.value === tri)) setSort(tri);
    const hash = window.location.hash.replace("#", "");
    if (hash && categories.some((c) => c.slug === hash)) setCategory(hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace("#", "");
      setCategory(hash && categories.some((c) => c.slug === hash) ? hash : null);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [categories]);

  const hasActiveFilters =
    query.trim() !== "" || !!category || minPrice !== "" || maxPrice !== "" || sort !== "recommande";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice !== "" ? Number(minPrice) : null;
    const max = maxPrice !== "" ? Number(maxPrice) : null;

    let list = products.filter((p) => {
      if (category && p.category.slug !== category) return false;
      if (min !== null && p.priceCents < Math.round(min * 100)) return false;
      if (max !== null && p.priceCents > Math.round(max * 100)) return false;
      if (q) {
        const haystack =
          [p.title, p.tagline, p.description, p.category.name].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sort === "prix-asc") list = [...list].sort((a, b) => a.priceCents - b.priceCents);
    if (sort === "prix-desc") list = [...list].sort((a, b) => b.priceCents - a.priceCents);
    if (sort === "nouveautes") {
      list = [...list].sort(
        (a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false)
      );
    }
    return list;
  }, [products, query, category, sort, minPrice, maxPrice]);

  function resetAll() {
    setQuery("");
    setCategory(null);
    setSort("recommande");
    setMinPrice("");
    setMaxPrice("");
  }

  const chipClass = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-ink bg-ink text-paper"
        : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
    }`;

  return (
    <div className="mt-8">
      {/* Recherche + tri + résultat */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom, catégorie ou besoin…"
            aria-label="Rechercher dans le catalogue"
            className="h-11 w-full rounded-full border border-line bg-paper-2 pl-11 pr-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus:border-line-strong focus:bg-paper"
          />
        </div>
        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <p aria-live="polite" role="status" className="text-sm text-ink-3">
            {filtered.length} template{filtered.length > 1 ? "s" : ""}
          </p>
          <label className="flex items-center gap-2 text-sm text-ink-2">
            <span className="hidden sm:inline">Trier :</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Trier les templates"
              className="h-11 rounded-full border border-line bg-paper px-4 pr-8 text-sm font-medium text-ink transition-colors focus:border-line-strong"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Panneau filtres */}
      <div className="mt-6">
        <div className="flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
          >
            {filtersOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            )}
            Filtres
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAll}
              className="text-sm font-medium text-ink-3 transition-colors hover:text-ink"
            >
              Réinitialiser
            </button>
          )}
        </div>

        <div className={`mt-4 lg:mt-0 ${filtersOpen ? "block" : "hidden lg:block"}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={chipClass(!category)}
            >
              Tous
            </button>
            {categories.map((c) => {
              const count = products.filter((p) => p.category.slug === c.slug).length;
              const active = category === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCategory(active ? null : c.slug)}
                  className={chipClass(active)}
                >
                  {c.name} ({count})
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink-2">
              Prix min
              <span className="relative">
                <input
                  type="number"
                  min={0}
                  step={1}
                  inputMode="decimal"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  aria-label="Prix minimum en euros"
                  placeholder="0"
                  className="h-10 w-20 rounded-xl border border-line bg-paper px-3 pl-6 text-sm text-ink focus:border-line-strong"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-ink-3"
                >
                  €
                </span>
              </span>
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-2">
              max
              <span className="relative">
                <input
                  type="number"
                  min={0}
                  step={1}
                  inputMode="decimal"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  aria-label="Prix maximum en euros"
                  placeholder="100"
                  className="h-10 w-20 rounded-xl border border-line bg-paper px-3 pl-6 text-sm text-ink focus:border-line-strong"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-ink-3"
                >
                  €
                </span>
              </span>
            </label>
            <span className="hidden text-xs text-ink-3 sm:inline">
              en euros, hors frais
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-3 transition-colors hover:text-ink"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grille de résultats */}
      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-line-strong bg-paper-2 px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-ink">Aucun résultat trouvé</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-2">
            {query.trim()
              ? `Aucun template ne correspond à « ${query.trim()} ». Essayez un autre terme ou élargissez vos filtres.`
              : "Aucun template ne correspond à ces filtres. Essayez d'élargir votre recherche."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/produits")}
              className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-black"
            >
              Voir tous les templates
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}