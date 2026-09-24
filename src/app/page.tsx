import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/shop/ProductCard";
import { DEMO_PRODUCTS, PRODUCT_CATEGORIES, type DemoProduct } from "@/lib/demo-data";
import { STORE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Templates numériques à télécharger",
  description:
    "Templates Notion, Excel, Canva, presets Lightroom et modèles de CV — découvrez notre collection.",
};

export default function HomePage() {
  const featured: DemoProduct[] = DEMO_PRODUCTS.slice(0, 8);

  return (
    <div>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Des templates numériques, prêts à l&apos;emploi{" "}
            <span className="text-gray-400">pour gagner du temps.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {STORE_NAME} — Notion, Excel/Sheets, presets Lightroom, modèles Canva et CV.
            Des outils finis, conçus pour être utilisés tout de suite.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/produits"
              className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Découvrir la collection
            </Link>
            <Link
              href="#categories"
              className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Par catégorie
            </Link>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold tracking-tight">Catégories</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {PRODUCT_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/produits#${c.slug}`}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-900 hover:bg-gray-50"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Templates populaires</h2>
          <Link href="/produits" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            Tout voir →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Comment ça marche ?
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {[
              { title: "1. Explorez", text: "Parcourez le catalogue et choisissez les templates qui correspondent à vos besoins." },
              { title: "2. Demandez", text: "Contactez-nous pour passer commande ; le template vous est livré immédiatement." },
              { title: "3. Utilisez", text: "Gagnez des heures sur vos projets dès la première minute." },
            ].map((step) => (
              <div key={step.title} className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}