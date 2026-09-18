import type { Metadata } from "next";
import { STORE_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export const dynamic = "force-static";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold tracking-tight">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-gray-500">
        Dernière mise à jour : septembre 2026 — Conforme au RGPD (UE 2016/679).
      </p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Responsable du traitement</h2>
          <p className="mt-2">
            {STORE_NAME} — responsable de traitement. Contact pour vos droits :{" "}
            <span className="text-blue-600 underline">{process.env.EMAIL_REPLY_TO ?? "support@exemple.fr"}</span>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Données collectées</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Compte : adresse email (créé automatiquement à l&apos;achat ou à la connexion).</li>
            <li>Commandes : email, produits achetés, montant, date, identifiants de paiement Stripe.</li>
            <li>Cookies de fonctionnement : panier, session de connexion, consentement cookies, code affilié.</li>
            <li>Données techniques : adresse IP, agent utilisateur (logs de téléchargement et sécurité).</li>
            <li>Si vous acceptez les cookies de mesure : données analysées par GA4, Google Tag Manager et Clarity.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Finalités et bases légales</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Exécution du contrat de vente et livraison des fichiers (art. 6.1.b RGPD).</li>
            <li>Facturation et obligations légales (art. 6.1.c RGPD).</li>
            <li>Sécurité, prévention de la fraude et des abus (art. 6.1.f RGPD).</li>
            <li>Mesure d&apos;audience, uniquement avec votre consentement (art. 6.1.a RGPD).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Durée de conservation</h2>
          <p className="mt-2">
            Les données de commande sont conservées le temps nécessaire aux obligations
            légales (facturation : 10 ans). Pour les cookies de mesure : 13 mois maximum
            (conformément aux recommandations CNIL).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Sous-traitants</h2>
          <p className="mt-2">
            Vos données transitent ou sont stockées par les sous-traitants suivants,
            tous situés dans l&apos;UE ou bénéficiant de garanties contractuelles
            adéquates : Vercel (hébergement), Supabase/Neon (base de données),
            Cloudflare R2 (fichiers), Stripe (paiement, norme PCI-DSS), Resend
            (emails transactionnels), Google Analytics et Microsoft Clarity (audience,
            sous consentement).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Cookies</h2>
          <p className="mt-2">
            Le bandeau de consentement vous permet d&apos;accepter ou de refuser les
            cookies non indispensables, avec le même niveau de simplicité. Sans votre
            consentement, aucun script de mesure n&apos;est chargé. Cookies strictement
            nécessaires (panier, session, sécurité) : exemptés de consentement.
            Vous pouvez retirer votre consentement à tout moment en effaçant vos
            cookies dans votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Vos droits</h2>
          <p className="mt-2">
            Vous disposez des droits d&apos;accès, de rectification, d&apos;effacement, de
            limitation, d&apos;opposition, de portabilité et du droit d&apos;introduire une
            réclamation auprès de la CNIL. Pour exercer vos droits, écrivez-nous :{" "}
            <span className="text-blue-600 underline">{process.env.EMAIL_REPLY_TO ?? "support@exemple.fr"}</span>.
          </p>
        </section>
      </div>
    </div>
  );
}