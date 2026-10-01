import type { ProductVisual } from "@/lib/demo-data";

/**
 * Visuel de repli d'un produit, quand aucune vraie capture n'est disponible.
 *
 * Contraintes respectées :
 * - aucune fausse capture d'écran (ce n'est pas une image du produit) ;
 * - palette Format uniquement (encre, papier, argile) : pas de gradient
 *   multicolore, pas de néon, pas de glow ;
 * - rendu SVG statique et léger, sans animation permanente ;
 * - le visuel est annoncé comme illustration pour rester honnête.
 */

type Motif =
  | "notion"
  | "excel"
  | "canva"
  | "lightroom"
  | "cv"
  | "bundle";

const MOTIF_BY_VISUAL: Record<ProductVisual, Motif> = {
  notion: "notion",
  excel: "excel",
  canva: "canva",
  lightroom: "lightroom",
  cv: "cv",
  bundle: "bundle",
};

/** Étiquette affichée sous le visuel pour ne pas laisser croire à une capture. */
const LABEL_BY_MOTIF: Record<Motif, string> = {
  notion: "Illustration — base Notion",
  excel: "Illustration — tableur",
  canva: "Illustration — modèle Canva",
  lightroom: "Illustration — preset photo",
  cv: "Illustration — modèle de document",
  bundle: "Illustration — pack",
};

/* Trame commune : fond papier + repère d'angle + filet clay. */
function Frame({ motif }: { motif: Motif }) {
  return (
    <>
      {/* Trame de fond : très légère, pour éviter l'aplat vide. */}
      <g opacity="0.5" stroke="currentColor" strokeWidth="0.5">
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 24} x2="320" y2={i * 24} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`v${i}`} x1={i * 26} y1="0" x2={i * 26} y2="168" />
        ))}
      </g>
      {/* Repère d'atelier, en argile. */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9">
        <line x1="20" y1="34" x2="20" y2="20" />
        <line x1="20" y1="20" x2="34" y2="20" />
        <line x1="300" y1="134" x2="300" y2="148" />
        <line x1="300" y1="148" x2="286" y2="148" />
      </g>
      {/* Filet clay horizontal, signature de l'identité. */}
      <rect
        x="20"
        y="146"
        width="56"
        height="3"
        rx="1.5"
        className="fill-[color:var(--color-clay)]"
      />
      {/* Nom interne du motif, réservé aux lecteurs d'écran. */}
      <title>{LABEL_BY_MOTIF[motif]}</title>
    </>
  );
}

/**
 * Motifs : chacun évoque la structure réelle du produit (tableau de tâches,
 * grille de cellules, calques, diaphragme, page A4, pile) sans reproduire
 * une interface existante.
 */
function MotifArt({ motif }: { motif: Motif }) {
  const strokeProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (motif) {
    /* Notion : colonnes de tâches reliées, cases à cocher. */
    case "notion":
      return (
        <g>
          <rect
            x="58"
            y="40"
            width="72"
            height="88"
            rx="6"
            className="fill-[color:var(--color-paper)]"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="146"
            y="40"
            width="72"
            height="88"
            rx="6"
            className="fill-[color:var(--color-paper)]"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="234"
            y="40"
            width="72"
            height="88"
            rx="6"
            className="fill-[color:var(--color-paper)]"
            stroke="currentColor"
            strokeWidth="2"
          />
          {[0, 1, 2].map((row) =>
            [58, 146, 234].map((x) => (
              <g key={`${x}-${row}`} {...strokeProps} strokeWidth="2">
                <rect x={x + 12} y={58 + row * 22} width="9" height="9" rx="2" />
                <line
                  x1={x + 28}
                  y1={62 + row * 22}
                  x2={x + 58}
                  y2={62 + row * 22}
                />
              </g>
            ))
          )}
          {/* Liens entre colonnes. */}
          <g {...strokeProps} className="text-[color:var(--color-clay)]">
            <path d="M130 84h16" />
            <path d="M218 84h16" />
          </g>
        </g>
      );

    /* Excel : grille + colonne de formules + courbe. */
    case "excel":
      return (
        <g>
          <rect
            x="62"
            y="38"
            width="196"
            height="96"
            rx="6"
            className="fill-[color:var(--color-paper)]"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="62"
            y="38"
            width="196"
            height="18"
            rx="6"
            className="fill-[color:var(--color-clay-soft)]"
            stroke="currentColor"
            strokeWidth="2"
          />
          <g {...strokeProps} strokeWidth="1.5" className="text-[color:var(--color-ink-3)]">
            <line x1="118" y1="56" x2="118" y2="134" />
            <line x1="176" y1="56" x2="176" y2="134" />
            <line x1="62" y1="74" x2="258" y2="74" />
            <line x1="62" y1="94" x2="258" y2="94" />
            <line x1="62" y1="114" x2="258" y2="114" />
          </g>
          <g {...strokeProps} strokeWidth="2" className="text-[color:var(--color-clay)]">
            <path d="M186 118l16-12 14 5 18-24" />
            <circle cx="186" cy="118" r="3" />
            <circle cx="234" cy="87" r="3" />
          </g>
        </g>
      );

    /* Canva : calques décalés + zone de texte. */
    case "canva":
      return (
        <g>
          <rect
            x="84"
            y="62"
            width="152"
            height="76"
            rx="8"
            className="fill-[color:var(--color-paper)]"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.5"
          />
          <rect
            x="72"
            y="52"
            width="152"
            height="76"
            rx="8"
            className="fill-[color:var(--color-paper)]"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.75"
          />
          <rect
            x="60"
            y="42"
            width="152"
            height="76"
            rx="8"
            className="fill-[color:var(--color-paper)]"
            stroke="currentColor"
            strokeWidth="2"
          />
          <g {...strokeProps} className="text-[color:var(--color-clay)]">
            <rect x="76" y="58" width="46" height="6" rx="3" />
            <rect x="76" y="72" width="120" height="4" rx="2" opacity="0.55" />
            <rect x="76" y="82" width="96" height="4" rx="2" opacity="0.55" />
            <rect x="76" y="98" width="58" height="10" rx="5" />
          </g>
        </g>
      );

    /* Lightroom : diaphragme + courbe de contraste. */
    case "lightroom":
      return (
        <g>
          <circle
            cx="160"
            cy="86"
            r="48"
            className="fill-[color:var(--color-paper)]"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="160"
            cy="86"
            r="30"
            className="fill-[color:var(--color-clay-soft)]"
            stroke="currentColor"
            strokeWidth="2"
          />
          <g {...strokeProps} className="text-[color:var(--color-clay)]" strokeWidth="3">
            <path d="M142 98l36-24" />
          </g>
          {/* Échelle de contraste. */}
          <g {...strokeProps} strokeWidth="1.5" className="text-[color:var(--color-ink-3)]">
            <line x1="222" y1="58" x2="286" y2="58" />
            <line x1="222" y1="86" x2="286" y2="86" />
            <line x1="222" y1="114" x2="286" y2="114" />
          </g>
          <path
            d="M222 118C240 116 244 92 254 84s22-14 32-26"
            {...strokeProps}
            className="text-[color:var(--color-clay)]"
          />
        </g>
      );

    /* CV : page A4 + ligne de titre + puces. */
    case "cv":
      return (
        <g>
          <rect
            x="108"
            y="34"
            width="104"
            height="116"
            rx="6"
            className="fill-[color:var(--color-paper)]"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="160"
            cy="62"
            r="14"
            className="fill-[color:var(--color-clay-soft)]"
            stroke="currentColor"
            strokeWidth="2"
          />
          <g className="text-[color:var(--color-clay)]">
            <rect x="132" y="86" width="56" height="5" rx="2.5" />
          </g>
          <g {...strokeProps} strokeWidth="2" className="text-[color:var(--color-ink-3)]">
            <line x1="124" y1="104" x2="196" y2="104" />
            <line x1="124" y1="116" x2="196" y2="116" />
            <line x1="124" y1="128" x2="176" y2="128" />
          </g>
          </g>
      );

    /* Pack : trois couches superposées. */
    case "bundle":
      return (
        <g>
          <rect
            x="96"
            y="96"
            width="128"
            height="34"
            rx="6"
            className="fill-[color:var(--color-paper)]"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.5"
          />
          <rect
            x="82"
            y="78"
            width="128"
            height="34"
            rx="6"
            className="fill-[color:var(--color-paper)]"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.75"
          />
          <rect
            x="68"
            y="60"
            width="128"
            height="34"
            rx="6"
            className="fill-[color:var(--color-paper)]"
            stroke="currentColor"
            strokeWidth="2"
          />
          <g className="text-[color:var(--color-clay)]">
            <rect x="84" y="74" width="42" height="6" rx="3" />
          </g>
          <g {...strokeProps} strokeWidth="2" className="text-[color:var(--color-ink-3)]">
            <line x1="84" y1="90" x2="160" y2="90" />
          </g>
          <g {...strokeProps} strokeWidth="2" className="text-[color:var(--color-clay)]">
            <path d="M212 76h24M212 92h24" />
          </g>
        </g>
      );
  }
}

/**
 * @param motif   Motif à dessiner, déduit de la catégorie produit.
 * @param label   Étiquette libre (remplace le libellé par défaut).
 * @param compact Version resserrée pour les petites surfaces (cartes, vignettes).
 */
export function ProductVisual({
  visual,
  label,
  className = "",
  compact = false,
}: {
  visual: ProductVisual;
  label?: string;
  className?: string;
  compact?: boolean;
}) {
  const motif = MOTIF_BY_VISUAL[visual];
  const caption = label ?? LABEL_BY_MOTIF[motif];

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-paper-2 text-ink-3 ${className}`}
    >
      <svg
        viewBox="0 0 320 168"
        role="img"
        aria-label={caption}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full text-line-strong"
      >
        <Frame motif={motif} />
        <MotifArt motif={motif} />
      </svg>

      {/* Mention honnête : ce visuel est une illustration, pas une capture. */}
      {!compact && (
        <p className="pointer-events-none absolute bottom-2 left-3 text-[11px] font-medium text-ink-3">
          {caption}
        </p>
      )}
    </div>
  );
}

/** Libellé texte du visuel de repli (utilisé par les attributs alt). */
export function productVisualAlt(visual: ProductVisual): string {
  return LABEL_BY_MOTIF[MOTIF_BY_VISUAL[visual]];
}