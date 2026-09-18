import { formatPrice } from "@/lib/utils";

export const STORE_NAME = "Templates Store";
export const STORE_SLOGAN =
  "Des templates numériques prêts à l'emploi : Notion, Excel, Canva, Lightroom, CV.";

export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "EUR";

export function price(cents: number) {
  return formatPrice(cents, CURRENCY);
}

export const DOWNLOAD_LINK_TTL_HOURS = 72;
export const DOWNLOAD_MAX_PER_TOKEN = 5;

export const STORE_LEGAL = {
  editorName: process.env.STORE_LEGAL_NAME ?? "Votre entreprise — à compléter",
  host: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA",
  email: process.env.EMAIL_REPLY_TO ?? "support@exemple.fr",
  address: "Adresse de l'éditeur — à compléter",
  siret: "SIRET à compléter",
  vatNumber: process.env.STORE_VAT_NUMBER ?? "TVA à compléter",
};