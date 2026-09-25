import type { Metadata } from "next";
import { CONTACT, STORE_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Conditions Générales de Vente" };

export const dynamic = "force-static";

export default function CgvPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">
        Conditions Générales de Vente
      </h1>
      <p className="mt-2 text-sm text-ink-3">
        Dernière mise à jour : septembre 2026
      </p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-ink-2">
        <section>
          <h2 className="text-lg font-semibold text-ink">1. Objet</h2>
          <p className="mt-2">
            Les présentes conditions régissent les ventes de contenus
            numériques (templates, tableurs, presets et modèles) présentés par
            {STORE_NAME} sur cette vitrine. Toute commande implique
            l&apos;acceptation préalable et sans réserve des présentes conditions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">2. Produits et descriptifs</h2>
          <p className="mt-2">
            Les produits sont des fichiers numériques livrés dans leur format
            d&apos;origine (base Notion, tableur Excel ou Google Sheets, modèle
            Canva, preset .xmp, modèle .docx). Les fiches produits décrivent le
            contenu et l&apos;usage attendu : elles sont non contractuelles et
            n&apos;engagent pas au-delà de la description de la ressource livrée.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">3. Prix</h2>
          <p className="mt-2">
            Les prix sont indiqués en euros (€), TTC. Le prix affiché sur la
            fiche produit est le prix de vente. Le « prix barré », lorsqu&apos;il
            est présent, correspond à la somme des prix unitaires des ressources
            composant un pack.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">4. Commande et livraison</h2>
          <p className="mt-2">
            Les commandes sont passées par la page Contact. Le vendeur confirme
            par email la disponibilité et les modalités de règlement avant toute
            livraison.{" "}
            {CONTACT.email
              ? `Après confirmation, les fichiers sont envoyés à l'adresse indiquée (${CONTACT.email}). `
              : "Après confirmation de la commande et du règlement, les fichiers sont envoyés par email. "}
            La livraison n&apos;est pas automatisée : elle intervient uniquement
            après confirmation de chaque commande.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">
            5. Droit de rétractation
          </h2>
          <p className="mt-2">
            Les contenus numériques fournis par {STORE_NAME} sont livrés après
            confirmation expresse du client. Les modalités applicables à la
            renonciation à la rétractation sont celles fixées par le droit de la
            consommation, notamment l&apos;article L221-28 du Code de la
            consommation. Les précisions contractuelles définitives figurent
            dans le récapitulatif envoyé par email lors de la confirmation de
            commande.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">6. Garantie légale de conformité</h2>
          <p className="mt-2">
            Vous bénéficiez de la garantie légale de conformité (art. L217-3 et
            suivants du Code de la consommation) et des garanties légales
            contre les vices cachés (art. 1641 et suivants du Code civil). En
            cas de fichier défectueux ou manquant, contactez-nous : nous
            corrigeons ou remplaçons la ressource concernée sans frais.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">
            7. Droit applicable et litiges
          </h2>
          <p className="mt-2">
            Les présentes conditions sont soumises au droit français. À défaut
            de résolution amiable, plateforme de règlement en ligne des litiges{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-clay underline underline-offset-4"
            >
              ec.europa.eu/consumers/odr
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}