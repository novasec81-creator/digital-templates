import { formatPrice } from "@/lib/utils";

/**
 * Configuration centrale du site.
 * Toutes les informations de marque, de contact et de livraison sont
 * centralisées ici : modifiez ce fichier (ou les variables d'environnement
 * correspondantes) pour mettre à jour l'ensemble du site.
 */

export const STORE_NAME = "Format";

export const STORE_SLOGAN =
  "Templates numériques pour Notion, Excel, Canva, Lightroom et CV — conçus pour être utiles immédiatement.";

export const STORE_DESCRIPTION =
  "Format — une sélection éditoriale de templates numériques prêts à l'emploi : organisation Notion, tableurs Excel et Google Sheets, modèles Canva, presets Lightroom et modèles de CV.";

export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "EUR";

export function price(cents: number) {
  return formatPrice(cents, CURRENCY);
}

/**
 * URL publique du site, utilisée pour le canonical, le sitemap, le robots,
 * l'Open Graph et le JSON-LD. Ne passe jamais par une valeur locale en
 * production : `requireSiteUrl()` fait échouer le build si elle manque.
 */
export const SITE_URL: string = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/+$/, "");

/**
 * Retourne l'URL publique. En production (build), une URL manquante est une
 * erreur bloquante : aucun canonical/sitemap/robots/OG ne doit être généré
 * avec une adresse locale par erreur. En développement, un avertissement
 * est affiché et une URL de secours locale est utilisée.
 */
export function requireSiteUrl(source: string): string {
  if (SITE_URL) return SITE_URL;
  const message = `[Format] ${source} : la variable d'environnement NEXT_PUBLIC_APP_URL est obligatoire en production (canonical, sitemap, robots, Open Graph, JSON-LD). Configurez-la avant de builder.`;
  if (process.env.NODE_ENV === "production") {
    throw new Error(message);
  }
  console.warn(message);
  return "http://localhost:3000";
}

/**
 * Coordonnées de contact. Laisser email vide affiche un état neutre.
 */

/**
 * Un outil de mesure d'audience est-il configuré (GTM / GA4 / Clarity) ?
 * Déterminé au build ; contrôle l'affichage du bandeau cookies et la
 * politique de confidentialité afin que le site ne décrive que ce qu'il fait.
 */
export const ANALYTICS_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_GTM_ID ||
    process.env.NEXT_PUBLIC_GA4_ID ||
    process.env.NEXT_PUBLIC_CLARITY_ID
);

export const DOWNLOAD_LINK_TTL_HOURS = 72;
export const DOWNLOAD_MAX_PER_TOKEN = 5;

/** Coordonnées de contact. Laisser email vide affiche un état neutre. */
export const CONTACT = {
  email: process.env.STORE_CONTACT_EMAIL ?? "",
  responseDelay: "Réponse sous 24 h ouvrées.",
  orderNote:
    "Les commandes sont confirmées manuellement : le template est ensuite envoyé par email, prêt à l'emploi.",
};

/** Processus de livraison réel du site (vitrine sans système de paiement automatisé). */
export const DELIVERY = {
  steps: [
    {
      title: "Explorez",
      text: "Parcourez le catalogue et repérez le template qui correspond à votre besoin.",
    },
    {
      title: "Commandez",
      text: "Envoyez votre demande via la page Contact. Nous confirmons par email la disponibilité et les modalités de règlement.",
    },
    {
      title: "Utilisez",
      text: "Après confirmation, vous recevez le fichier par email. Dupliquez-le et personnalisez-le immédiatement.",
    },
  ],
  details:
    "Chaque commande est traitée manuellement : il n'y a ni paiement automatisé ni téléchargement instantané. Vous recevez le template par email après confirmation de la commande.",
};

/** Informations légales (valeurs par défaut neutres — à compléter par l'éditeur). */
export const STORE_LEGAL = {
  editorName: process.env.STORE_LEGAL_NAME || "À compléter",
  host: "Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis",
  email: CONTACT.email,
  address: process.env.STORE_LEGAL_ADDRESS || "À compléter",
  siret: process.env.STORE_SIRET || "À compléter",
  vatNumber: process.env.STORE_VAT_NUMBER || "À compléter",
};