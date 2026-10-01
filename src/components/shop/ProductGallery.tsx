"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import type { DemoProduct } from "@/lib/demo-data";
import { getGalleryImages } from "@/lib/demo-data";
import { ProductVisual } from "@/components/shop/ProductVisual";

/**
 * Galerie produit.
 *
 * - Avec de vraies captures (`product.images`) : image active, miniatures,
 *   navigation clavier (flèches) et visionneuse plein écran accessible
 *   (fermeture par `Échap`, clic sur le fond, focus restitué à la source).
 * - Sans capture : illustration de catégorie, annoncée comme telle, sans
 *   promesse d'image qui n'existe pas.
 */
export function ProductGallery({ product }: { product: DemoProduct }) {
  const images = getGalleryImages(product);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const hasImages = images.length > 0;
  const current = images[active];

  const close = useCallback(() => setLightbox(false), []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") close();
      if (!hasImages || images.length < 2) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActive((i) => (i + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActive((i) => (i - 1 + images.length) % images.length);
      }
    },
    [close, hasImages, images.length]
  );

  // Bloque le défilement de l'arrière-plan tant que la visionneuse est ouverte.
  useEffect(() => {
    if (!lightbox) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [lightbox]);

  // Restitue le focus au bouton qui a ouvert la visionneuse.
  useEffect(() => {
    if (lightbox) triggerRef.current?.focus();
  }, [lightbox]);

  if (!hasImages) {
    return (
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border border-line bg-paper-2 shadow-card">
          <ProductVisual
            visual={product.visual}
            label={`${product.category.name} — illustration`}
            className="aspect-[4/3] w-full"
          />
        </div>
        <p className="text-xs leading-relaxed text-ink-3">
          Aperçu illustratif : il représente la structure du template, pas une
          capture de l&apos;interface. Les aperçus réels sont ajoutés dès
          qu&apos;ils sont disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-paper-2 shadow-card">
        <div className="aspect-[4/3]">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>

        {images.length > 1 && (
          <p className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-paper/95 px-2.5 py-1 text-[11px] font-semibold text-ink-2">
            {active + 1} / {images.length}
          </p>
        )}

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setLightbox(true)}
          aria-label={`Agrandir la capture${images.length > 1 ? ` ${active + 1}` : ""} de ${product.title}`}
          className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-paper/95 px-3 py-1.5 text-[11px] font-semibold text-ink transition-colors hover:bg-paper hover:text-clay"
        >
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          Agrandir
        </button>
      </div>

      {images.length > 1 && (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Choisir une capture"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Afficher la capture ${i + 1}`}
              aria-current={active === i}
              className={`relative h-16 w-20 overflow-hidden rounded-lg border transition-colors ${
                active === i
                  ? "border-clay"
                  : "border-line opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                loading="lazy"
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Aperçu de ${product.title}`}
          onKeyDown={onKeyDown}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/92 p-4"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Fermer l'aperçu"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper/25 text-paper transition-colors hover:bg-paper/10"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <figure className="relative flex max-h-full w-full max-w-4xl flex-col gap-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-paper">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="(max-width: 1024px) 96vw, 60vw"
                className="object-contain"
              />
            </div>
            <figcaption className="flex items-center justify-between gap-3 text-xs text-paper/75">
              <span>{current.alt}</span>
              {images.length > 1 && (
                <span className="shrink-0">
                  {active + 1} / {images.length} — flèches pour naviguer, Échap
                  pour fermer
                </span>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}