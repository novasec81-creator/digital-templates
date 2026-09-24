import Link from "next/link";
import { STORE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm md:grid-cols-3">
        <div>
          <p className="font-semibold text-gray-900">{STORE_NAME}</p>
          <p className="mt-2 text-gray-600">
            Des templates numériques premium, prêts à l&apos;emploi et livrés immédiatement.
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Templates</p>
          <ul className="mt-2 space-y-1.5">
            <li>
              <Link href="/produits" className="text-gray-600 hover:text-gray-900">
                Tous les templates
              </Link>
            </li>
            <li>
              <Link href="/produits" className="text-gray-600 hover:text-gray-900">
                Templates Notion
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="text-gray-600 hover:text-gray-900">
                À propos
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Informations légales</p>
          <ul className="mt-2 space-y-1.5">
            <li>
              <Link href="/mentions-legales" className="text-gray-600 hover:text-gray-900">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/cgv" className="text-gray-600 hover:text-gray-900">
                CGV
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="text-gray-600 hover:text-gray-900">
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {STORE_NAME}. Tous droits réservés.
      </div>
    </footer>
  );
}