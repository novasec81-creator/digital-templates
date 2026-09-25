"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Brand } from "@/components/brand/Brand";
import { DEMO_PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/demo-data";

function countFor(slug: string) {
  return DEMO_PRODUCTS.filter((p) => p.category.slug === slug).length;
}

function SearchField({
  onSubmit,
  autoFocus = false,
  className = "",
}: {
  onSubmit: (term: string) => void;
  autoFocus?: boolean;
  className?: string;
}) {
  const [value, setValue] = useState("");
  return (
    <form
      role="search"
      className={`relative ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Rechercher un template…"
        aria-label="Rechercher un template dans le catalogue"
        className="h-9 w-full rounded-full border border-line bg-paper-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-3 transition-colors focus:border-line-strong focus:bg-paper"
      />
    </form>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/produits" ? pathname.startsWith("/produits") : pathname === href;

  const goSearch = (term: string) => {
    const t = term.trim();
    setMenuOpen(false);
    router.push(t ? `/produits?q=${encodeURIComponent(t)}` : "/produits");
  };

  const navLinkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive(href) ? "text-ink" : "text-ink-2 hover:text-ink hover:bg-paper-2"
    }`;

  return (
    <header
      className={`sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "shadow-card" : ""
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Brand />

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          <Link href="/produits" className={navLinkClass("/produits")}>
            Templates
          </Link>

          <div className="group relative">
            <span className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-ink-2 transition-colors hover:text-ink hover:bg-paper-2">
              Catégories
              <ChevronDown
                aria-hidden="true"
                className="ml-1 h-3.5 w-3.5 text-ink-3 transition-transform duration-200 group-hover:rotate-180"
              />
            </span>
            <div className="absolute left-0 top-full mt-1 hidden w-72 rounded-2xl border border-line bg-paper p-1.5 shadow-float group-hover:block group-focus-within:block">
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                Par catégorie
              </p>
              {PRODUCT_CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/produits?categorie=${c.slug}`}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
                >
                  {c.name}
                  <span className="text-xs text-ink-3">{countFor(c.slug)}</span>
                </Link>
              ))}
            </div>
          </div>

          <Link href="/produits?tri=nouveautes" className={navLinkClass("/produits")}>
            Nouveautés
          </Link>
          <Link href="/a-propos" className={navLinkClass("/a-propos")}>
            À propos
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <SearchField onSubmit={goSearch} className="hidden w-44 md:block lg:w-60" />
          <Link
            href="/contact"
            className="hidden rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-black md:inline-flex"
          >
            Contact
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink transition-colors hover:bg-paper-2 lg:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-line bg-paper lg:hidden">
          <div className="mx-auto max-w-6xl space-y-5 px-4 py-5 sm:px-6">
            <SearchField
              onSubmit={goSearch}
              autoFocus
              className="max-w-none"
            />
            <nav aria-label="Menu mobile" className="grid gap-1">
              <Link
                href="/produits"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[15px] font-semibold text-ink hover:bg-paper-2"
              >
                Templates
              </Link>
              <Link
                href="/produits?tri=nouveautes"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[15px] font-semibold text-ink hover:bg-paper-2"
              >
                Nouveautés
              </Link>
              <Link
                href="/a-propos"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[15px] font-semibold text-ink hover:bg-paper-2"
              >
                À propos
              </Link>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[15px] font-semibold text-ink hover:bg-paper-2"
              >
                Contact
              </Link>
            </nav>
            <div>
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                Catégories
              </p>
              <ul className="mt-2 grid grid-cols-2 gap-1">
                {PRODUCT_CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/produits?categorie=${c.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-ink-2 hover:bg-paper-2 hover:text-ink"
                    >
                      {c.name}
                      <span className="text-xs text-ink-3">{countFor(c.slug)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}