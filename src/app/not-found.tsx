import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p
        aria-hidden="true"
        className="text-6xl font-extrabold tracking-tight text-line-strong"
      >
        404
      </p>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Cette page n&apos;existe pas.
      </h1>
      <p className="mt-3 text-ink-2">
        L&apos;adresse demandée est introuvable (ou n&apos;est plus disponible).
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-black"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/produits"
          className="inline-flex items-center gap-2 rounded-xl border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
        >
          Explorer les templates
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}