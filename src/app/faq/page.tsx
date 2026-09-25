import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { CONTACT, DELIVERY, STORE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions fréquentes sur les templates : fonctionnement, commande, livraison, personnalisation, support et licences.",
};

const GENERAL: FaqItem[] = [
  {
    q: "Qu'est-ce que Format ?",
    a: "Format est une vitrine de templates numériques : bases Notion, tableurs Excel et Google Sheets, modèles Canva, presets Lightroom et modèles de CV. Chaque ressource est livrée prête à l'emploi et reste personnalisable dans l'outil d'origine.",
  },
  {
    q: "Quels types de ressources trouve-t-on ?",
    a: "Cinq familles : organisation et productivité (Notion), tableurs et suivis (Excel & Sheets), visuels et réseaux sociaux (Canva), rendus photo (presets Lightroom) et documents de carrière (CV). Certaines ressources sont aussi regroupées en packs.",
  },
  {
    q: "Les fiches produits sont-elles contractuelles ?",
    a: "Non : les fiches décrivent le contenu, les formats et l'usage attendu de chaque template. Elles ne sont pas contractuelles et n'engagent pas davantage que la description de la ressource livrée.",
  },
];

const ORDER: FaqItem[] = [
  {
    q: "Comment commander un template ?",
    a: "Par la page Contact : indiquez le ou les templates qui vous intéressent. Nous confirmons par email la disponibilité et les modalités de règlement avant d'envoyer les fichiers.",
  },
  {
    q: "Comment les fichiers sont-ils livrés ?",
    a: "Après confirmation de votre commande, l'ensemble des fichiers (liens de duplication, tableurs, modèles) est envoyé par email : liens de duplication Notion, fichiers .xlsx ou Google Sheets, modèles Canva, presets .xmp et modèles de CV.",
  },
  {
    q: "Le téléchargement est-il instantané ?",
    a: "Non : la livraison n'est pas automatisée. Chaque commande est confirmée manuellement, puis le fichier est transmis par email. Le site ne prétend pas offrir un téléchargement instantané.",
  },
  {
    q: "Quels moyens de paiement sont acceptés ?",
    a: "Les modalités de règlement sont convenues avec vous par email au moment de la confirmation de la commande. Aucun paiement n'est prélevé en ligne sans accord préalable.",
  },
  {
    q: "Puis-je commander plusieurs templates à la fois ?",
    a: "Oui : indiquez-les tous dans votre message. Pour les ressources complémentaires, les packs (section Packs de l'accueil) regroupent plusieurs fichiers à tarif réduit en une seule commande.",
  },
];

const USAGE: FaqItem[] = [
  {
    q: "Puis-je adapter un template à mon usage ?",
    a: "Oui. Les fichiers sont livrés dans leur format d'origine : il suffit de les dupliquer (Notion, Canva) ou de les ouvrir (Excel, .docx, .xmp) puis de modifier librement contenus, couleurs, vues et formules.",
  },
  {
    q: "Ai-je besoin d'un logiciel particulier ?",
    a: "Oui, selon le template : un compte Notion (gratuit) pour les bases, Excel ou Google Sheets pour les tableurs, Canva (gratuit) pour les modèles, Lightroom pour les presets, ou un traitement de texte pour les CV. Chaque fiche précise l'outil requis.",
  },
  {
    q: "Combien de fois puis-je utiliser un template ?",
    a: "Un template acheté peut être utilisé sans limite pour vos propres besoins, y compris pour des travaux destinés à vos clients. En revanche, le fichier source (ou sa copie) ne doit pas être redistribué ou revendu tel quel à des tiers.",
  },
  {
    q: "Que comprend « guide de démarrage » ?",
    a: "La plupart des ressources incluent un court guide illustré : import du fichier, duplication, premiers réglages et conseils d'utilisation. Il est mentionné dans la section « Ce que vous obtenez » de chaque fiche.",
  },
];

const SUPPORT: FaqItem[] = [
  {
    q: "Que faire en cas de fichier défectueux ?",
    a: "Écrivez-nous via la page Contact en décrivant le problème. Nous vérifions, corrigeons ou remplaçons la ressource concernée. La garantie légale de conformité s'applique à l'ensemble des produits.",
  },
  {
    q: "Comment vous joindre ?",
    a: CONTACT.email
      ? `Par la page Contact, ou directement à l'adresse ${CONTACT.email}. ${CONTACT.responseDelay}`
      : `Par la page Contact. ${CONTACT.responseDelay} L'adresse directe est en cours de configuration.`,
  },
  {
    q: "Les informations me concernant sont-elles protégées ?",
    a: "Oui. Les informations transmises dans les messages sont utilisées uniquement pour vous répondre et traiter votre commande. Détails dans la politique de confidentialité.",
  },
];

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Questions fréquentes
        </h1>
        <p className="mx-auto mt-3 max-w-xl leading-relaxed text-ink-2">
          Le fonctionnement de {STORE_NAME} en toute transparence : commande,
          livraison, utilisation et support.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        <section aria-labelledby="faq-general">
          <h2 id="faq-general" className="text-lg font-bold tracking-tight text-ink">
            Général
          </h2>
          <div className="mt-4">
            <FaqAccordion items={GENERAL} />
          </div>
        </section>

        <section aria-labelledby="faq-order">
          <h2 id="faq-order" className="text-lg font-bold tracking-tight text-ink">
            Commande &amp; livraison
          </h2>
          <div className="mt-4">
            <FaqAccordion items={ORDER} />
          </div>
        </section>

        <section aria-labelledby="faq-usage">
          <h2 id="faq-usage" className="text-lg font-bold tracking-tight text-ink">
            Utilisation &amp; personnalisation
          </h2>
          <div className="mt-4">
            <FaqAccordion items={USAGE} />
          </div>
        </section>

        <section aria-labelledby="faq-support">
          <h2 id="faq-support" className="text-lg font-bold tracking-tight text-ink">
            Support &amp; garanties
          </h2>
          <div className="mt-4">
            <FaqAccordion items={SUPPORT} />
          </div>
        </section>
      </div>

      <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-line bg-paper-2 px-6 py-8 text-center">
        <p className="text-sm font-semibold text-ink">
          Toujours une question ? On vous répond directement.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-black"
        >
          Nous écrire
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <p className="text-xs text-ink-3">{DELIVERY.details}</p>
      </div>
    </section>
  );
}