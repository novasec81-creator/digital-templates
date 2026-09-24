import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-5xl font-bold text-gray-200">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Page introuvable</h1>
      <p className="mt-2 text-gray-600">
        Ce template ou cette page n&apos;existe pas ou n&apos;est plus disponible.
      </p>
      <Link
        href="/produits"
        className="mt-8 inline-block rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
      >
        Voir les templates
      </Link>
    </div>
  );
}