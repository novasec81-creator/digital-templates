import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/produits`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/a-propos`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/cgv`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
        previewImages: true,
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
      take: 1000,
    });
    productRoutes = products.map((p) => ({ url: `${base}/produits/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly", priority: 0.8 }));
  } catch {}

  return [...staticRoutes, ...productRoutes];
}