import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  FileSpreadsheet,
  LayoutGrid,
  Mail,
  MessageSquare,
  SlidersHorizontal,
} from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryCard } from "@/components/shop/CategoryCard";
import { BundleCard } from "@/components/shop/BundleCard";
import { ProductVisual } from "@/components/shop/ProductVisual";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import {
  DEMO_BUNDLES,
  DEMO_PRODUCTS,
  getDemoProduct,
  PRODUCT_CATEGORIES,
} from "@/lib/demo-data";
import { CONTACT, DELIVERY, STORE_DESCRIPTION, STORE_NAME, price } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Templates Notion, Excel, Canva, Lightroom & CV",
  description: STORE_DESCRIPTION,
};

const SELECTION_SLUGS = [
  "gestionnaire-de-taches-notion",
  "budget-personnel-excel",
  "kit-carrousels-instagram-canva",
  "preset-lightroom-urbain",
];

const TRUST_ITEMS = [
  {
    icon: LayoutGrid,
    title: "Catalogue varié",
    text: "Notion, Excel & Sheets, Canva, Lightroom et CV : des ressources sélectionnées une à une.",
  },
  {
    icon: Mail,
    title: "Livraison par email",
    text: "Après confirmation de votre commande, les fichiers vous sont envoyés par email, prêts à l'emploi.",
  },
  {
    icon: MessageSquare,
    title: "Un contact direct",
    text: "Chaque commande et chaque question sont traitées par email, sans intermédiaire automatisé.",
  },
];

const WHY_ITEMS = [
  {
    icon: Clock,
    title: "Gain de temps immédiat",
    text: "Les fichiers sont livrés prêts à l'emploi : il ne reste qu'à les dupliquer et les adapter.",
  },
  {
    icon: SlidersHorizontal,
    title: "Entièrement personnalisables",
    text: "Vues, couleurs, textes, formules : tout se modifie directement dans votre outil habituel.",
  },
  {
    icon: FileSpreadsheet,
    title: "Des formats ouverts",
    text: "Notion, .xlsx, Google Sheets, Canva, .xmp Lightroom et .docx : vous restez chez vous.",
  },
  {
    icon: MessageSquare,
    title: "Un contact humain",
    text: "Commande confirmée par email et support réactif. Pas de tunnel impersonnel.",
  },
];

const HOME_FAQ: FaqItem[] = [
  {
    q: "Comment reçois-je un template après commande ?",
    a: "Vous passez commande via la page Contact. Après confirmation par email, le fichier (lien de duplication, tableur, modèles) vous est envoyé directement par email. Il n'y a pas de téléchargement automatisé : la commande est toujours confirmée manuellement.",
  },
  {
    q: "Sur quelles applications fonctionnent les templates ?",
    a: "Bases Notion, tableurs Excel et Google Sheets, modèles Canva, fichiers .xmp pour Lightroom et modèles de CV .docx. Chaque fiche produit précise le format livré.",
  },
  {
    q: "Puis-je adapter le template à mon usage ?",
    a: "Oui. Les fichiers sont livrés dans leur format d'origine : il suffit de les dupliquer puis de modifier vues, couleurs, textes et formules librement.",
  },
  {
    q: "Que se passe-t-il en cas de souci avec un fichier ?",
    a: "Écrivez-nous via la page Contact : nous vérifions le fichier et remplaçons ou corrigeons toute ressource défectueuse. La garantie légale de conformité s'applique.",
  },
];

function HeroShopCard({
  product,
  className,
}: {
  product: ReturnType<typeof getDemoProduct>;
  className: string;
}) {
  if (!product) return null;
  return (
    <figure className={`absolute z-10 ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-float transition-shadow duration-300">
        <ProductVisual
          accent={product.accent}
          visual={product.visual}
          label={product.category.name}
          className="aspect-[4/3] w-full"
        />
        <figcaption className="flex items-center justify-between gap-2 px-4 py-3">
          <span className="line-clamp-1 text-sm font-semibold text-ink">
            {product.title}
          </span>
          <span className="shrink-0 text-sm font-bold text-ink">
            {price(product.priceCents)}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

export default function HomePage() {
  const selection = SELECTION_SLUGS.map(getDemoProduct).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );
  const news = DEMO_PRODUCTS.filter((p) => p.isNew);
  const counts = Object.fromEntries(
    PRODUCT_CATEGORIES.map((c) => [c.slug, DEMO_PRODUCTS.filter((p) => p.category.slug === c.slug).length])
  );

  return (
    <div>
      {/* 1 — Hero, disposition 50/50 */}
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-20">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2 px-3.5 py-1.5 text-xs font-semibold text-ink-2">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-clay" />
              Resources finies pour Notion, Excel, Canva, Lightroom &amp; CV
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[3.4rem] lg:leading-[1.06]">
              Des templates numériques,{" "}
              <span className="text-clay">prêts en quelques minutes.</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              Bases prêtes à l&apos;emploi, tableurs codés, visuels et presets :
              vous gagnez des heures, dès la première utilisation.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-black"
              >
                Explorer la collection
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/#fonctionnement"
                className="inline-flex items-center rounded-xl border border-line bg-paper px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-line-strong hover:bg-paper-2"
              >
                Comment ça marche
              </Link>
            </div>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-ink-3">
              {CONTACT.orderNote}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
            <div className="relative aspect-[5/4]">
              <HeroShopCard
                product={getDemoProduct("budget-personnel-excel")}
                className="left-0 top-0 z-20 w-[52%] rotate-3"
              />
              <HeroShopCard
                product={getDemoProduct("gestionnaire-de-taches-notion")}
                className="inset-x-0 top-4 z-30 mx-auto w-[68%] -rotate-2"
              />
              <HeroShopCard
                product={getDemoProduct("kit-carrousels-instagram-canva")}
                className="bottom-0 left-[8%] z-10 w-[62%] rotate-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Barre de confiance (affirmations vérifiables uniquement) */}
      <section aria-label="Points de confiance" className="border-y border-line bg-paper-2">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:grid-cols-3 sm:px-6">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-paper text-ink">
                <item.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{item.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — Catégories */}
      <section id="categories" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeader
          eyebrow="Catégories"
          title="Par quoi commencer ?"
          description="Cinq familles de ressources, chacune avec son usage. Choisissez votre porte d'entrée."
          linkHref="/produits"
          linkLabel="Voir le catalogue"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PRODUCT_CATEGORIES.map((c) => (
            <CategoryCard key={c.slug} category={c} count={counts[c.slug]} />
          ))}
        </div>
      </section>

      {/* 4 — Sélection éditoriale */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHeader
          eyebrow="Notre sélection"
          title="Quatre ressources, choisies avec soin"
          description="Une sélection éditoriale pour couvrir les besoins les plus courants : s'organiser, suivre, publier, traiter l'image."
          linkHref="/produits"
          linkLabel="Tous les templates"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {selection.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 5 — Nouveautés */}
      <section id="nouveautes" className="border-y border-line bg-paper-2">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <SectionHeader
            eyebrow="Nouveautés"
            title="Les dernières arrivées"
            description="Les templates récemment publiés dans le catalogue. De nouveaux produits sont ajoutés régulièrement."
            linkHref="/produits?tri=nouveautes"
            linkLabel="Tout voir"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {news.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 6 — Pourquoi */}
      <section id="pourquoi" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeader
          center
          eyebrow={`Pourquoi ${STORE_NAME}`}
          title="Conçu pour durer dans votre quotidien"
          description="Pas de promesse en l'air : des fichiers livrés, adaptables, dans vos outils habituels."
        />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-line bg-paper p-5 shadow-card"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-clay-soft text-clay">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[15px] font-bold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7 — Comment ça marche */}
      <section id="fonctionnement" className="border-y border-line bg-paper-2">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <SectionHeader
            center
            eyebrow="Fonctionnement"
            title="Comment ça marche ?"
            description={DELIVERY.details}
          />
          <ol className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-3 sm:gap-4">
            {DELIVERY.steps.map((step, i) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden="true"
                  className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-line bg-paper text-sm font-extrabold text-clay shadow-card"
                >
                  0{i + 1}
                </span>
                <h3 className="mt-5 text-center text-base font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-relaxed text-ink-2">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8 — Packs */}
      <section id="packs" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeader
          center
          eyebrow="Packs"
          title="Les packs, plus malins"
          description="Des ressources complémentaires réunies à prix réduit, facturées en une seule commande."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {DEMO_BUNDLES.map((b) => (
            <BundleCard key={b.id} bundle={b} />
          ))}
        </div>
      </section>

      {/* 9 — FAQ (mini) */}
      <section id="faq" className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <SectionHeader
          center
          eyebrow="FAQ"
          title="Questions fréquentes"
          linkHref="/faq"
          linkLabel="Toutes les questions"
        />
        <div className="mt-10">
          <FaqAccordion items={HOME_FAQ} />
        </div>
      </section>

      {/* 10 — CTA final */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-paper sm:text-4xl">
            Envie d&apos;un template qui vous ressemble ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-paper/70">
            Parcourez le catalogue et passez commande via la page Contact. Nous
            confirmons la demande et vous envoyons le fichier par email.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 rounded-xl bg-paper px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
            >
              Explorer le catalogue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl border border-paper/25 px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
            >
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}