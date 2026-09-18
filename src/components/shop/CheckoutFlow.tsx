"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/components/providers/CartProvider";
import { price } from "@/lib/constants";
import { trackClient } from "@/lib/analytics";

export type CheckoutLine = {
  id: string;
  title: string;
  slug: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
  previewImages: string[];
};

type PromoState = { code: string; discountCents: number; percent?: number } | null;

export function CheckoutFlow({
  lines,
  initialEmail,
}: {
  lines: CheckoutLine[];
  initialEmail: string;
}) {
  const router = useRouter();
  const { items, clear } = useCart();
  const [email, setEmail] = useState(initialEmail);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<PromoState>(null);
  const [promoStatus, setPromoStatus] = useState<"idle" | "loading" | "error">("idle");
  const [promoError, setPromoError] = useState("");
  const [waiveConsent, setWaiveConsent] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const detailed = items
    .map((item) => {
      const product = lines.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotal = detailed.reduce((s, d) => s + d.product.priceCents * d.quantity, 0);
  const discount = promo ? Math.min(promo.discountCents, subtotal) : 0;
  const total = Math.max(0, subtotal - discount);

  if (detailed.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">Votre panier est vide.</p>
      </div>
    );
  }

  async function applyPromo(e: React.FormEvent) {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setPromoStatus("loading");
    setPromoError("");
    const res = await fetch("/api/promo/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        cart: detailed.map((d) => ({ productId: d.product.id, quantity: d.quantity })),
      }),
    });
    const data = (await res.json().catch(() => null)) as
      | { ok: true; discountCents: number; percent?: number }
      | { ok: false; error: string }
      | null;
    if (!res.ok || !data || !data.ok) {
      setPromoStatus("error");
      setPromoError(data && "error" in data ? data.error : "Code promo invalide.");
      setPromo(null);
      return;
    }
    setPromoStatus("idle");
    setPromo({ code, discountCents: data.discountCents, percent: data.percent });
    trackClient("promo_applied", { promo_code: code });
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPaying(true);
    trackClient("begin_checkout", {
      items: detailed.map((d) => ({
        item_id: d.product.id,
        item_name: d.product.title,
        quantity: d.quantity,
        price: d.product.priceCents / 100,
      })),
    });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          items: detailed.map((d) => ({ productId: d.product.id, quantity: d.quantity })),
          promoCode: promo?.code ?? null,
        }),
      });
      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!res.ok || !data?.url) {
        setError(data?.error ?? "Impossible de créer le paiement. Réessayez.");
        setPaying(false);
        return;
      }
      clear();
      trackClient("purchase", {
        items: detailed.map((d) => ({
          item_id: d.product.id,
          item_name: d.product.title,
          quantity: d.quantity,
          price: d.product.priceCents / 100,
        })),
        value: total / 100,
      });
      router.push(data.url);
    } catch {
      setError("Une erreur réseau est survenue. Réessayez.");
      setPaying(false);
    }
  }

  return (
    <form onSubmit={pay} className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Finaliser la commande</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold">Contact</h2>
            <label className="mt-3 block text-sm font-medium text-gray-700" htmlFor="email">
              Adresse email (facture + lien de téléchargement)
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="vous@exemple.fr"
            />
          </section>

          <section className="rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold">Code promo</h2>
            <div className="mt-3 flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="EXEMPLE10"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm uppercase focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              <button
                type="button"
                onClick={applyPromo}
                disabled={promoStatus === "loading"}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                {promoStatus === "loading" ? "…" : "Appliquer"}
              </button>
            </div>
            {promo && (
              <p className="mt-2 text-sm text-green-700">
                Code {promo.code} appliqué : remise de {price(promo.discountCents)}
                {promo.percent ? ` (${promo.percent} %)` : ""}.
              </p>
            )}
            {promoError && <p className="mt-2 text-sm text-red-600">{promoError}</p>}
          </section>

          <section className="rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold">Paiement</h2>
            <p className="mt-3 text-sm text-gray-600">
              La page de paiement sécurisée Stripe s&apos;ouvre ensuite : carte bancaire,
              Apple Pay ou Google Pay. Vos données bancaires transitent uniquement par
              Stripe (certifié PCI-DSS).
            </p>
            <label className="mt-4 flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                required
                checked={waiveConsent}
                onChange={(e) => setWaiveConsent(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Je renonce expressément à mon droit de rétractation (art. L221-28 du Code
                de la consommation) puisque ma commande consiste en la fourniture
                immédiate de contenus numériques, et j&apos;en accepte les CGV.
              </span>
            </label>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold">Votre commande</h2>
          <ul className="mt-4 space-y-3">
            {detailed.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3">
                <div className="relative aspect-[4/3] w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {product.previewImages[0] && (
                    <Image src={product.previewImages[0]} alt="" fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{product.title}</p>
                  <p className="text-xs text-gray-500">× {quantity}</p>
                </div>
                <span className="text-sm">{price(product.priceCents * quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Sous-total</dt>
              <dd>{price(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <dt>Remise ({promo?.code})</dt>
                <dd>-{price(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold">
              <dt>Total TTC</dt>
              <dd>{price(total)}</dd>
            </div>
          </dl>
          {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={paying || !waiveConsent || !email}
            className="mt-6 w-full rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {paying ? "Redirection sécurisée…" : "Payer maintenant"}
          </button>
          <p className="mt-3 text-center text-xs text-gray-500">
            Paiement crypté SSL · Powered by Stripe
          </p>
        </aside>
      </div>
    </form>
  );
}