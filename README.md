# Format — Vitrine statique de templates numériques

Vitrine de templates numériques (Notion, Excel & Google Sheets, Canva,
presets Lightroom et CV) exportée en **site statique** et déployée sur
**Cloudflare Pages**. La vente passe par la page Contact : chaque commande est
confirmée par email, puis les fichiers sont envoyés par email.

Stack : **Next.js 16 (App Router, TypeScript, export statique) · Tailwind CSS**.

---

## Fonctionnalités

- Catalogue filtrable et partageable par URL : recherche (`q`), catégorie
  (`categorie`), tri (`tri`), prix min/max (`prix-min`, `prix-max`).
- Fiches produit : description réelle, contenu livré, prix, CTA de commande
  qui pré-remplit la page Contact (`/contact?produit=<slug>`).
- Packs (regroupement éditorial) : prix recalculé depuis la somme des
  ressources membres, CTA `/contact?pack=<id>`.
- SEO : `sitemap.xml`, `robots.txt`, canonical, Open Graph, JSON-LD
  Product + BreadcrumbList.
- Pages légales (Mentions légales, CGV, Politique de confidentialité) :
  texte généré dans `src/lib/constants.ts` — à finaliser avec les
  coordonnées réelles de l'éditeur.
- Bandeau de consentement cookies **uniquement si un outil de mesure
  d'audience est configuré** (`NEXT_PUBLIC_GTM_ID` / `GA4_ID` / `CLARITY_ID`).
- Build contrôlé : nettoyage automatique, vérification post-build
  (pages attendues, 12 fiches, aucun contenu prohibé, liens internes,
  sitemap/robots) et export `dist/` + `dist.zip` prêt pour Cloudflare.

## Architecture

```
/app                     → pages statiques (accueil, produits, fiches, contact, FAQ, légal, 404)
/components              → UI maison (cartes, galerie, faq, navbar, footer…)
/lib
  /constants.ts          → marque, contact, livraison, URL (`NEXT_PUBLIC_APP_URL`), analytics
  /demo-data.ts          → catalogue : 12 produits, 5 catégories, 3 packs
/lib/payments            → modules dormants, isolés, testés (voir Tests)
/lib/storage
/lib/email
```

`output: "export"` dans `next.config.ts` : aucune route serveur n'est déployée.
La boutique en ligne (Stripe, téléchargements, comptes) a été retirée ; les
modules `payments`, `storage`, `email` restent dans le dépôt, **non téléversés
dans le build**, et sont couverts par des tests unitaires.

## Installation locale

Prérequis : Node.js ≥ 20.

```bash
npm install

# 1. Créez votre .env (voir .env.example)
cp .env.example .env

# 2. Développement
npm run dev                  # http://localhost:3000
```

Sans `.env`, `requireSiteUrl` retombe sur `localhost:3000` en développement
avec un avertissement. Le **build de production échoue** si
`NEXT_PUBLIC_APP_URL` (URL publique finale) est absente : elle alimente le
canonical, le sitemap, le robots, l'Open Graph et le JSON-LD.

## Build et déploiement

```bash
npm run build           # = clean + next build + vérification automatique (postbuild)
npm run deploy:export   # copie out/ → dist/ et crée dist.zip
```

Déploiement Cloudflare Pages :

1. `NEXT_PUBLIC_APP_URL=https://votre-domaine.fr npm run build`.
2. `npm run deploy:export`.
3. Uploadez le contenu de `dist/` (répertoire de build) — ou `dist.zip`.
4. Pensez à purger le cache Cloudflare après le premier déploiement.

Le script `scripts/verify-build.mjs` fait échouer le build si une page
attendue manque, si un contenu interdit (ancienne marque, faux avis,
chiffres fictifs) réapparaît, si un lien interne casse ou si le sitemap est
incomplet.

## Tests

```bash
npm test          # Vitest (unit) — lib/payments et lib/storage (dormants)
npm run lint      # ESLint
```

## Sécurité

- Aucune clé secrète en dur : tout passe par `.env` (voir `.env.example`).
- `NEXT_PUBLIC_*` n'expôse uploads que les valeurs préfixées `NEXT_PUBLIC_`.
- Les chemin `dist/`, `dist.zip`, `out/` et `.next/` sont ignorés par git.

---

Pages légales à personnaliser avec les informations réelles de l'éditeur
(pour la mise en exploitation : voir `src/lib/constants.ts` — `CONTACT`,
`STORE_LEGAL`, `DELIVERY`).