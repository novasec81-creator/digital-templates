import { defaultProductMeta, type ProductVisual } from "@/lib/demo-data";

/**
 * Visuel illustratif d'un produit.
 *
 * Tant qu'aucune vraie capture n'est fournie (champ `images` du produit),
 * on affiche un motif graphique propre par type de ressource. Il s'agit
 * volontairement d'une illustration de type, pas d'une fausse capture.
 */

function Motif({ motif }: { motif: string }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-16 w-16 sm:h-20 sm:w-20",
  };

  switch (motif) {
    case "grid":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="8" y="8" width="14" height="14" rx="3" />
          <rect x="26" y="8" width="14" height="14" rx="3" opacity="0.55" />
          <rect x="8" y="26" width="14" height="14" rx="3" opacity="0.55" />
          <rect x="26" y="26" width="14" height="14" rx="3" opacity="0.8" />
        </svg>
      );
    case "table":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="8" y="10" width="32" height="28" rx="3" />
          <path d="M8 19h32M8 28h32M20 10v28M31 10v18" opacity="0.6" />
          <path d="M33 31l2.5 2.5 3.5-4" strokeWidth="2.2" opacity="0.85" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="11" y="14" width="24" height="20" rx="4" opacity="0.45" />
          <rect x="14" y="10" width="24" height="22" rx="4" />
          <path d="M22 21l5 4 5-4" strokeWidth="2.2" opacity="0.85" />
        </svg>
      );
    case "photo":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="8" y="10" width="32" height="28" rx="4" />
          <circle cx="17" cy="19" r="3.2" />
          <path d="M9 34l11-12 7 8 6-6 6 7v0" opacity="0.85" />
        </svg>
      );
    case "document":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="12" y="8" width="20" height="26" rx="3" />
          <circle cx="30" cy="13.5" r="2.2" opacity="0.6" />
          <path d="M17 20h10M17 25h8" opacity="0.8" />
        </svg>
      );
    case "stack":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="13" y="18" width="24" height="18" rx="4" opacity="0.45" />
          <rect x="10" y="12" width="24" height="18" rx="4" opacity="0.65" />
          <rect x="7" y="6" width="24" height="18" rx="4" />
        </svg>
      );
  }
  return null;
}

export function ProductVisual({
  accent,
  visual,
  label,
  className = "",
}: {
  accent: string;
  visual: ProductVisual;
  label?: string;
  className?: string;
}) {
  const meta = defaultProductMeta(visual);
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden ${accent} ${className}`}
    >
      <span className="text-white/30 transition-transform duration-500 group-hover:scale-105">
        <Motif motif={meta.motif} />
      </span>
      <span className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-sm">
          {label ?? meta.label}
        </span>
      </span>
    </div>
  );
}