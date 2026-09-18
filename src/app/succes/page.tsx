import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Paiement réussi", robots: { index: false } };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Merci ! Votre commande est confirmée.
      </h1>
      <p className="mt-3 text-gray-600">
        Un email vient de vous être envoyé avec vos liens de téléchargement et votre
        facture. Ils sont valables 72 heures.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Pour retélécharger vos fichiers sans limite de temps, connectez-vous à votre
        compte.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/mes-achats"
          className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Accéder à mes achats
        </Link>
        <Link
          href="/produits"
          className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}