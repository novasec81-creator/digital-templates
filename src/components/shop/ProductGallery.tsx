"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
        {current ? (
          <Image
            src={current}
            alt={`${title} — aperçu ${active + 1}`}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 600px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Aperçu non disponible
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Voir l'aperçu ${i + 1}`}
              className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-md border-2 ${
                i === active ? "border-gray-900" : "border-transparent"
              }`}
            >
              <Image src={img} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}