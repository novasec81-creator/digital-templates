import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Shield, Zap } from "lucide-react";
import { prisma } from "@/lib/db";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { RatingStars } from "@/components/ui/RatingStars";
import { PriceTag } from "@/components/ui/PriceTag";
import { ReviewForm } from "@/components/shop/ReviewForm";
import { price } from "@/lib/constants";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 200),
      images: product.previewImages[0] ? [product.previewImages[0]] : [],
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
  const user = await getSessionUser();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!product || !product.isActive) notFound();

  const reviews = product.reviews;
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.previewImages,
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

  const isPurchaser = user
    ? await prisma.orderItem.findFirst({
        where: {
          productId: product.id,
          order: { userId: user.id, status: "PAID" },
        },
      })
    : null;

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
            <Link href={`/produits?categorie=${product.category.slug}`} className="hover:text-gray-900">
              {product.category.name}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.previewImages} title={product.title} />

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
              <Zap className="h-4 w-4 text-gray-400" /> Livraison instantanée après paiement
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-400" /> Lien de téléchargement sécurisé (72 h, 5 téléchargements)
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-gray-400" /> Facture PDF envoyée par email
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-gray-400" /> Retéléchargement illimité via votre compte
            </li>
          </ul>

          <div className="mt-8">
            <AddToCartButton
              productId={product.id}
              title={product.title}
              priceCents={product.priceCents}
              full
            />
            <p className="mt-2 text-center text-xs text-gray-500">
              Paiement sécurisé via Stripe — carte, Apple Pay, Google Pay
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
              {reviews.map((r) => (
                <li key={r.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{r.authorName}</p>
                      {r.isVerified && (
                        <span className="text-xs font-medium text-green-700">
                          ✓ Achat vérifié
                        </span>
                      )}
                    </div>
                    <span className="hidden text-xs text-gray-400">
                      {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(r.createdAt)}
                    </span>
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
          <h3 className="text-lg font-bold tracking-tight">Donner votre avis</h3>
          <div className="mt-4">
            <ReviewForm productId={product.id} isVerified={Boolean(isPurchaser)} />
          </div>
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-900">Prix : {price(product.priceCents)}</p>
            <p className="mt-1">
              Fiches produits non contractuelles. Conformément à l&apos;article L221-28 du
              Code de la consommation, la fourniture d&apos;un contenu numérique livré
              immédiatement entraîne la renonciation au droit de rétractation, confirmée
              au paiement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}