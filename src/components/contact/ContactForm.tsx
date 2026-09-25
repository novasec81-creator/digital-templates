"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { contactSchema } from "@/lib/validations";
import { price, STORE_NAME } from "@/lib/constants";
import { DEMO_BUNDLES, DEMO_PRODUCTS } from "@/lib/demo-data";
import { getDiscountPercent } from "@/lib/utils";

function useConcern() {
  const params = useSearchParams();
  const produitSlug = params.get("produit");
  const packId = params.get("pack");

  const product = produitSlug
    ? DEMO_PRODUCTS.find((p) => p.slug === produitSlug) ?? null
    : null;
  const pack = packId ? DEMO_BUNDLES.find((b) => b.id === packId) ?? null : null;

  if (pack && !product) {
    const members = pack.memberSlugs
      .map((slug) => DEMO_PRODUCTS.find((p) => p.slug === slug))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
    const total = members.reduce((sum, m) => sum + m.priceCents, 0);
    const discount = getDiscountPercent(pack.packPriceCents, total);
    return {
      label: pack.title,
      detail: `${price(pack.packPriceCents)}${
        discount && total > pack.packPriceCents
          ? ` au lieu de ${price(total)} (économie de ${price(total - pack.packPriceCents)})`
          : ""
      } · Pack de ${members.length} ressources`,
      subject: `Commande — ${pack.title}`,
      message: `Bonjour,\n\nJe souhaite commander le pack « ${pack.title} » (${price(
        pack.packPriceCents
      )}). Merci d'avance.`,
    };
  }

  if (product) {
    return {
      label: product.title,
      detail: `${price(product.priceCents)} · ${product.category.name}`,
      subject: `Commande — ${product.title}`,
      message: `Bonjour,\n\nJe souhaite commander le template « ${
        product.title
      } » (${price(product.priceCents)}). Merci d'avance.`,
    };
  }

  return null;
}

export function ContactForm({ email }: { email: string }) {
  const concern = useConcern();

  const [state, setState] = useState(() => ({
    name: "",
    email: "",
    subject: concern?.subject ?? "",
    message: concern?.message ?? "",
  }));
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function update<K extends keyof typeof state>(key: K, value: string) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsed = contactSchema.safeParse(state);
    if (!parsed.success) {
      setError("Merci de remplir correctement tous les champs obligatoires.");
      setStatus("error");
      return;
    }

    const subject = `[${STORE_NAME}] ${parsed.data.subject || "Demande de contact"}`;
    const body = [
      `Nom : ${parsed.data.name}`,
      `Email de réponse : ${parsed.data.email}`,
      "",
      parsed.data.message,
    ].join("\n");

    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-line bg-paper-2 px-5 py-4 text-sm text-ink-2">
        Votre messagerie s&apos;est ouverte avec le message pré-rempli. Il ne
        vous reste qu&apos;à l&apos;envoyer. Merci !
      </div>
    );
  }

  const fields = [
    { key: "name" as const, label: "Nom", type: "text", required: true },
    { key: "email" as const, label: "Votre email", type: "email", required: true },
    { key: "subject" as const, label: "Sujet", type: "text", required: false },
  ];

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3 transition-colors focus:border-line-strong";

  return (
    <form onSubmit={submit} className="space-y-4">
      {concern && (
        <div className="rounded-xl border border-clay/25 bg-clay/5 px-4 py-3 text-sm leading-relaxed">
          <span className="font-semibold text-ink">Votre demande concerne :</span>{" "}
          <span className="text-ink">
            {concern.label} — <span className="text-ink-2">{concern.detail}.</span>
          </span>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key}>
            <label htmlFor={f.key} className="block text-sm font-medium text-ink-2">
              {f.label} {f.required && <span className="text-clay">*</span>}
            </label>
            <input
              id={f.key}
              type={f.type}
              required={f.required}
              value={state[f.key]}
              onChange={(e) => update(f.key, e.target.value)}
              className={inputClass}
            />
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink-2">
          Message <span className="text-clay">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={state.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Le template qui vous intéresse, votre projet, vos questions…"
          className={`${inputClass} resize-none`}
        />
      </div>
      {concern && (
        <p className="text-xs text-ink-3">
          Le sujet et le message ci-dessus sont pré-remplis pour accélérer votre
          commande — libre à vous de les modifier.
        </p>
      )}
      {error && <p className="text-sm text-clay">{error}</p>}
      <button
        type="submit"
        className="rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-black"
      >
        Envoyer le message
      </button>
    </form>
  );
}