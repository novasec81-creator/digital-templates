import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Mail, Palette, PenLine } from "lucide-react";
import {
  DEMO_PRODUCTS,
  getDemoProduct,
  PRODUCT_FAQ_BY_VISUAL,
  type ProductVisual,
} from "@/lib/demo-data";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductCard } from "@/components/shop/ProductCard";
import { PriceTag } from "@/components/ui/PriceTag";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { CONTACT, STORE_NAME } from "@/lib/constants";

export const dynamicParams = false;

export function generateStaticParams() {
  return DEMO_PRODUCTS.map((p) => ({ slug: p.slug }));
}

const USE_COPY: Record<
  ProductVisual,
  { receive: string; open: string; customize: string }
> = {
  notion: {
    receive: "Recevez par email le lien de duplication de la base Notion.",
    open: "Dupliquez la base dans votre espace de travail Notion (compte gratuit suffit).",
    customize: "Personnalisez propriétés, vues et automatisations, puis utilisez-la.",
  },
  excel: {
    receive: "Recevez par email le fichier Excel ou le lien Google Sheets.",
    open: "Ouvrez le fichier dans Excel ou importez-le dans Google Sheets.",
    customize: "Saisissez vos montants : totaux et graphiques se calculent seuls.",
  },
  canva: {
    receive: "Recevez par email le lien de duplication du modèle Canva.",
    open: "Dupliquez le modèle dans votre propre compte Canva.",
    customize: "Remplacez textes, couleurs et visuels, puis exportez.",
  },
  lightroom: {
    receive: "Recevez par email les fichiers .xmp et le guide d'installation.",
    open: "Importez les presets dans Lightroom desktop ou mobile.",
    customize: "Appliquez le preset puis ajustez l'exposition par série.",
  },
  cv: {
    receive: "Recevez par email le modèle et son guide de remplissage.",
    open: "Ouvrez le fichier .docx ou dupliquez le modèle Canva.",
    customize: "Remplissez vos informations et exportez en PDF.",
  },
  bundle: {
    receive: "Recevez par email l'ensemble des fichiers du pack.",
    open: "Ouvrez chaque ressource dans son outil (Notion, Excel…).",
    customize: "Personnalisez indépendamment chaque élément du pack.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getDemoProduct(slug);
  if (!product) return { title: "Produit introuvable" };
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    alternates: { canonical: `${base}/produits/${product.slug}` },
    openGraph: {
      title: `${product.title} · ${STORE_NAME}`,
      description: product.description.slice(0, 200),
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getDemoProduct(slug);
  if (!product) notFound();

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const productUrl = `${base}/produits/${product.slug}`;

  const similar = DEMO_PRODUCTS.filter(
    (p) => p.category.slug === product.category.slug && p.id !== product.id
  ).slice(0, 3);

  const useCopy = USE_COPY[product.visual];
  const faq = PRODUCT_FAQ_BY_VISUAL[product.visual];

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    description: product.description,
    category: product.category.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: (product.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: productUrl,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Fil d'ariane */}
      <nav aria-label="Fil d'ariane" className="text-sm text-ink-3">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition-colors hover:text-ink">
              Accueil
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/produits" className="transition-colors hover:text-ink">
              Catalogue
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink-2">
            {product.title}
          </li>
        </ol>
      </nav>

      {/* Haut de fiche : galerie (55 %) / informations (45 %) */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[11fr_9fr] lg:gap-12">
        <div id="galerie">
          <ProductGallery product={product} />
        </div>

        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
            {product.category.name}
            {product.isBundle && (
              <span className="ml-2 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-bold normal-case tracking-normal text-clay">
                Pack
              </span>
            )}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-2 text-[15px] font-medium text-ink-2">{product.tagline}</p>

          <div className="mt-5">
            <PriceTag
              priceCents={product.priceCents}
              compareAtPriceCents={product.compareAtPriceCents}
            />
          </div>

          <p className="mt-5 whitespace-pre-line leading-relaxed text-ink-2">
            {product.description}
          </p>

          {/* Informations importantes */}
          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex items-start gap-3 rounded-xl border border-line bg-paper-2 px-4 py-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
              <p className="text-ink-2">
                <span className="font-semibold text-ink">Livraison par email</span> —{" "}
                {CONTACT.orderNote}
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-line bg-paper-2 px-4 py-3">
              <Palette className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
              <p className="text-ink-2">
                <span className="font-semibold text-ink">Personnalisable</span> — les
                fichiers sont livrés dans leur format d&apos;origine et peuvent être
                adaptés librement.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-line bg-paper-2 px-4 py-3">
              <PenLine className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
              <p className="text-ink-2">
                <span className="font-semibold text-ink">Ce que contient ce template</span>{" "}
                — fichier prêt à l&apos;emploi, guide de démarrage et guide d&apos;utilisation.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-black sm:w-auto"
            >
              Commander ce template
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="text-xs text-ink-3">
              {CONTACT.responseDelay} Une question avant de commander ?{" "}
              <Link href="/faq" className="font-medium text-ink transition-colors hover:text-clay">
                Consultez la FAQ
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Ce que vous obtenez */}
      <section aria-labelledby="inclus-heading" className="mt-16">
        <h2 id="inclus-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
          Ce que vous obtenez
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {product.includes.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-line bg-paper px-4 py-3.5 text-sm text-ink-2 shadow-card"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Fonctionnalités */}
      <section aria-labelledby="features-heading" className="mt-12">
        <h2 id="features-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
          Fonctionnalités
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {product.features.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-line bg-paper px-4 py-3.5 text-sm text-ink-2 shadow-card"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Pour qui */}
      <section aria-labelledby="forwhom-heading" className="mt-12">
        <h2 id="forwhom-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
          Pour qui ?
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {product.forWhom.map((item) => (
            <li
              key={item}
              className="rounded-full border border-line bg-paper-2 px-4 py-2 text-sm text-ink-2"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Comment l'utiliser */}
      <section aria-labelledby="howto-heading" className="mt-12 border-t border-line pt-10">
        <h2 id="howto-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
          Comment l&apos;utiliser ?
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { title: "1. Recevez", text: useCopy.receive },
            { title: "2. Ouvrez", text: useCopy.open },
            { title: "3. Personnalisez", text: useCopy.customize },
          ].map((step) => (
            <li key={step.title} className="rounded-xl border border-line bg-paper p-5 shadow-card">
              <p className="text-sm font-bold text-ink">{step.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ produit */}
      <section aria-labelledby="product-faq-heading" className="mt-12">
        <h2 id="product-faq-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
          Questions sur ce template
        </h2>
        <div className="mt-6">
          <FaqAccordion items={faq} />
        </div>
      </section>

      {/* Produits similaires */}
      {similar.length > 0 && (
        <section aria-labelledby="similar-heading" className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2
              id="similar-heading"
              className="text-xl font-bold tracking-tight text-ink sm:text-2xl"
            >
              Dans la même catégorie
            </h2>
            <Link
              href={`/produits#${product.category.slug}`}
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-clay"
            >
              Toute la catégorie
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}