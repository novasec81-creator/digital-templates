import Link from "next/link";
import { ArrowRight, Check, Boxes } from "lucide-react";
import {
  bundleSeparateTotal,
  resolveBundleMembers,
  type DemoBundle,
} from "@/lib/demo-data";
import { price } from "@/lib/constants";
import { bundleOrderHref } from "@/lib/purchase";

/**
 * Carte dédiée aux packs : liste des ressources incluses, prix séparé réel
 * (somme des produits du catalogue) et économie calculée, sans pourcentage
 * marketing. Le lien de commande vient du module centralisé `purchase.ts`.
 */
export function BundleCard({
  bundle,
  showMembers = true,
}: {
  bundle: DemoBundle;
  /** `false` pour les versions compactes (grilles serrées). */
  showMembers?: boolean;
}) {
  const members = resolveBundleMembers(bundle);
  const separateTotal = bundleSeparateTotal(bundle);
  const savings = separateTotal - bundle.packPriceCents;

  return (
    <article className="flex flex-col rounded-2xl border border-line bg-paper p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-paper-2 text-ink">
          <Boxes className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="rounded-full bg-clay-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-clay">
          Pack
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold tracking-tight text-ink">
        {bundle.title}
      </h3>
      <p className="mt-1 text-[13px] text-ink-2">{bundle.tagline}</p>

      {showMembers && (
        <ul className="mt-5 space-y-2.5">
          {members.map((m) => (
            <li key={m.id} className="flex items-center gap-2.5 text-sm text-ink-2">
              <Check className="h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
              <span className="line-clamp-1">
                <Link
                  href={`/produits/${m.slug}`}
                  className="transition-colors hover:text-clay"
                >
                  {m.title}
                </Link>
                <span className="text-ink-3"> · {m.category.name}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex items-end justify-between gap-3 border-t border-line pt-5">
        <div>
          <p className="text-xs text-ink-3">
            {members.length} ressources séparément :{" "}
            <span className="line-through">{price(separateTotal)}</span>
          </p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
            {price(bundle.packPriceCents)}
          </p>
          {savings > 0 && (
            <p className="mt-1 text-xs font-semibold text-clay">
              Économie de {price(savings)}
            </p>
          )}
        </div>
        <Link
          href={bundleOrderHref(bundle)}
          aria-label={`Commander le pack ${bundle.title} — ${price(bundle.packPriceCents)}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-black"
        >
          Commander
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}