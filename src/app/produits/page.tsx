import type { Metadata } from "next";
import { ProductsBrowser } from "@/components/shop/ProductsBrowser";
import { DEMO_PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Tous les templates",
  description:
    "Tous nos templates numériques : Notion, Excel/Google Sheets, presets Lightroom, Canva, CV.",
};

export default function ProduitsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
      <p className="mt-2 text-gray-600">
        {DEMO_PRODUCTS.length} templates présentés en vitrine —{" "}
        <a href="/contact" className="text-blue-600 underline">
          contactez-nous
        </a>{" "}
        pour passer commande.
      </p>

      <ProductsBrowser products={DEMO_PRODUCTS} categories={PRODUCT_CATEGORIES} />
    </div>
  );
}