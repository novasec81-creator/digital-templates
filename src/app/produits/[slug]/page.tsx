import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Mail, Palette, PenLine } from "lucide-react";
import {
  DEMO_PRODUCTS,
  getBundlesForProduct,
  getCompatibility,
  getCoverImage,
  getDemoProduct,
  getSimilarProducts,
  PRODUCT_FAQ_BY_VISUAL,
  type ProductVisual,
} from "@/lib/demo-data";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductCard } from "@/components/shop/ProductCard";
import { PriceTag } from "@/components/ui/PriceTag";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { bundleOrderHref, orderNote, productOrderHref } from "@/lib/purchase";
import {
  canonicalPath,
  CONTACT,
  CURRENCY,
  requireSiteUrl,
  STORE_NAME,
  price,
} from "@/lib/constants";

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
  const base = requireSiteUrl("generateMetadata");
  const description = product.description.slice(0, 160);
  const cover = getCoverImage(product);
  return {
    title: product.title,
    description,
    alternates: { canonical: canonicalPath(`/produits/${product.slug}`) },
    openGraph: {
      title: `${product.title} · ${STORE_NAME}`,
      description,
      url: canonicalPath(`/produits/${product.slug}`),
      type: "website",
      // Image de partage uniquement si une vraie capture existe : aucune
      // illustration ne prétend représenter le produit.
      ...(cover
        ? { images: [{ url: `${base}${cover.src}`, alt: cover.alt }] }
        : {}),
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

  const base = requireSiteUrl("produit");
  const productUrl = `${base}/produits/${product.slug}`;

  const similar = getSimilarProducts(product);
  const packs = getBundlesForProduct(product.slug);
  const compatibility = getCompatibility(product);
  const members = product.isBundle ? product.includes : [];

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
      priceCurrency: CURRENCY,
      price: (product.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: productUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: base },
      { "@type": "ListItem", position: 2, name: "Catalogue", item: `${base}/produits` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: productUrl,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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

          {/* Compatibilité : uniquement des outils réellement supportés. */}
          {compatibility.length > 0 && (
            <div className="mt-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
                Compatible avec
              </h2>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {compatibility.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-2 px-3 py-1.5 text-[13px] text-ink-2"
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-clay" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Informations importantes */}
          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex items-start gap-3 rounded-xl border border-line bg-paper-2 px-4 py-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
              <p className="text-ink-2">
                <span className="font-semibold text-ink">Livraison par email</span> —{" "}
                {orderNote()}
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
                — {members.length} élément{members.length > 1 ? "s" : ""} listé
                {members.length > 1 ? "s" : ""} ci-dessous.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={productOrderHref(product)}
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

      {/* Ce template est inclus dans un pack : proposition alternative. */}
      {packs.length > 0 && (
        <section
          aria-labelledby="packs-heading"
          className="mt-14 rounded-2xl border border-line bg-paper-2 p-6"
        >
          <h2
            id="packs-heading"
            className="text-lg font-bold tracking-tight text-ink"
          >
            Économisez avec un pack
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
            Ce template est inclus dans {packs.length > 1 ? "ces packs" : "ce pack"},
            où il est proposé avec d&apos;autres ressources à prix réduit.
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {packs.map((pack) => (
              <li
                key={pack.id}
                className="flex flex-col rounded-xl border border-line bg-paper p-5 shadow-card"
              >
                <p className="text-sm font-bold text-ink">{pack.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
                  {pack.tagline}
                </p>
                <Link
                  href={bundleOrderHref(pack)}
                  className="mt-4 inline-flex items-center gap-1.5 self-start rounded-lg py-1.5 text-sm font-semibold text-ink transition-colors hover:text-clay"
                >
                  Pack à {price(pack.packPriceCents)}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

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
          <SectionHeader
            eyebrow="À découvrir aussi"
            title="D'autres ressources"
            description="Sélectionnées à partir de votre besoin, dans cette catégorie d'abord."
            linkHref={`/produits?categorie=${product.category.slug}`}
            linkLabel="Toute la catégorie"
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}