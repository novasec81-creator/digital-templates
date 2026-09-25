import Link from "next/link";
import { Brand } from "@/components/brand/Brand";
import { DEMO_PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/demo-data";
import { CONTACT, STORE_NAME } from "@/lib/constants";

function footerCount(slug: string) {
  return DEMO_PRODUCTS.filter((p) => p.category.slug === slug).length;
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Brand />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-2">
            Templates numériques pour Notion, Excel &amp; Sheets, Canva,
            Lightroom et CV — conçus pour être utiles immédiatement.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-ink-3">
            Commandes par contact, livraison des fichiers par email.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold text-ink">Découvrir</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/produits" className="text-sm text-ink-2 transition-colors hover:text-ink">
                Tous les templates
              </Link>
            </li>
            {PRODUCT_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/produits?categorie=${c.slug}`}
                  className="text-sm text-ink-2 transition-colors hover:text-ink"
                >
                  {c.name}
                  <span className="ml-1.5 text-xs text-ink-3">
                    ({footerCount(c.slug)})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold text-ink">Aide</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/contact" className="text-sm text-ink-2 transition-colors hover:text-ink">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-sm text-ink-2 transition-colors hover:text-ink">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="text-sm text-ink-2 transition-colors hover:text-ink">
                À propos
              </Link>
            </li>
            <li>
              <Link
                href="/#fonctionnement"
                className="text-sm text-ink-2 transition-colors hover:text-ink"
              >
                Comment ça marche
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold text-ink">Légal</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link
                href="/mentions-legales"
                className="text-sm text-ink-2 transition-colors hover:text-ink"
              >
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/cgv" className="text-sm text-ink-2 transition-colors hover:text-ink">
                Conditions générales de vente
              </Link>
            </li>
            <li>
              <Link
                href="/confidentialite"
                className="text-sm text-ink-2 transition-colors hover:text-ink"
              >
                Politique de confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ink-3 sm:flex-row sm:px-6">
          <p>
            © {year} {STORE_NAME}. Tous droits réservés.
          </p>
          <p>{CONTACT.responseDelay}</p>
        </div>
      </div>
    </footer>
  );
}