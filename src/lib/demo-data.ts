export interface DemoCategory {
  name: string;
  slug: string;
}

export interface DemoReview {
  authorName: string;
  rating: number;
  content: string;
  isVerified?: boolean;
}

export interface DemoProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
  category: DemoCategory;
  isBundle?: boolean;
  downloads: number;
  accent: string;
  reviews: DemoReview[];
}

export const PRODUCT_CATEGORIES: DemoCategory[] = [
  { name: "Notion", slug: "notion" },
  { name: "Excel & Sheets", slug: "excel" },
  { name: "Canva", slug: "canva" },
  { name: "Presets Lightroom", slug: "lightroom" },
  { name: "CV", slug: "cv" },
];

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: "clvx0001",
    slug: "gestionnaire-de-taches-notion",
    title: "Gestionnaire de tâches Notion",
    description:
      "Un tableau de bord complet pour organiser vos tâches, vos projets et vos priorités. Modules pour le workflow quotidien, la vue hebdomadaire et le suivi des objectifs, reliés entre eux automatiquement.",
    priceCents: 1900,
    compareAtPriceCents: 2900,
    category: PRODUCT_CATEGORIES[0],
    downloads: 1840,
    accent: "bg-gradient-to-br from-indigo-500 to-purple-600",
    reviews: [
      { authorName: "Camille R.", rating: 5, content: "Ma vie est organisée. La base est très complète et simple à personnaliser.", isVerified: true },
      { authorName: "Julien P.", rating: 5, content: "Exactement ce qu'il fallait pour centraliser mes projets freelances." },
      { authorName: "Sarah M.", rating: 4, content: "Très bien pensé, il m'a fallu un petit temps pour adapter les vues." },
    ],
  },
  {
    id: "clvx0002",
    slug: "vie-360-notion",
    title: "Base Notion — Vie 360°",
    description:
      "Organisez votre vie privée et professionnelle au même endroit : objectifs, habitudes, finances, projets perso et santé. Une base unique, reliée et évolutive.",
    priceCents: 2400,
    category: PRODUCT_CATEGORIES[0],
    downloads: 1320,
    accent: "bg-gradient-to-br from-emerald-500 to-teal-600",
    reviews: [
      { authorName: "Léa B.", rating: 5, content: "Superbe template, tout est relié intelligemment. Je recommande.", isVerified: true },
      { authorName: "Nicolas D.", rating: 5, content: "Le meilleur dashboard Notion que j'ai testé jusqu'ici." },
    ],
  },
  {
    id: "clvx0003",
    slug: "base-clients-freelance-notion",
    title: "Base clients freelances (Notion)",
    description:
      "Gérez votre pipeline clients : prospection, devis, statut des missions, facturation et suivi des paiements. Parfait pour indépendants et petites agences.",
    priceCents: 2900,
    compareAtPriceCents: 3900,
    category: PRODUCT_CATEGORIES[0],
    downloads: 980,
    accent: "bg-gradient-to-br from-blue-500 to-cyan-600",
    reviews: [
      { authorName: "Thomas L.", rating: 5, content: "Gagne un temps fou sur le suivi des devis et relances.", isVerified: true },
      { authorName: "Marie K.", rating: 4, content: "Très complet. Ajouter des champs est un jeu d'enfant." },
    ],
  },
  {
    id: "clvx0004",
    slug: "budget-personnel-excel",
    title: "Budget personnel (Excel)",
    description:
      "Un suivi mensuel simple et automatisé : dépenses, épargne, objectifs. Graphiques automatiques, catégories en un clic et projection sur 12 mois.",
    priceCents: 1200,
    category: PRODUCT_CATEGORIES[1],
    downloads: 2600,
    accent: "bg-gradient-to-br from-green-500 to-emerald-700",
    reviews: [
      { authorName: "Claire F.", rating: 5, content: "Intuitif, les graphiques se mettent à jour tout seuls.", isVerified: true },
      { authorName: "Hugo V.", rating: 5, content: "J'ai enfin une vision claire de mes dépenses chaque mois." },
    ],
  },
  {
    id: "clvx0005",
    slug: "suivi-ca-freelance-excel",
    title: "Suivi CA freelance (Excel)",
    description:
      "Pilotez votre chiffre d'affaires : revenus, charges, TVA et bénéfices mois par mois. Synthèse automatique pour votre bilan et vos déclarations.",
    priceCents: 1600,
    compareAtPriceCents: 2100,
    category: PRODUCT_CATEGORIES[1],
    downloads: 1150,
    accent: "bg-gradient-to-br from-lime-500 to-green-700",
    reviews: [
      { authorName: "Sofiane E.", rating: 5, content: "Le calcul de la TVA est nickel, plus besoin de l'Excel de l'URSSAF.", isVerified: true },
    ],
  },
  {
    id: "clvx0006",
    slug: "kit-carrousels-instagram-canva",
    title: "Kit carrousels Instagram (Canva)",
    description:
      "20 pages modèles pour créer des carrousels qui vendent : accroche, problématique, étapes, appel à l'action. Tailles optimisées pour Instagram, LinkedIn et Facebook.",
    priceCents: 2200,
    compareAtPriceCents: 3200,
    category: PRODUCT_CATEGORIES[2],
    downloads: 1430,
    accent: "bg-gradient-to-br from-pink-500 to-rose-600",
    reviews: [
      { authorName: "Aline T.", rating: 5, content: "Je crée mes visuels en 10 minutes maintenant. Top qualité.", isVerified: true },
      { authorName: "Maxime R.", rating: 4, content: "Très beau design, il faut juste adapter les couleurs à sa marque." },
    ],
  },
  {
    id: "clvx0007",
    slug: "mockups-livres-numeriques-canva",
    title: "Pack mockups e-book (Canva)",
    description:
      "Des mockups réalistes pour présenter vos livres numériques et produits digitaux : appareils, fonds de scène et compositions prêtes à l'emploi.",
    priceCents: 1800,
    category: PRODUCT_CATEGORIES[2],
    downloads: 870,
    accent: "bg-gradient-to-br from-fuchsia-500 to-purple-700",
    reviews: [
      { authorName: "Pauline G.", rating: 5, content: "Mes ventes ont progressé juste en changeant mes visuels.", isVerified: true },
    ],
  },
  {
    id: "clvx0008",
    slug: "preset-lightroom-urbain",
    title: "Preset Lightroom — Urbain",
    description:
      "Un rendu contrasté et cinématique pour la photo de rue et d'architecture. Fichier .xmp universel pour Lightroom desktop et mobile.",
    priceCents: 900,
    category: PRODUCT_CATEGORIES[3],
    downloads: 3120,
    accent: "bg-gradient-to-br from-slate-600 to-slate-800",
    reviews: [
      { authorName: "Karim B.", rating: 5, content: "Rendu sublime dès l'import, le contraste est parfait.", isVerified: true },
      { authorName: "Élodie S.", rating: 5, content: "Il fait des merveilles sur les photos de nuit." },
    ],
  },
  {
    id: "clvx0009",
    slug: "preset-lightroom-mariage",
    title: "Preset Lightroom — Mariage",
    description:
      "Un pack de 3 presets aux tons clairs et naturels pour la photo de mariage : peau juste, tenues éclatantes et ambiances douces.",
    priceCents: 1500,
    compareAtPriceCents: 1900,
    category: PRODUCT_CATEGORIES[3],
    downloads: 760,
    accent: "bg-gradient-to-br from-amber-500 to-orange-600",
    reviews: [
      { authorName: "Julie N.", rating: 5, content: "Le pack mariage est d'un naturel incroyable sur les robes.", isVerified: true },
      { authorName: "Romain C.", rating: 4, content: "Très bons tons, je recommande pour les photos en extérieur." },
    ],
  },
  {
    id: "clvx0010",
    slug: "cv-moderne-ats",
    title: "CV moderne compatible ATS",
    description:
      "Un CV sobre et professionnel, structuré pour passer les logiciels de recrutement (ATS). Versions couleur et noir & blanc, guide de personnalisation inclus.",
    priceCents: 700,
    category: PRODUCT_CATEGORIES[4],
    downloads: 4300,
    accent: "bg-gradient-to-br from-gray-700 to-gray-900",
    reviews: [
      { authorName: "Yassine H.", rating: 5, content: "Trois entretiens en deux semaines, merci !", isVerified: true },
      { authorName: "Manon L.", rating: 5, content: "Très propre, facile à remplir, le format ATS est un vrai plus." },
    ],
  },
  {
    id: "clvx0011",
    slug: "cv-creatif-freelance",
    title: "CV créatif freelance (Canva)",
    description:
      "Un CV original pour les métiers créatifs : graphistes, développeurs, communicants. Design moderne, double colonne et 3 palettes de couleurs.",
    priceCents: 1100,
    compareAtPriceCents: 1500,
    category: PRODUCT_CATEGORIES[4],
    downloads: 1900,
    accent: "bg-gradient-to-br from-violet-500 to-indigo-700",
    reviews: [
      { authorName: "Lucas D.", rating: 5, content: "Le design fait vraiment la différence dans mon secteur.", isVerified: true },
    ],
  },
  {
    id: "clvx0012",
    slug: "pack-bureau-notion-excel",
    title: "Pack Bureau — Notion + Excel",
    description:
      "Le duo gagnant pour s'organiser : le gestionnaire de tâches Notion et le budget personnel Excel, regroupés dans un pack économique.",
    priceCents: 2400,
    compareAtPriceCents: 3100,
    category: PRODUCT_CATEGORIES[0],
    isBundle: true,
    downloads: 640,
    accent: "bg-gradient-to-br from-indigo-600 to-emerald-600",
    reviews: [
      { authorName: "Anais V.", rating: 5, content: "Deux outils indispensables à prix reduit.", isVerified: true },
    ],
  },
];

export function getDemoProduct(slug: string): DemoProduct | undefined {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}