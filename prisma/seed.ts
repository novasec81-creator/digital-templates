import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed script — `npm run db:seed`.
 *
 * Creates categories, a few demo products (replace the placeholder preview
 * images and file keys with real assets), a demo promo code and a demo
 * affiliate link.
 *
 * File keys refer to objects you must upload in your S3/R2 bucket under the
 * same bucket/keys (see README → Déploiement → Storage).
 */
async function main() {
  const categories = [
    { slug: "notion", name: "Templates Notion" },
    { slug: "excel", name: "Excel / Google Sheets" },
    { slug: "lightroom", name: "Presets Lightroom" },
    { slug: "canva", name: "Modèles Canva" },
    { slug: "cv", name: "CV & Candidature" },
  ];

  const cats: Record<string, { id: string }> = {};
  for (const [i, c] of categories.entries()) {
    cats[c.slug] = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: i },
      create: { slug: c.slug, name: c.name, sortOrder: i },
    });
  }

  const products = [
    {
      slug: "template-notion-life-os",
      title: "Notion Life OS — Organisation personnelle",
      description:
        "Un système complet pour piloter votre vie : tâches, habitudes, projets,\nfinances, revues quotidiennes et hebdomadaires. 12 bases reliées et prêtes à l'emploi.",
      priceCents: 1900,
      compareAtPriceCents: 2900,
      categoryId: cats.notion.id,
      fileKey: "templates/notion-life-os.zip",
      previewImages: [
        "https://placehold.co/800x600/111827/ffffff?text=Apercu+1+Life+OS",
        "https://placehold.co/800x600/1f2937/ffffff?text=Apercu+2+Life+OS",
        "https://placehold.co/800x600/374151/ffffff?text=Apercu+3+Life+OS",
      ],
      isBundle: false,
    },
    {
      slug: "pack-productivite-notion-excel",
      title: "Pack Productivité (Notion + Excel)",
      description:
        "Le duo gagnant : notre template Notion Life OS + un tracking d'objectifs Excel\navancé avec indicateurs et graphiques automatiques.",
      priceCents: 2900,
      compareAtPriceCents: 3900,
      categoryId: cats.excel.id,
      fileKey: "templates/pack-productivite.zip",
      previewImages: [
        "https://placehold.co/800x600/065f46/ffffff?text=Pack+Productivite",
        "https://placehold.co/800x600/047857/ffffff?text=Excel+KPIs",
      ],
      isBundle: true,
    },
    {
      slug: "suivi-finances-personnelles-excel",
      title: "Suivi Finances Personnelles — Excel/Sheets",
      description:
        "Budget mensuel, épargne automatique, suivi des dépenses par catégorie et\nprévisionnel sur 24 mois. Compatible Google Sheets et Excel.",
      priceCents: 1500,
      categoryId: cats.excel.id,
      fileKey: "templates/suivi-finances.xlsx",
      previewImages: [
        "https://placehold.co/800x600/14532d/ffffff?text=Finances+1",
        "https://placehold.co/800x600/166534/ffffff?text=Finances+2",
      ],
      isBundle: false,
    },
    {
      slug: "presets-lightroom-preset-film-2026",
      title: "Presets Lightroom — Pack Film 2026",
      description:
        "25 presets d'inspiration argentique : Kodak Gold, Portra 400, Tri-X.\nDéveloppés pour Lightroom Classic et Mobile (DNG + XMP).",
      priceCents: 2400,
      compareAtPriceCents: 3200,
      categoryId: cats.lightroom.id,
      fileKey: "templates/presets-film-2026.zip",
      previewImages: [
        "https://placehold.co/800x600/7c2d12/ffffff?text=Preset+Film+1",
        "https://placehold.co/800x600/9a3412/ffffff?text=Preset+Film+2",
        "https://placehold.co/800x600/b45309/ffffff?text=Preset+Film+3",
      ],
      isBundle: false,
    },
    {
      slug: "modele-canva-pitch-deck-startup",
      title: "Canva — Pitch Deck Startup 20 slides",
      description:
        "20 slides professionnelles pour lever des fonds : problème, solution, marché,\nbusiness model, plan financier. Format 16:9, couleurs et polices modifiables.",
      priceCents: 1200,
      categoryId: cats.canva.id,
      fileKey: "templates/pitch-deck-canva.zip",
      previewImages: [
        "https://placehold.co/800x600/1e3a8a/ffffff?text=Pitch+Deck+1",
        "https://placehold.co/800x600/1d4ed8/ffffff?text=Pitch+Deck+2",
      ],
      isBundle: false,
    },
    {
      slug: "cv-modern-ats-friendly",
      title: "CV Moderne ATS-Friendly (Word/PDF)",
      description:
        "3 modèles de CV optimisés ATS, livrés en Word (pages de style automatiques),\nplus une lettre de motivation assortie. Personnalisation en 5 minutes.",
      priceCents: 900,
      compareAtPriceCents: 1400,
      categoryId: cats.cv.id,
      fileKey: "templates/cv-ats-friendly.zip",
      previewImages: [
        "https://placehold.co/800x600/0f172a/ffffff?text=CV+1",
        "https://placehold.co/800x600/1e293b/ffffff?text=CV+2",
      ],
      isBundle: false,
    },
  ];

  for (const p of products) {
    if (await prisma.product.findUnique({ where: { slug: p.slug } })) continue;
    await prisma.product.create({ data: p });
  }

  await prisma.promoCode.upsert({
    where: { code: "BIENVENUE10" },
    update: {},
    create: { code: "BIENVENUE10", discountPercent: 10 },
  });
  await prisma.promoCode.upsert({
    where: { code: "FLASH5" },
    update: {},
    create: { code: "FLASH5", discountCents: 500 },
  });

  await prisma.affiliateLink.upsert({
    where: { code: "demo-creator" },
    update: {},
    create: {
      code: "demo-creator",
      commissionPercent: 20,
      user: {
        connectOrCreate: {
          where: { email: "affilie@demo.fr" },
          create: { email: "affilie@demo.fr" },
        },
      },
    },
  });

  const total = await prisma.product.count();
  console.log(`Seed terminé : ${categories.length} catégories, ${total} produits, 2 promos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());