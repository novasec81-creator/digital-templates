"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type { DemoCategory, DemoProduct } from "@/lib/demo-data";
import { ProductCard } from "@/components/shop/ProductCard";

const SORT_OPTIONS = [
  { value: "recommande", label: "Notre sélection" },
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
] as const;

function parseEuro(value: string | null): string | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? String(Math.round(n)) : null;
}

/**
 * Catalogue interactif.
 *
 * Les critères (recherche, catégorie, tri, prix min/max) vivent dans l'URL :
 * `/produits?categorie=notion` reste partageable, et le retour arrière
 * restitue l'état précédent. Le tiroir de filtres mobile reste un état local
 * (`useState`) pour ne pas polluer les URL partagées avec un paramètre
 * d'interface.
 */
export function ProductsBrowser({
  products,
  categories,
}: {
  products: DemoProduct[];
  categories: DemoCategory[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const query = params.get("q") ?? "";
  const category = params.get("categorie") ?? "";
  const sort = SORT_OPTIONS.some((o) => o.value === params.get("tri"))
    ? (params.get("tri") as (typeof SORT_OPTIONS)[number]["value"])
    : "recommande";
  const minPrice = parseEuro(params.get("prix-min")) ?? "";
  const maxPrice = parseEuro(params.get("prix-max")) ?? "";

  const titleId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Migration : l'ancien lien /produits#<categorie> devient ?categorie=<slug>.
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && categories.some((c) => c.slug === hash)) {
      const next = new URLSearchParams(params.toString());
      next.set("categorie", hash);
      next.delete("q");
      next.delete("tri");
      next.delete("prix-min");
      next.delete("prix-max");
      router.replace(`/produits?${next.toString()}`, { scroll: false });
      window.history.replaceState(null, "", `${window.location.pathname}?${next}`);
    }
    // exécuté une seule fois au montage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams();
    const entries: Array<[string, string]> = [
      ["q", query],
      ["categorie", category],
      ["tri", params.get("tri") ?? ""],
      ["prix-min", minPrice],
      ["prix-max", maxPrice],
    ];
    for (const [key, value] of entries) {
      const patched = key in patch ? (patch[key] ?? "") : value;
      if (patched && patched !== "") next.set(key, patched);
    }
    const qs = next.toString();
    router.replace(qs ? `/produits?${qs}` : "/produits", { scroll: false });
  };

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of categories) {
      map.set(c.slug, products.filter((p) => p.category.slug === c.slug).length);
    }
    return map;
  }, [categories, products]);

  const activeFilters = [
    category ? categories.find((c) => c.slug === category)?.name ?? category : null,
    minPrice !== "" ? `dès ${minPrice} €` : null,
    maxPrice !== "" ? `jusqu'à ${maxPrice} €` : null,
  ].filter((v): v is string => Boolean(v));

  const hasActiveFilters =
    query.trim() !== "" ||
    category !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    sort !== "recommande";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice !== "" ? Number(minPrice) : null;
    const max = maxPrice !== "" ? Number(maxPrice) : null;

    let list = products.filter((p) => {
      if (category && p.category.slug !== category) return false;
      if (min !== null && p.priceCents < min * 100) return false;
      if (max !== null && p.priceCents > max * 100) return false;
      if (q) {
        const haystack = [
          p.title,
          p.tagline,
          p.description,
          p.category.name,
          p.category.slug,
          ...p.features,
          ...p.includes,
          ...p.forWhom,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sort === "prix-asc") list = [...list].sort((a, b) => a.priceCents - b.priceCents);
    if (sort === "prix-desc") list = [...list].sort((a, b) => b.priceCents - a.priceCents);
    if (sort === "nouveautes") {
      list = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    } else {
      list = [...list].sort(
        (a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false)
      );
    }
    return list;
  }, [products, query, category, sort, minPrice, maxPrice]);

  const resetAll = () => {
    router.replace("/produits", { scroll: false });
    setDrawerOpen(false);
  };

  /* --- Tiroir mobile : fermeture par Échap, focus enfermé, défilement bloqué --- */
  useEffect(() => {
    if (!drawerOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const root = drawerRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    drawerRef.current?.querySelector<HTMLElement>("button, input")?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen]);

  // Restitue le focus au bouton « Filtres » à la fermeture.
  useEffect(() => {
    if (!drawerOpen) triggerRef.current?.focus();
  }, [drawerOpen]);

  const chipClass = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-ink bg-ink text-paper"
        : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
    }`;

  const filters = (
    <>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
          Catégorie
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => updateParams({ categorie: null })}
            className={chipClass(!category)}
            aria-pressed={!category}
          >
            Tous ({products.length})
          </button>
          {categories.map((c) => {
            const active = category === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => updateParams({ categorie: active ? null : c.slug })}
                className={chipClass(active)}
                aria-pressed={active}
              >
                {c.name} ({counts.get(c.slug) ?? 0})
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-line pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
          Budget
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-ink-2">
            <span className="sr-only sm:not-sr-only">Prix min</span>
            <span className="relative">
              <input
                type="number"
                min={0}
                step={1}
                inputMode="decimal"
                value={minPrice}
                onChange={(e) => updateParams({ "prix-min": e.target.value })}
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
            <span className="sr-only sm:not-sr-only">max</span>
            <span className="relative">
              <input
                type="number"
                min={0}
                step={1}
                inputMode="decimal"
                value={maxPrice}
                onChange={(e) => updateParams({ "prix-max": e.target.value })}
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
          <span className="text-xs text-ink-3">en euros, hors frais</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="mt-8">
      {/* Recherche + compteur + tri */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => updateParams({ q: e.target.value })}
            placeholder="Rechercher par nom, catégorie ou besoin…"
            aria-label="Rechercher dans le catalogue"
            className="h-11 w-full rounded-full border border-line bg-paper-2 pl-11 pr-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus:border-line-strong focus:bg-paper"
          />
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="catalogue-filtres"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper-2 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filtres
            {activeFilters.length > 0 && (
              <span className="ml-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1.5 text-[11px] font-bold text-paper">
                {activeFilters.length}
              </span>
            )}
          </button>

          <p aria-live="polite" role="status" className="text-sm text-ink-3">
            {filtered.length} template{filtered.length > 1 ? "s" : ""}
          </p>

          <label className="flex items-center gap-2 text-sm text-ink-2">
            <span className="hidden sm:inline">Trier :</span>
            <select
              value={sort}
              onChange={(e) => updateParams({ tri: e.target.value })}
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

      {/* Filtres actifs, partageables et supprimables un par un */}
      {activeFilters.length > 0 && (
        <ul className="mt-5 flex flex-wrap items-center gap-2">
          {activeFilters.map((label) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => {
                  if (category && label === categories.find((c) => c.slug === category)?.name) {
                    updateParams({ categorie: null });
                  } else if (label.startsWith("dès")) {
                    updateParams({ "prix-min": null });
                  } else if (label.startsWith("jusqu'à")) {
                    updateParams({ "prix-max": null });
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[13px] font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
              >
                {label}
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Retirer ce filtre</span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-3 transition-colors hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Tout effacer
            </button>
          </li>
        </ul>
      )}

      {/* Filtres desktop */}
      <div className="mt-6 hidden lg:block">{filters}</div>

      {/* Tiroir de filtres mobile */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            aria-label="Fermer les filtres"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div
            ref={drawerRef}
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-line bg-paper p-6 pb-8 shadow-float"
          >
            <div className="flex items-center justify-between gap-4">
              <h2
                id={titleId}
                className="text-lg font-bold tracking-tight text-ink"
              >
                Filtres
              </h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Fermer les filtres"
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6">{filters}</div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-full rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-black"
              >
                Voir {filtered.length} template{filtered.length > 1 ? "s" : ""}
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="w-full rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Résultats */}
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
              onClick={resetAll}
              className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-black"
            >
              Voir tous les templates
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
            >
              Demander un template
            </Link>
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