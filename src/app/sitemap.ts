import type { MetadataRoute } from "next";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import { requireSiteUrl } from "@/lib/constants";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = requireSiteUrl("sitemap");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/produits`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/a-propos`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/cgv`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const productRoutes: MetadataRoute.Sitemap = DEMO_PRODUCTS.map((p) => ({
    url: `${base}/produits/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}