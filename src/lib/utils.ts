export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(cents: number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

/**
 * Calcul centralisé d'une réduction (prix barré).
 * Retourne null si aucun prix de comparaison valide n'est fourni.
 * Économie et pourcentage sont toujours dérivés des mêmes prix, partout.
 */
export function getDiscountPercent(
  priceCents: number,
  compareAtPriceCents?: number | null
): number | null {
  if (!compareAtPriceCents || compareAtPriceCents <= priceCents) return null;
  return Math.round(
    ((compareAtPriceCents - priceCents) / compareAtPriceCents) * 100
  );
}

export function generateToken(bytes = 32) {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}