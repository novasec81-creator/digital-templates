import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Passez commande ou posez vos questions : chaque message est traité directement par email.",
};

export default function ContactPage() {
  const email = CONTACT.email;
  const hasEmail = email.trim() !== "";

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Nous contacter
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed text-ink-2">
        Une question sur un template, un pack, ou une demande de commande ?
        Écrivez-nous : chaque message est lu et traité directement.
      </p>

      <div className="mt-8">
        {hasEmail ? (
          <div className="rounded-2xl border border-line bg-paper p-6 shadow-card sm:p-8">
            <Suspense
              fallback={
                <div className="grid animate-pulse gap-4">
                  <div className="h-12 rounded-xl bg-paper-2" />
                  <div className="h-40 rounded-xl bg-paper-2" />
                </div>
              }
            >
              <ContactForm email={email} />
            </Suspense>
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-sm text-ink-2">
                Ou écrivez-nous directement :{" "}
                <a
                  href={`mailto:${email}`}
                  className="font-semibold text-ink underline decoration-clay underline-offset-4 transition-colors hover:text-clay"
                >
                  {email}
                </a>
              </p>
              <p className="mt-1.5 text-xs text-ink-3">{CONTACT.responseDelay}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line-strong bg-paper-2 p-8 text-center">
            <h2 className="text-lg font-bold text-ink">
              Coordonnées de contact en cours de configuration
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-2">
              L&apos;adresse de contact finale n&apos;est pas encore renseignée.
              En attendant, la FAQ répond aux questions les plus courantes sur
              le fonctionnement des templates.
            </p>
            <a
              href="/faq"
              className="mt-6 inline-flex items-center rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-black"
            >
              Consulter la FAQ
            </a>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink-3">
        En nous écrivant, vous acceptez que vos nom, adresse email et message
        soient utilisés uniquement pour vous répondre. Voir notre{" "}
        <a
          href="/confidentialite"
          className="font-medium text-ink underline underline-offset-4 transition-colors hover:text-clay"
        >
          politique de confidentialité
        </a>
        .
      </p>
    </section>
  );
}