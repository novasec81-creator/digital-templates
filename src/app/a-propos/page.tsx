import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONTACT, DELIVERY, STORE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "À propos",
  description: `À propos de ${STORE_NAME} : une vitrine de templates numériques conçus pour être utiles immédiatement.`,
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        À propos de {STORE_NAME}
      </h1>

      <div className="mt-8 space-y-5 leading-relaxed text-ink-2">
        <p>
          {STORE_NAME} est une vitrine de templates numériques : bases
          d&apos;organisation Notion, tableurs Excel et Google Sheets, modèles
          Canva, presets Lightroom et modèles de CV.
        </p>
        <p>
          L&apos;idée est simple : une ressource conçue une seule fois, puis
          proposée dans un format prêt à l&apos;emploi. Vous gagnez des heures
          sur l&apos;installation, et vous gardez la liberté de tout adapter
          dans votre outil habituel.
        </p>
        <p>
          Chaque template est décrit tel qu&apos;il est livré, dans sa fiche
          produit, avec son contenu réel et son prix. Sur la page d&apos;accueil,
          vous trouverez aussi une sélection des ressources de la vitrine,
          mise à jour régulièrement.
        </p>

        <div className="rounded-2xl border border-line bg-paper-2 p-6">
          <h2 className="text-base font-bold text-ink">
            Comment se passe une commande ?
          </h2>
          <ol className="mt-4 space-y-3">
            {DELIVERY.steps.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line bg-paper text-xs font-extrabold text-clay"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{step.title}</p>
                  <p className="text-sm text-ink-2">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-ink-3">{DELIVERY.details}</p>
        </div>

        <p>
          Une question, une suggestion ou un besoin spécifique ?{" "}
          <Link
            href="/contact"
            className="font-semibold text-ink underline decoration-clay underline-offset-4 transition-colors hover:text-clay"
          >
            Écrivez-nous
          </Link>
          {CONTACT.responseDelay && ` — ${CONTACT.responseDelay.toLowerCase()}`}
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          href="/produits"
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-black"
        >
          Explorer le catalogue
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="/faq"
          className="inline-flex items-center rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
        >
          Consulter la FAQ
        </Link>
      </div>
    </section>
  );
}