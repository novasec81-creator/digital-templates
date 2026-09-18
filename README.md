# Templates Store — E-commerce autonome de ressources numériques

Boutique de templates numériques (Notion, Excel/Google Sheets, presets Lightroom,
Canva, CV…) avec **livraison automatique après paiement**, sans intervention manuelle.

Stack : **Next.js 16 (App Router, TypeScript) · Tailwind CSS · Prisma · PostgreSQL
(Supabase/Neon) · Stripe Checkout · Cloudflare R2/S3 · Resend**.

---

## Table des matières

1. [Fonctionnalités](#fonctionnalités)
2. [Architecture](#architecture)
3. [Installation locale](#installation-locale)
4. [Variables d'environnement](#variables-denvironnement)
5. [Déploiement (Vercel + Supabase/Neon + Stripe + R2)](#déploiement)
6. [Configuration Stripe](#configuration-stripe)
7. [Configuration analytics (GTM / GA4 / Clarity)](#configuration-analytics)
8. [Programme d'affiliation](#programme-daffiliation)
9. [Tests](#tests)
10. [Sécurité](#sécurité)
11. [Critères d'acceptation](#critères-dacceptation)

## Fonctionnalités

- Catalogue avec filtres (catégorie, fourchette de prix) et tri (popularité, nouveautés, prix).
- Fiches produit : galerie d'aperçus, prix barrés, avis modérés, données structurées Schema.org.
- Panier persistant (cookie `cart`, 400 jours).
- Checkout Stripe : carte, Apple Pay, Google Pay, TVA gérée par Stripe Tax, renonciation
  explicite au droit de rétractation (art. L221-28 Code de la consommation).
- Webhook Stripe (signature vérifiée) → création de la commande, **lien de téléchargement
  sécurisé 72 h / 5 téléchargements**, email transactionnel avec **facture PDF**.
- Espace client « Mes achats » : retéléchargement illimité une fois connecté (magic-link).
- Avis clients modérés avec anti-XSS (sanitisation) et badge « achat vérifié ».
- Codes promo (pourcentage ou montant fixe).
- Programme d'affiliation : cookie 30 jours (`?ref=CODE`), compteur de clics/ventes.
- Pages légales (Mentions légales, CGV, Politique de confidentialité) + bandeau cookies RGPD.
- SEO : ISR 1 h, `sitemap.xml`, `robots.txt`, Open Graph, JSON-LD Product.
- Rate limiting (Upstash + fallback mémoire), CSP/HSTS, validation Zod côté serveur.

## Architecture

```
/app
  /(pages)              → accueil, produits, fiche produit, panier, checkout, succès, compte
  /api
    /webhooks/stripe    → webhook Stripe (signature vérifiée)
    /checkout           → création session Stripe
    /telechargement/[token] → téléchargement public (token 72h/5 dl)
    /compte/telechargement/[orderItemId] → téléchargement authentifié illimité
    /reviews            → publication d'un avis (modéré)
    /promo/check        → validation d'un code promo
    /auth/login, /auth/verify → magic-link
    /contact
/lib
  /payments             → stripe.ts, checkout.ts, webhook.ts, promo.ts (isolés)
  /storage              → s3.ts (R2/S3), download-token.ts
  /email                → index.tsx (Resend + React Email), invoice.ts (PDF)
  /analytics            → dataLayer custom
/prisma/schema.prisma
/src/emails             → templates React Email
```

Règle : aucune logique métier dans les composants React. Les modules `payments`,
`storage`, `email` sont indépendants et remplaçables (ex. changer de PSP sans
toucher au frontend).

## Installation locale

Prérequis : Node.js ≥ 20, une base PostgreSQL (locale, ou Supabase/Neon gratuit).

```bash
git clone <repo> && cd digital-templates
npm install

# 1. Créez votre .env (voir .env.example)
cp .env.example .env

# 2. Base de données : appliquez les migrations puis seed
#    (remplacez DATABASE_URL dans .env par votre Postgres)
npm run prisma:migrate     # prisma migrate dev
npm run db:seed            # catégories, 6 produits de démo, 2 promos, 1 lien affilié

# 3. Upload des fichiers de démo dans votre bucket R2/S3
#    (les fileKeys du seed pointent vers templates/* )

npm run dev                # http://localhost:3000
```

En mode test Stripe, utilisez la carte `4242 4242 4242 4242` (tout futur, CVC/CVV
quelconques).

## Variables d'environnement

Toutes les variables sont listées dans [.env.example](./.env.example). Points
d'attention :

| Variable | Role |
|---|---|
| `DATABASE_URL` / `DIRECT_URL` | PostgreSQL. Pour Neon, utilisez l'URL pooled + `DIRECT_URL` pour les migrations. |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Clés `sk_test_`/`whsec_` en dev. |
| `S3_BUCKET`, `S3_ENDPOINT`, … | Bucket R2 (`endpoint` = `https://<accountid>.r2.cloudflarestorage.com`) ou AWS. `S3_PUBLIC_BASE_URL` = CDN R2 pour les previews. |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO` | Emails transactionnels + facture. |
| `SESSION_SECRET` | ≥ 32 caractères, utilisé pour signer les sessions JWT. |
| `UPSTASH_REDIS_REST_URL/TOKEN` | Rate limiting distribué (fallback mémoire sinon). |
| `NEXT_PUBLIC_GTM_ID/GA4_ID/CLARITY_ID` | Analytics, chargés **après consentement** cookies. |

⚠️ **Jamais de clé en dur** : tout passe par `.env`. Un scan [gitleaks](https://github.com/gitleaks/gitleaks)
est recommandé en CI (config fournie, `.gitleaks.toml`).

## Déploiement

1. **Base de données** : créez un projet Supabase ou Neon, récupérez l'URL, puis :
   ```bash
   DATABASE_URL="..." npx prisma migrate deploy
   DATABASE_URL="..." npm run db:seed
   ```
2. **Bucket R2** : créez un bucket public pour les previews (images), et utilisez le
   **même bucket ou un bucket privé** pour les fichiers téléchargeables (`fileKey`).
   Les fichiers sont servis via **liens présignés de 5 min**, l'URL S3 n'est jamais exposée.
3. **Stripe** : voir [Configuration Stripe](#configuration-stripe).
4. **Vercel** : importez le repo, ajoutez toutes les variables d'environnement.
   Build : `next build` — les pages produits utilisent l'ISR (revalidation 1 h).
5. **Emails** : vérifiez votre domaine dans Resend, définissez `EMAIL_FROM`
   (`Store <onboarding@resend.dev>` fonctionne en test uniquement).

### Démarrer en local sans Postgres installé

Le plus simple est un projet Supabase ou Neon gratuit. Alternative locale :
`docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16` (Docker requis).

## Configuration Stripe

1. Créez les **webhooks** (Dashboard → Developers → Webhooks → « Add endpoint ») :
   `https://<votre-domaine>/api/webhooks/stripe`
   Événements :
   - `checkout.session.completed` (obligatoire — déclenche la livraison)
   - `checkout.session.expired` (optionnel — marque la commande `FAILED`)
   - `charge.refunded` (optionnel — marque la commande `REFUNDED`)
2. Copiez la **secret de signature** dans `STRIPE_WEBHOOK_SECRET`.
3. En local : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   (`stripe` CLI récupère automatiquement la secret dans `STRIPE_WEBHOOK_SECRET`).
4. **Vérification de test** :
   - `npm run dev`, ajoutez un produit au panier, payez avec `4242 4242 4242 4242`.
   - Un email doit arriver avec le lien de téléchargement + facture PDF.
   - Le lien fonctionne 72 h et 5 téléchargements max (tokens en base).

## Configuration analytics

La politique est **consentement-first** : aucun script tiers n'est chargé avant
l'acceptation du bandeau cookies — il respecte le RGPD (refus aussi simple que
l'acceptation).

1. **Google Tag Manager** : créez un conteneur, notez `GTM-XXXX`, définissez
   `NEXT_PUBLIC_GTM_ID`. Le conteneur est injecté après consentement.
2. **GA4** : créez une propriété, notez `G-XXXX`, définissez `NEXT_PUBLIC_GA4_ID`.
   Configurez dans GTM un tag GA4 de type *Configuration* + des **éventements
   e-commerce** listés ci-dessous, déclenchés sur les attributs `dataLayer` :
   - `view_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `purchase`
   - Événements custom : `buy_clicked`, `download_started`, `cart_abandoned`, `promo_applied`
3. **Microsoft Clarity** : `NEXT_PUBLIC_CLARITY_ID` = identifiant du projet
   (onglet Settings → Setup → Project ID).
4. **Consent Mode v2** : le banner pousse un event `consent_update` dans le
   dataLayer ; connectez-le dans GTM pour n'activer les tags que si `consent=conceded`.
5. **Abandon de panier** : le hook `beforeunload` est branché dans le proof-of-concept —
   branchez-le sur un endpoint ou GA selon votre choix (voir `src/lib/analytics`).

## Programme d'affiliation

- Un lien publié contient `?ref=CODE` → le proxy (`src/proxy.ts`) enregistre le
  code dans un cookie 30 jours puis nettoie l'URL.
- À l'achat, le code est transmis dans la metadata de la session Stripe ; le
  webhook incrémente `clicks`/`sales` de `AffiliateLink` et le stocke sur la commande.
- Les commissions sont à connecter au PSP (payout Stripe Connect ou Connect on
  platform) — voir `src/lib/payments/webhook.ts`.

## Tests

```bash
npm test          # Vitest (unit) — /lib/payments et /lib/storage
npm run lint      # ESLint
npx tsc --noEmit  # Typecheck
```

## Sécurité

- HSTS + CSP + headers de sécurité (voir `next.config.ts`).
- Webhooks Stripe : `stripe.webhooks.constructEvent` obligatoire.
- Liens de téléchargement : tokens aléatoires en base, jamais l'URL S3 directe,
  liens présignés 5 min.
- Rate limiting : `/api/telechargement` (20 req/min/IP), avis, contact, auth
  (100 % serveur via Upstash, fallback mémoire en dev).
- Validation Zod côté serveur, sanitisation avis (anti-XSS).
- Aucune donnée bancaire via le serveur (Stripe Checkout, conformité PCI-DSS).
- `SESSION_SECRET` requis ≥ 32 caractères en production.

## Critères d'acceptation

- [ ] Un paiement Stripe de test génère l'email avec lien de téléchargement fonctionnel.
- [ ] Le lien expire après 72 h ou 5 téléchargements.
- [ ] Score Lighthouse > 85 (perf, SEO, accessibilité) — images dimensionnées, lazy-loading.
- [ ] Aucune clé secrète dans le code : `gitleaks detect`.
- [ ] Les événements GA4 e-commerce apparaissent en temps réel après consentement.
- [ ] Le bandeau cookies bloque les scripts tiers avant consentement.

---

© {année} — Projet généré pour mise en production. Pages légales à personnaliser
avec vos informations d'éditeur (`STORE_LEGAL_NAME`, SIRET, adresse, hébergeur).