import type { Metadata } from "next";
import { ANALYTICS_CONFIGURED, CONTACT, STORE_LEGAL, STORE_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export const dynamic = "force-static";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">
        Politique de confidentialité
      </h1>
      <p className="mt-2 text-sm text-ink-3">
        Dernière mise à jour : septembre 2026 — Conforme au RGPD (UE 2016/679).
      </p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-ink-2">
        <section>
          <h2 className="text-lg font-semibold text-ink">1. Responsable du traitement</h2>
          <p className="mt-2">
            {STORE_NAME} — responsable du traitement des données collectées sur
            ce site. Contact pour vos droits :{" "}
            {CONTACT.email ? (
              <span className="font-medium text-ink">{CONTACT.email}</span>
            ) : (
              <span>
                via la page Contact (adresse directe en cours de configuration)
              </span>
            )}
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">2. Données collectées</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              Messages de contact : nom, adresse email et contenu du message.
            </li>
            <li>
              Données de commande : nom, adresse email, ressources demandées et
              échanges de confirmation (traités par email).
            </li>
<li>
            Cookies de fonctionnement : le cookie de consentement enregistrant
            votre choix d&apos;accepter ou de refuser la mesure d&apos;audience.
            {ANALYTICS_CONFIGURED
              ? " Si vous acceptez, les cookies de mesure correspondants sont également déposés."
              : ""}
          </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">3. Finalités et bases légales</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              Répondre aux demandes et gérer les commandes (mesures
              précontractuelles et exécution du contrat, art. 6.1.b RGPD).
            </li>
            <li>Obligations légales et comptables (art. 6.1.c RGPD).</li>
            {ANALYTICS_CONFIGURED && (
              <li>
                Mesure d&apos;audience, uniquement après votre consentement (art.
                6.1.a RGPD).
              </li>
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">4. Durées de conservation</h2>
          <p className="mt-2">
            Les échanges de commande et de facturation sont conservés le temps
            nécessaire à nos obligations légales (facturation : 10 ans). Le
            cookie de consentement, qui enregistre votre choix, est conservé 1
            an. {ANALYTICS_CONFIGURED
              ? "Les cookies de mesure d&apos;audience : 13 mois maximum (recommandation CNIL)."
              : ""}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">5. Sous-traitants et hébergement</h2>
          <p className="mt-2">
            Le site est hébergé par {STORE_LEGAL.host}. Les échanges par email
            sont gérés par notre messagerie.{" "}
            {ANALYTICS_CONFIGURED
              ? "Aucun script tiers de mesure n&apos;est chargé sans votre consentement explicite."
              : "Aucun service tiers de mesure d&apos;audience n&apos;est utilisé sur ce site pour le moment."}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">6. Cookies</h2>
          {ANALYTICS_CONFIGURED ? (
              <p className="mt-2">
                Un bandeau vous permet d&apos;accepter ou de refuser les cookies
                de mesure, avec le même niveau de simplicité dans les deux cas.
                Sans votre consentement, aucun script de mesure n&apos;est chargé.
                Le refus est enregistré dans un cookie de fonctionnement
                conservé 1 an. Vous pouvez modifier votre choix à tout moment
                en effaçant les cookies de votre navigateur.
              </p>
            ) : (
              <p className="mt-2">
                Ce site est entièrement statique et n&apos;utilise aucun cookie de
                mesure ni de publicité : aucun bandeau de consentement n&apos;est
                affiché, et aucune donnée de navigation n&apos;est collectée par des
                services tiers.
              </p>
            )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">7. Vos droits</h2>
          <p className="mt-2">
            Vous disposez des droits d&apos;accès, de rectification,
            d&apos;effacement, de limitation, d&apos;opposition, de portabilité et du
            droit d&apos;introduire une réclamation auprès de la CNIL. Pour exercer
            vos droits, écrivez-nous via la page Contact.{" "}
            {CONTACT.email
              ? `Vous pouvez également écrire directement à ${CONTACT.email}.`
              : ""}
          </p>
        </section>
      </div>
    </div>
  );
}