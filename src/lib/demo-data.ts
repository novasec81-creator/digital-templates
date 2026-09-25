export type ProductVisual = "notion" | "excel" | "canva" | "lightroom" | "cv" | "bundle";

export interface DemoCategory {
  name: string;
  slug: string;
  tagline: string;
  blurb: string;
  visual: Exclude<ProductVisual, "bundle">;
}

export interface DemoProduct {
  id: string;
  slug: string;
  title: string;
  /** Ligne courte, affichée sous le titre sur les cartes. */
  tagline: string;
  description: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
  category: Pick<DemoCategory, "name" | "slug">;
  isBundle?: boolean;
  /** Uniquement pour identifier les récentes ajoutées (sélection éditoriale). */
  isNew?: boolean;
  /** Motif du visuel illustratif (remplaçable par de vraies captures). */
  visual: ProductVisual;
  /** Défini pour les 3 catégories hors bundle, sert aussi de fond. */
  accent: string;
  /**
   * Vraies captures d'écran (chemin public, ex. "/images/notion-taches-1.png").
   * Tant que ce tableau est vide, un visuel illustratif de type (non trompeur)
   * est affiché à la place.
   */
  images: string[];
  /** « Ce que vous obtenez » : cartes/liste sous la fiche. */
  includes: string[];
  /** Fonctionnalités mises en avant. */
  features: string[];
  /** Profils auxquels le template peut être utile. */
  forWhom: string[];
}

/** Pack éditorial : regroupe des produits réels du catalogue à prix réduit. */
export interface DemoBundle {
  id: string;
  title: string;
  tagline: string;
  description: string;
  /** Slugs des produits du catalogue inclus dans le pack. */
  memberSlugs: string[];
  packPriceCents: number;
  accent: string;
}

export const PRODUCT_CATEGORIES: DemoCategory[] = [
  {
    name: "Notion",
    slug: "notion",
    tagline: "Organisation & productivité",
    blurb: "Bases reliées, vues et automatisations pour structurer vos projets.",
    visual: "notion",
  },
  {
    name: "Excel & Sheets",
    slug: "excel",
    tagline: "Tableurs & suivis",
    blurb: "Suivis clairs, graphiques automatiques et projections fiables.",
    visual: "excel",
  },
  {
    name: "Canva",
    slug: "canva",
    tagline: "Visuels & réseaux sociaux",
    blurb: "Carrousels, mockups et documents prêts à publier en quelques clics.",
    visual: "canva",
  },
  {
    name: "Presets Lightroom",
    slug: "lightroom",
    tagline: "Rendus photo cohérents",
    blurb: "Des ambiances définies, appliquables en un clic à vos séries.",
    visual: "lightroom",
  },
  {
    name: "CV",
    slug: "cv",
    tagline: "Documents de carrière",
    blurb: "Des modèles sobres et structurés pour valoriser votre profil.",
    visual: "cv",
  },
];

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: "clvx0001",
    slug: "gestionnaire-de-taches-notion",
    title: "Gestionnaire de tâches Notion",
    tagline: "Projets et priorités, reliés automatiquement",
    description:
      "Un tableau de bord complet pour organiser vos tâches, vos projets et vos priorités. Modules pour le workflow quotidien, la vue hebdomadaire et le suivi des objectifs, reliés entre eux automatiquement.",
    priceCents: 1900,
    compareAtPriceCents: 2900,
    category: { name: "Notion", slug: "notion" },
    isNew: true,
    visual: "notion",
    accent: "bg-gradient-to-br from-indigo-500 to-purple-600",
    images: [],
    includes: [
      "Base Notion complète, prête à dupliquer",
      "Vues : quotidienne, hebdomadaire, projets, objectifs",
      "Guide de démarrage pas à pas",
      "Automatisations incluses (boutons et filtres)",
    ],
    features: [
      "Points de vue reliés entre eux",
      "Suivi visuel de la charge de travail",
      "Rappels et vues de filtrage rapides",
      "Structure claire et personnalisable",
    ],
    forWhom: [
      "Étudiants qui veulent structurer leurs sessions",
      "Salariés qui suivent plusieurs projets en parallèle",
      "Indépendants qui centralisent leurs priorités",
    ],
  },
  {
    id: "clvx0002",
    slug: "vie-360-notion",
    title: "Base Notion — Vie 360°",
    tagline: "Vie privée et pro au même endroit",
    description:
      "Organisez votre vie privée et professionnelle au même endroit : objectifs, habitudes, finances, projets perso et santé. Une base unique, reliée et évolutive.",
    priceCents: 2400,
    category: { name: "Notion", slug: "notion" },
    visual: "notion",
    accent: "bg-gradient-to-br from-emerald-500 to-teal-600",
    images: [],
    includes: [
      "Base unique « Vie 360° » avec 6 modules",
      "Vue annuelle pour vos objectifs",
      "Suivi d'habitudes et de rythme de vie",
      "Guide de personnalisation inclus",
    ],
    features: [
      "Modules reliés entre eux",
      "Vision trimestrielle et annuelle",
      "Recherche et filtres intégrés",
      "Ajout de modules simple",
    ],
    forWhom: [
      "Personnes qui veulent centraliser leur organisation perso",
      "Indépendants qui mêlent vie pro et vie privée",
      "Toute personne qui teste Notion pour la première fois",
    ],
  },
  {
    id: "clvx0003",
    slug: "base-clients-freelance-notion",
    title: "Base clients freelances (Notion)",
    tagline: "Pipeline, devis et facturation suivis",
    description:
      "Gérez votre pipeline clients : prospection, devis, statut des missions, facturation et suivi des paiements. Parfait pour indépendants et petites agences.",
    priceCents: 2900,
    compareAtPriceCents: 3900,
    category: { name: "Notion", slug: "notion" },
    isNew: true,
    visual: "notion",
    accent: "bg-gradient-to-br from-blue-500 to-cyan-600",
    images: [],
    includes: [
      "Base clients complète (prospection → paiement)",
      "Vues pipeline, missions et relances",
      "Modèle de fiche devis",
      "Tableau de bord de chiffre d'affaires",
    ],
    features: [
      "Statuts de mission clairs",
      "Relances de paiement organisées",
      "Données centralisées par client",
      "Structure mutable sans coder",
    ],
    forWhom: [
      "Freelances en activité",
      "Petites agences en croissance",
      "Auto-entrepreneurs qui facturent plusieurs clients",
    ],
  },
  {
    id: "clvx0004",
    slug: "budget-personnel-excel",
    title: "Budget personnel (Excel)",
    tagline: "Dépenses, épargne et projection",
    description:
      "Un suivi mensuel simple et automatisé : dépenses, épargne, objectifs. Graphiques automatiques, catégories en un clic et projection sur 12 mois.",
    priceCents: 1200,
    category: { name: "Excel & Sheets", slug: "excel" },
    isNew: true,
    visual: "excel",
    accent: "bg-gradient-to-br from-green-500 to-emerald-700",
    images: [],
    includes: [
      "Fichier Excel (ou version Google Sheets)",
      "Saisie mensuelle guidée",
      "Graphiques automatiques",
      "Projection annuelle incluse",
    ],
    features: [
      "Catégories de dépenses prédéfinies",
      "Épargne et objectifs suivis en une ligne",
      "Totaux et soldes calculés automatiquement",
      "Fonctionne sans formules à écrire",
    ],
    forWhom: [
      "Particuliers qui veulent voir clair dans leurs dépenses",
      "Couples qui tiennent un budget commun",
      "Jeunes actifs qui démarrent une épargne",
    ],
  },
  {
    id: "clvx0005",
    slug: "suivi-ca-freelance-excel",
    title: "Suivi CA freelance (Excel)",
    tagline: "Revenus, charges, TVA, bénéfices",
    description:
      "Pilotez votre chiffre d'affaires : revenus, charges, TVA et bénéfices mois par mois. Synthèse automatique pour votre bilan et vos déclarations.",
    priceCents: 1600,
    compareAtPriceCents: 2100,
    category: { name: "Excel & Sheets", slug: "excel" },
    visual: "excel",
    accent: "bg-gradient-to-br from-lime-500 to-green-700",
    images: [],
    includes: [
      "Fichier Excel (ou Google Sheets)",
      "Suivi mensuel revenus / charges",
      "Calcul TVA et bénéfices automatiques",
      "Synthèse annuelle exportable",
    ],
    features: [
      "Indicateurs clefs visibles d'un coup d'œil",
      "Modèlestation par catégorie de charges",
      "Vue mois par mois ou cumulée",
      "Prêt pour vos relevés",
    ],
    forWhom: [
      "Indépendants en micro-entreprise",
      "Freelances qui facturent à plusieurs clients",
      "Petites structures qui préparent leur bilan",
    ],
  },
  {
    id: "clvx0006",
    slug: "kit-carrousels-instagram-canva",
    title: "Kit carrousels Instagram (Canva)",
    tagline: "20 pages à publier dès aujourd'hui",
    description:
      "20 pages modèles pour créer des carrousels qui vendent : accroche, problématique, étapes, appel à l'action. Tailles optimisées pour Instagram, LinkedIn et Facebook.",
    priceCents: 2200,
    compareAtPriceCents: 3200,
    category: { name: "Canva", slug: "canva" },
    isNew: true,
    visual: "canva",
    accent: "bg-gradient-to-br from-pink-500 to-rose-600",
    images: [],
    includes: [
      "20 pages Canva modifiables",
      "Formats 1080×1350 et 1080×1080",
      "Banque de variantes par page",
      "Lien de duplication du modèle",
    ],
    features: [
      "Structure de vente en 6 temps",
      "Typographies et palettes intégrées",
      "Pages réutilisables en stories",
      "Suggestions de légendes incluses",
    ],
    forWhom: [
      "Créatrices et créateurs de contenu",
      "Coach.e.s et formatrices qui vendent en ligne",
      "Marques qui publient de façon régulière",
    ],
  },
  {
    id: "clvx0007",
    slug: "mockups-livres-numeriques-canva",
    title: "Pack mockups e-book (Canva)",
    tagline: "Présentez vos produits digitaux",
    description:
      "Des mockups réalistes pour présenter vos livres numériques et produits digitaux : appareils, fonds de scène et compositions prêtes à l'emploi.",
    priceCents: 1800,
    category: { name: "Canva", slug: "canva" },
    visual: "canva",
    accent: "bg-gradient-to-br from-fuchsia-500 to-purple-700",
    images: [],
    includes: [
      "10 compositions mockups modifiables",
      "Scènes : smartphone, ordinateur, tablette",
      "Fonds neutres et décorés",
      "Instructions d'utilisation pas à pas",
    ],
    features: [
      "Glisser-déposer de votre visuel",
      "Plusieurs perspectives par appareil",
      "Formats pour réseaux sociaux inclus",
      "Personnalisation libre des couleurs",
    ],
    forWhom: [
      "Créateurs de e-books et formations",
      "Vendeurs de produits digitaux",
      "Designers qui mettent en scène leurs créations",
    ],
  },
  {
    id: "clvx0008",
    slug: "preset-lightroom-urbain",
    title: "Preset Lightroom — Urbain",
    tagline: "Contraste et effet cinématique",
    description:
      "Un rendu contrasté et cinématique pour la photo de rue et d'architecture. Fichier .xmp universel pour Lightroom desktop et mobile.",
    priceCents: 900,
    category: { name: "Presets Lightroom", slug: "lightroom" },
    visual: "lightroom",
    accent: "bg-gradient-to-br from-slate-600 to-slate-800",
    images: [],
    includes: [
      "Fichier preset .xmp (Lightroom desktop)",
      "Version mobile incluse",
      "Guide d'installation en 3 étapes",
      "Conseils d'utilisation par lumière",
    ],
    features: [
      "Rendu cinématique signé",
      "Préserve les hautes lumières",
      "Fonctionne avec vos propres réglages",
      "Ajustable par série de photos",
    ],
    forWhom: [
      "Photographes de rue et d'architecture",
      "Créateurs de contenu urbain",
      "Amateurs de photos de voyage",
    ],
  },
  {
    id: "clvx0009",
    slug: "preset-lightroom-mariage",
    title: "Preset Lightroom — Mariage",
    tagline: "3 presets aux tons naturels",
    description:
      "Un pack de 3 presets aux tons clairs et naturels pour la photo de mariage : peau juste, tenues éclatantes et ambiances douces.",
    priceCents: 1500,
    compareAtPriceCents: 1900,
    category: { name: "Presets Lightroom", slug: "lightroom" },
    visual: "lightroom",
    accent: "bg-gradient-to-br from-amber-500 to-orange-600",
    images: [],
    includes: [
      "3 fichiers preset .xmp",
      "Versions mobiles incluses",
      "Guide d'installation",
      "Exemples de réglages avant / après",
    ],
    features: [
      "Rendus clairs et naturels",
      "Pensés peau et matières (robe, costumes)",
      "Cohérence entre les photos d'un même reportage",
      "Ajustables facilement par lot",
    ],
    forWhom: [
      "Photographes de mariage",
      "Reporters d'événements",
      "Photographes portrait en extérieur",
    ],
  },
  {
    id: "clvx0010",
    slug: "cv-moderne-ats",
    title: "CV moderne compatible ATS",
    tagline: "Sobre, structuré, lu par les machines",
    description:
      "Un CV sobre et professionnel, structuré pour passer les logiciels de recrutement (ATS). Versions couleur et noir & blanc, guide de personnalisation inclus.",
    priceCents: 700,
    category: { name: "CV", slug: "cv" },
    visual: "cv",
    accent: "bg-gradient-to-br from-gray-700 to-gray-900",
    images: [],
    includes: [
      "Modèle CV .docx structuré (ATS)",
      "Version couleur et noir & blanc",
      "Guide de remplissage",
      "Lettre de motivation assortie",
    ],
    features: [
      "Hiérarchie claire pour les ATS",
      "Une page, avec une structure orientée résultats",
      "Polices et marges standard",
      "Export PDF recommandé inclus",
    ],
    forWhom: [
      "Candidats sur postes corporate",
      "Jeunes diplômés en recherche",
      "Professionnels qui changent de secteur",
    ],
  },
  {
    id: "clvx0011",
    slug: "cv-creatif-freelance",
    title: "CV créatif freelance (Canva)",
    tagline: "Original, sans perdre en lisibilité",
    description:
      "Un CV original pour les métiers créatifs : graphistes, développeurs, communicants. Design moderne, double colonne et 3 palettes de couleurs.",
    priceCents: 1100,
    compareAtPriceCents: 1500,
    category: { name: "CV", slug: "cv" },
    visual: "cv",
    accent: "bg-gradient-to-br from-violet-500 to-indigo-700",
    images: [],
    includes: [
      "Modèle Canva double colonne",
      "3 palettes de couleurs",
      "Version portrait et paysage",
      "Guide de personnalisation",
    ],
    features: [
      "Design différenciant mais lisible",
      "Sections adaptées aux profils créatifs",
      "Mise à jour rapide des contenus",
      "Export PDF et image via Canva",
    ],
    forWhom: [
      "Graphistes et directeurs artistiques",
      "Développeurs qui valorisent leur style",
      "Communicants et créateurs de contenu",
    ],
  },
  {
    id: "clvx0012",
    slug: "pack-bureau-notion-excel",
    title: "Pack Bureau — Notion + Excel",
    tagline: "Le duo organisation + budget",
    description:
      "Le duo gagnant pour s'organiser : le gestionnaire de tâches Notion et le budget personnel Excel, regroupés dans un pack économique.",
    priceCents: 2400,
    compareAtPriceCents: 3100,
    category: { name: "Notion", slug: "notion" },
    isBundle: true,
    visual: "bundle",
    accent: "bg-gradient-to-br from-indigo-600 to-emerald-600",
    images: [],
    includes: [
      "Gestionnaire de tâches Notion",
      "Budget personnel Excel (ou Sheets)",
      "2 guides de démarrage",
      "Pack facturé en une seule commande",
    ],
    features: [
      "Deux produits complémentaires",
      "Réduction incluse par rapport à l'achat séparé",
      "Fichiers livrés ensemble, par email",
      "Personnalisation indépendante de chaque outil",
    ],
    forWhom: [
      "Professionnels qui s'organisent tout-en-un",
      "Indépendants qui veulent ordre + budget",
      "Toute personne débutant avec Notion et Excel",
    ],
  },
];

/**
 * Packs éditoriaux à partir de produits réels du catalogue.
 * Les prix sont calculés à partir des prix unitaires affichés.
 */
export const DEMO_BUNDLES: DemoBundle[] = [
  {
    id: "bundle-freelance",
    title: "Pack Freelance",
    tagline: "3 ressources pour piloter votre activité",
    description:
      "Organisation, pipeline clients et chiffre d'affaires : les trois outils indispensables d'un indépendant, regroupés.",
    memberSlugs: [
      "gestionnaire-de-taches-notion",
      "base-clients-freelance-notion",
      "suivi-ca-freelance-excel",
    ],
    packPriceCents: 4299,
    accent: "bg-gradient-to-br from-blue-600 to-indigo-700",
  },
  {
    id: "bundle-photographe",
    title: "Pack Photographe",
    tagline: "Urbain + mariage, deux ambiances",
    description:
      "Les deux packs de presets pour couvrir la rue et les événements avec un rendu cohérent.",
    memberSlugs: ["preset-lightroom-urbain", "preset-lightroom-mariage"],
    packPriceCents: 1800,
    accent: "bg-gradient-to-br from-slate-700 to-amber-600",
  },
  {
    id: "bundle-cv",
    title: "Pack CV",
    tagline: "ATS + créatif pour toutes vos candidatures",
    description:
      "Un CV structuré pour les machines et un CV créatif pour se distinguer : couvrez les deux cas.",
    memberSlugs: ["cv-moderne-ats", "cv-creatif-freelance"],
    packPriceCents: 1299,
    accent: "bg-gradient-to-br from-gray-700 to-violet-700",
  },
];

export function getDemoProduct(slug: string): DemoProduct | undefined {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string): DemoProduct[] {
  return DEMO_PRODUCTS.filter((p) => p.category.slug === slug);
}

export function resolveBundleMembers(bundle: DemoBundle) {
  return bundle.memberSlugs
    .map(getDemoProduct)
    .filter((p): p is DemoProduct => Boolean(p));
}

export function bundleSeparateTotal(bundle: DemoBundle): number {
  const members = resolveBundleMembers(bundle);
  return members.reduce((sum, p) => sum + p.priceCents, 0);
}

export const isNewProducts = DEMO_PRODUCTS.filter((p) => p.isNew);

/** FAQ générique par type de produit — réponses conformes au fonctionnement réel du site. */
export const PRODUCT_FAQ_BY_VISUAL: Record<
  ProductVisual,
  Array<{ q: string; a: string }>
> = {
  notion: [
    {
      q: "Comment reçois-je le template après commande ?",
      a: "Après confirmation de votre commande par email, le fichier est envoyé par email : vous y trouverez le lien de duplication de la base Notion.",
    },
    {
      q: "Quelles sont les conditions requises ?",
      a: "Un compte Notion gratuit (ou payant) suffit. La base se duplique dans votre espace de travail en quelques secondes.",
    },
    {
      q: "Puis-je le personnaliser ?",
      a: "Oui, la base est entièrement modifiable : propriétés, vues, et automatisations peuvent être adaptées à votre usage.",
    },
  ],
  excel: [
    {
      q: "Comment reçois-je le fichier ?",
      a: "Après confirmation de votre commande, le fichier Excel (ou un lien Google Sheets si vous préférez) est envoyé par email.",
    },
    {
      q: "Faut-il des connaissances en formules ?",
      a: "Non : les calculs, totaux et graphiques sont déjà intégrés. Il suffit de saisir vos montants.",
    },
    {
      q: "Puis-je le modifier ?",
      a: "Oui, tous les onglets et formules sont accessibles et modifiables normalement.",
    },
  ],
  canva: [
    {
      q: "Comment puis-je utiliser le modèle ?",
      a: "Après commande, vous recevez un lien de duplication du modèle Canva par email, depuis votre propre compte.",
    },
    {
      q: "Ai-je besoin d'un compte Canva Pro ?",
      a: "Un compte gratuit suffit pour modifier ces modèles. Certaines ressources intégrées peuvent suggérer des éléments Pro.",
    },
    {
      q: "Puis-je l'adapter à ma marque ?",
      a: "Oui : remplacez les couleurs, typographies et visuels via l'outil « style » de Canva.",
    },
  ],
  lightroom: [
    {
      q: "Comment installer les presets ?",
      a: "Le guide joint indique comment importer les fichiers .xmp dans Lightroom desktop ou mobile. Après confirmation, un email vous transmet les fichiers et le guide.",
    },
    {
      q: "Sur quelles photos les utiliser ?",
      a: "Les presets sont pensés pour une ambiance donnée. Ajustez l'exposition ou les tons si besoin : ils restent le point de départ de votre rendu.",
    },
    {
      q: "Les fichiers sont-ils compatibles ?",
      a: "Oui, les .xmp fonctionnent avec Lightroom Classic, Lightroom CC et les versions mobiles.",
    },
  ],
  cv: [
    {
      q: "Quel format recevrai-je ?",
      a: "Après confirmation, le modèle (fichier .docx ou lien de duplication Canva) et son guide de remplissage sont envoyés par email.",
    },
    {
      q: "Puis-je utiliser le même modèle pour plusieurs candidatures ?",
      a: "Oui : dupliquez le fichier pour chaque candidature et adaptez les contenus.",
    },
    {
      q: "Le format ATS est-il vraiment respecté ?",
      a: "Le modèle ATS utilise une structure simple, des polices standard et un ordonnancement lisible pour les robots de recrutement.",
    },
  ],
  bundle: [
    {
      q: "Comment le pack est-il livré ?",
      a: "Après confirmation de la commande, l'ensemble des fichiers du pack est envoyé dans un email : liens de duplication et fichiers.",
    },
    {
      q: "Puis-je acheter uniquement un des éléments ?",
      a: "Oui, chaque produit reste disponible individuellement dans le catalogue : le pack offre simplement un tarif réduit.",
    },
  ],
};

export function defaultProductMeta(visual: ProductVisual) {
  switch (visual) {
    case "notion":
      return { label: "Base Notion", motif: "grid" };
    case "excel":
      return { label: "Tableur", motif: "table" };
    case "canva":
      return { label: "Modèle Canva", motif: "layers" };
    case "lightroom":
      return { label: "Preset Lightroom", motif: "photo" };
    case "cv":
      return { label: "Modèle de document", motif: "document" };
    case "bundle":
      return { label: "Pack de templates", motif: "stack" };
  }
}