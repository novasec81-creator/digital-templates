import type { DemoBundle, DemoProduct } from "@/lib/demo-data";
import { CONTACT } from "@/lib/constants";

/**
 * Actions d'achat centralisées.
 *
 * Le site n'a pas de paiement automatisé : la commande passe par la page
 * Contact, pré-remplie avec le produit ou le pack concerné. Toute URL de
 * commande doit être construite ici pour que le jour où un checkout (Stripe)
 * estbranché, il suffise de modifier ce module — et non chaque composant.
 *
 * Points de contact centralisés :
 * - `orderAction()` : l'URL d'achat d'un produit ou d'un pack ;
 * - `orderActionLabel()` : le libellé du bouton correspondant ;
 * - `orderNote()` : la micro-légende honnête affichée sous le bouton.
 */

/** Libellé commun des boutons de commande, quelle que soit la cible. */
const ORDER_LABEL = "Commander ce template";

export type OrderTarget =
  | { kind: "product"; product: DemoProduct }
  | { kind: "bundle"; bundle: DemoBundle };

/**
 * Construit l'URL de commande d'un produit.
 * Exemple : `/contact?produit=gestionnaire-de-taches-notion`.
 */
export function productOrderHref(product: Pick<DemoProduct, "slug">): string {
  return `/contact?produit=${encodeURIComponent(product.slug)}`;
}

/**
 * Construit l'URL de commande d'un pack.
 * Exemple : `/contact?pack=bundle-freelance`.
 */
export function bundleOrderHref(bundle: Pick<DemoBundle, "id">): string {
  return `/contact?pack=${encodeURIComponent(bundle.id)}`;
}

/** URL d'achat, quelle que soit la cible (produit ou pack). */
export function orderAction(target: OrderTarget): string {
  return target.kind === "product"
    ? productOrderHref(target.product)
    : bundleOrderHref(target.bundle);
}

/** Libellé du bouton d'achat correspondant à la cible. */
export function orderActionLabel(target: OrderTarget): string {
  return target.kind === "bundle" ? "Commander le pack" : ORDER_LABEL;
}

/**
 * Légende sous le bouton : décrit le fonctionnement réel (confirmation
 * manuelle puis envoi par email) sans promettre de paiement instantané.
 */
export function orderNote(): string {
  return CONTACT.orderNote;
}

/**
 * Le site peut-il envoyer un email via la page Contact ?
 * Tant que `STORE_CONTACT_EMAIL` est vide, le formulaire reste en état neutre
 * et les liens mailto ne doivent pas être générés.
 */
export function canEmailDirectly(): boolean {
  return Boolean(CONTACT.email);
}