import type { Metadata } from "next";
import { ProductsBrowser } from "@/components/shop/ProductsBrowser";
import { DEMO_PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/demo-data";
import { CONTACT, STORE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tous les templates",
  description:
    "Tous nos templates numériques : Notion, Excel & Google Sheets, Canva, presets Lightroom et modèles de CV. Commande par contact, livraison par email.",
};

export default function ProduitsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Catalogue
          </h1>
          <p className="mt-3 leading-relaxed text-ink-2">
            {DEMO_PRODUCTS.length} templates en vitrine chez {STORE_NAME} — Notion,
            Excel &amp; Sheets, Canva, Lightroom et CV.
          </p>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-ink-3">{CONTACT.orderNote}</p>
      </div>

      <ProductsBrowser
        products={DEMO_PRODUCTS}
        categories={PRODUCT_CATEGORIES}
      />
    </section>
  );
}