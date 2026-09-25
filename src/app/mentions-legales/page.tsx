import type { Metadata } from "next";
import { STORE_LEGAL, STORE_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Mentions légales" };

export const dynamic = "force-static";

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Mentions légales</h1>
      <div className="mt-6 space-y-6 text-sm leading-relaxed text-ink-2">
        <section>
          <h2 className="text-lg font-semibold text-ink">1. Éditeur du site</h2>
          <ul className="mt-2 space-y-1">
            <li>Raison sociale : {STORE_LEGAL.editorName}</li>
            <li>Adresse : {STORE_LEGAL.address}</li>
            <li>SIRET : {STORE_LEGAL.siret}</li>
            <li>TVA intracommunautaire : {STORE_LEGAL.vatNumber}</li>
            <li>Responsable de la publication : {STORE_LEGAL.editorName}</li>
            <li>
              Contact :{" "}
              {STORE_LEGAL.email
                ? STORE_LEGAL.email
                : "en cours de configuration (via la page Contact)"}
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">2. Hébergeur</h2>
          <p className="mt-2">{STORE_LEGAL.host}</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">3. Activité</h2>
          <p className="mt-2">
            {STORE_NAME} propose une vitrine de contenus numériques (templates,
            tableurs, presets et modèles). Les commandes sont traitées par
            email et les fichiers livrés par email après confirmation du
            client. Le site est accessible à l&apos;adresse{" "}
            <a
              href={process.env.NEXT_PUBLIC_APP_URL ?? "/"}
              className="text-clay underline underline-offset-4"
            >
              {process.env.NEXT_PUBLIC_APP_URL ?? "URL à renseigner"}
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">4. Propriété intellectuelle</h2>
          <p className="mt-2">
            L&apos;ensemble des contenus du site (textes, visuels, templates
            proposés) est protégé par le droit d&apos;auteur. La reproduction,
            redistribution ou revente des fichiers sans autorisation est
            interdite.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">
            5. Informations à compléter
          </h2>
          <p className="mt-2">
            Les éléments marqués « à compléter » (raison sociale, adresse,
            SIRET, TVA, URL définitive) doivent être renseignés par l&apos;éditeur
            avant la mise en exploitation commerciale durable du site.
          </p>
        </section>
      </div>
    </div>
  );
}