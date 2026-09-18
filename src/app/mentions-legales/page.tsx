import type { Metadata } from "next";
import { STORE_LEGAL, STORE_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Mentions légales" };

export const dynamic = "force-static";

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold tracking-tight">Mentions légales</h1>
      <div className="mt-6 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Éditeur du site</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Raison sociale : {STORE_LEGAL.editorName}</li>
            <li>Adresse : {STORE_LEGAL.address}</li>
            <li>SIRET : {STORE_LEGAL.siret}</li>
            <li>TVA intracommunautaire : {STORE_LEGAL.vatNumber}</li>
            <li>Responsable de la publication : {STORE_LEGAL.editorName}</li>
            <li>Contact : {STORE_LEGAL.email}</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Hébergeur</h2>
          <p className="mt-2">{STORE_LEGAL.host}</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Activité</h2>
          <p className="mt-2">
            {STORE_NAME} commercialise des contenus numériques téléchargeables
            (templates et outils numériques). Le site est accessible à l&apos;adresse{" "}
            <a
              href={process.env.NEXT_PUBLIC_APP_URL ?? "/"}
              className="text-blue-600 underline"
            >
              {process.env.NEXT_PUBLIC_APP_URL ?? "URL à renseigner"}
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Propriété intellectuelle</h2>
          <p className="mt-2">
            L&apos;ensemble des contenus du site (textes, visuels, templates proposés au
            téléchargement) est protégé par le droit d&apos;auteur. Toute reproduction,
            redistribution ou revente sans autorisation est interdite.
          </p>
        </section>
      </div>
    </div>
  );
}