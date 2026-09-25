import Link from "next/link";
import { ArrowUpRight, LayoutGrid, Table2, Layers, Image, FileText } from "lucide-react";
import type { DemoCategory } from "@/lib/demo-data";

const VISUAL_ICONS = {
  notion: LayoutGrid,
  excel: Table2,
  canva: Layers,
  lightroom: Image,
  cv: FileText,
} as const;

export function CategoryCard({
  category,
  count,
}: {
  category: DemoCategory;
  count: number;
}) {
  const Icon = VISUAL_ICONS[category.visual];

  return (
    <Link
      href={`/produits#${category.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-paper p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-card-hover"
    >
      <div className="flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-paper-2 text-ink transition-colors duration-200 group-hover:bg-paper-3">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="h-5 w-5 text-ink-3 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
        />
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
          {category.tagline}
        </p>
        <h3 className="mt-1 text-lg font-bold tracking-tight text-ink">
          {category.name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
          {category.blurb}
        </p>
      </div>

      <p className="mt-auto pt-5 text-xs font-medium text-ink-3">
        {count} template{count > 1 ? "s" : ""} · découvrir →
      </p>
    </Link>
  );
}