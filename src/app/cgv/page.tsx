import type { Metadata } from "next";
import { STORE_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Conditions Générales de Vente" };

export const dynamic = "force-static";

export default function CgvPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold tracking-tight">Conditions Générales de Vente</h1>
      <p className="mt-2 text-sm text-gray-500">Dernière mise à jour : septembre 2026</p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Objet</h2>
          <p className="mt-2">
            Les présentes CGV régissent la vente, par {STORE_NAME}, de contenus numériques
            téléchargeables aux consommateurs. Toute commande implique l&apos;acceptation
            préalable et sans réserve des présentes conditions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Produits</h2>
          <p className="mt-2">
            Les produits sont des fichiers numériques (modèles, templates, presets)
            livrés par téléchargement. Les aperçus affichés sont non contractuels et ne
            reproduisent jamais le fichier final complet.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Prix et paiement</h2>
          <p className="mt-2">
            Les prix sont indiqués en euros, TTC. Le paiement s&apos;effectue via Stripe :
            carte bancaire, Apple Pay ou Google Pay. Le débit est effectué à la
            confirmation de la commande. {STORE_NAME} n&apos;enregistre jamais les
            données de carte bancaire.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Livraison</h2>
          <p className="mt-2">
            Après confirmation du paiement, un email contenant le lien de téléchargement
            et la facture est envoyé automatiquement. Le lien est valable 72 heures et
            limité à 5 téléchargements. Une fois connecté à votre compte, vous pouvez
            retélécharger vos achats sans limite de temps.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            5. Droit de rétractation et renonciation
          </h2>
          <p className="mt-2">
            Conformément à l&apos;article L221-28 du Code de la consommation, le droit de
            rétractation ne s&apos;applique pas aux fournitures de contenus numériques
            fournis immédiatement et dont l&apos;exécution a commencé après accord exprès du
            consommateur et renonciation expresse à son droit de rétractation.
          </p>
          <p className="mt-2 font-medium">
            En cochant la case préalable au paiement, vous acceptez expressément que la
            commande soit exécutée immédiatement et renoncez à votre droit de
            rétractation pour ce contenu numérique.
          </p>
          <p className="mt-2">
            En cas de défaut de conformité (fichier défectueux, erreur manifeste), nous
            nous engageons à remplacer, corriger ou rembourser le produit concerné.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Garantie légale de conformité</h2>
          <p className="mt-2">
            Vous bénéficiez de la garantie légale de conformité (art. L217-3 et suivants
            du Code de la consommation) et des garanties légales contre les vices cachés
            (art. 1641 et suivants du Code civil). Merci de nous contacter en cas de
            problème de fichier : nous le corrigeons ou le remplaçons.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Droit applicable et litiges</h2>
          <p className="mt-2">
            Les présentes CGV sont soumises au droit français. Médiation de la
            consommation : plateforme de règlement en ligne des litiges{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
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