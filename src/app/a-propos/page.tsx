import type { Metadata } from "next";
import { STORE_NAME, STORE_SLOGAN } from "@/lib/constants";

export const metadata: Metadata = { title: "À propos", description: STORE_SLOGAN };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold tracking-tight">À propos de {STORE_NAME}</h1>
      <div className="prose mt-6 space-y-4 text-gray-700">
        <p>
          {STORE_NAME} est une boutique de templates numériques : organisation Notion,
          tableurs Excel et Google Sheets, presets Lightroom, modèles Canva, CV et bien
          plus.
        </p>
        <p>
          Chaque template est conçu une seule fois puis proposé sans limite : vous
          investissez quelques euros, vous gagnez des heures, chaque jour.
        </p>
        <p>
          La livraison est immédiate et entièrement automatisée : contactez-nous et
          recevez votre template en quelques minutes.
        </p>
        <p>
          Une question ou une idée de template ?{" "}
          <a href="/contact" className="text-blue-600 underline">
            Écrivez-nous
          </a>
          .
        </p>
      </div>
    </div>
  );
}