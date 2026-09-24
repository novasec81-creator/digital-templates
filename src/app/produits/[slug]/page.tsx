import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Sparkles, Star, ShieldCheck } from "lucide-react";
import { DEMO_PRODUCTS, getDemoProduct } from "@/lib/demo-data";
import { RatingStars } from "@/components/ui/RatingStars";
import { PriceTag } from "@/components/ui/PriceTag";
import { price } from "@/lib/constants";

export const dynamicParams = false;

export function generateStaticParams() {
  return DEMO_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getDemoProduct(slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
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

  const reviews = product.reviews;
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    category: product.category.name,
    offers: {
      "@type": "Offer",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/produits/${product.slug}`,
    },
    ...(reviews.length
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: reviews.length,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <nav className="text-sm text-gray-500" aria-label="Fil d'ariane">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-gray-900">Accueil</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/produits" className="hover:text-gray-900">Templates</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/produits" className="hover:text-gray-900">
              {product.category.name}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className={`relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-xl ${product.accent}`}>
          <span className="text-8xl font-bold text-white/25">{product.title.charAt(0)}</span>
          <span className="mt-4 rounded bg-black/30 px-3 py-1 text-sm font-medium text-white/90">
            {product.category.name}
          </span>
          {product.isBundle && (
            <span className="absolute left-3 top-3 rounded bg-gray-900/80 px-2 py-0.5 text-xs font-semibold text-white">
              Pack
            </span>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">
            {product.category.name}
            {product.isBundle && <span className="ml-2 rounded bg-gray-900 px-2 py-0.5 text-xs text-white">Pack</span>}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{product.title}</h1>

          <div className="mt-3">
            <RatingStars rating={avgRating} count={reviews.length} />
          </div>

          <div className="mt-4">
            <PriceTag
              priceCents={product.priceCents}
              compareAtPriceCents={product.compareAtPriceCents}
              className="text-2xl"
            />
          </div>

          <p className="mt-5 whitespace-pre-line leading-relaxed text-gray-700">
            {product.description}
          </p>

          <ul className="mt-6 space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-gray-400" /> Prêt à l&apos;emploi, livré immédiatement après commande
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gray-400" /> Personnalisable et évolutif selon vos besoins
            </li>
            <li className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-400" /> Rendement mesurable : {product.downloads.toLocaleString("fr-FR")} téléchargements
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gray-400" /> Accompagnement après-vente par email
            </li>
          </ul>

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-block w-full rounded-md bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-gray-800"
            >
              Demander ce template
            </Link>
            <p className="mt-2 text-center text-xs text-gray-500">
              Réception immédiate après confirmation. Une question ?{" "}
              <a href="/contact" className="text-blue-600 underline">
                Contactez-nous
              </a>
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Avis clients ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              Soyez le premier à donner votre avis sur ce template.
            </p>
          ) : (
            <ul className="mt-6 space-y-6">
              {reviews.map((r, i) => (
                <li key={i} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{r.authorName}</p>
                    {r.isVerified && (
                      <span className="text-xs font-medium text-green-700">
                        ✓ Achat vérifié
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <RatingStars rating={r.rating} />
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{r.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="h-fit lg:sticky lg:top-24">
          <h3 className="text-lg font-bold tracking-tight">Ce template</h3>
          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-900">Prix : {price(product.priceCents)}</p>
            <p className="mt-1">
              Fiches produits non contractuelles. Pour toute question,{" "}
              <a href="/contact" className="text-blue-600 underline">
                écrivez-nous
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}