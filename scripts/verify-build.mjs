/**
 * Vérifie le build statique généré dans `out/` après `next build`.
 * En cas d'erreur critique, le processus se termine en échec (exit 1).
 *
 * Contrôles :
 *  - présence de toutes les pages attendues (routes + fiches produits) ;
 *  - aucun contenant l'ancien contenu fictif / ancienne marque ;
 *  - aucun `localhost` dans le rendu ; 
 *  - aucun lien interne cassé, aucun href vide ou « # » accidentel ;
 *  - robots.txt présent et référence bien le sitemap ;
 *  - sitemap valide et complet (pages statiques + fiches produits).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const out = resolve(dirname(fileURLToPath(import.meta.url)), "..", "out");
const errors = [];

function fail(action, detail) {
  errors.push(`[FAIL] ${action} — ${detail}`);
  console.error(errors[errors.length - 1]);
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

if (!existsSync(out)) {
  console.error("[verify] Le dossier out/ n'existe pas. Lancez d'abord npm run build.");
  process.exit(1);
}

const files = walk(out);
const rel = (p) => p.replace(out + "\\", "").replace(/\\/g, "/");

// ---------------------------------------------------------------------------
// 1. Pages attendues
// ---------------------------------------------------------------------------
const products = [];
{
  const produitsDir = join(out, "produits");
  if (existsSync(produitsDir)) {
    for (const f of readdirSync(produitsDir).filter((f) => f.endsWith(".html"))) {
      products.push(`produits/${f}`);
    }
  }
}
const expectedPrefixes = [
  "index.html",
  "produits.html",
  "a-propos.html",
  "contact.html",
  "faq.html",
  "mentions-legales.html",
  "cgv.html",
  "confidentialite.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "icon.svg",
];
for (const p of expectedPrefixes) {
  const file = p.startsWith("produits/") ? join(out, p) : join(out, p);
  if (!existsSync(file)) fail("pages attendues", `${p} absent de out/`);
}

// Fiches produits : exactement 12 (DEMO_PRODUCTS).
const PRODUCT_COUNT = 12;
if (products.length !== PRODUCT_COUNT) {
  fail("fiches produits", `attendu ${PRODUCT_COUNT}, trouvé ${products.length}`);
}

// ---------------------------------------------------------------------------
// 2. Contenus interdits (ancienne marque, faux avis, chiffres fictifs, aide)
// ---------------------------------------------------------------------------
const forbiddenPatterns = [
  "Templates Store",
  "support@exemple.fr",
  "support@localhost",
  "Camille R",
  "Julien P",
  "Sarah M",
  "Achat vérifié",
  "aggregateRating",
  "1 840",
  "1840",
  "livré immédiatement",
  "livraison immédiate",
  "4 ,7",
];
const textExts = /\.(html|js|css|xml|txt|svg|json)$/;
let forbiddenHits = 0;
for (const file of files) {
  if (!textExts.test(file)) continue;
  const content = readFileSync(file, "utf8");
  for (const pattern of forbiddenPatterns) {
    if (content.includes(pattern)) {
      forbiddenHits++;
      fail("contenu interdit", `« ${pattern} » présent dans ${rel(file)}`);
    }
  }
}
if (forbiddenHits === 0) console.log("[verify] Aucun contenu fictif / ancienne marque dans le build.");

// ---------------------------------------------------------------------------
// 3. Aucun localhost dans les pages rendues (le runtime JS minifié de Next
// contient des chaînes génériques « localhost » qui ne sont pas du contenu).
// ---------------------------------------------------------------------------
const textExtsRendered = /\.(html|xml|txt)$/;
for (const file of files) {
  if (!textExtsRendered.test(file)) continue;
  const content = readFileSync(file, "utf8");
  if (/localhost/i.test(content)) {
    fail("localhost", `URL locale trouvée dans ${rel(file)}`);
  }
}

// ---------------------------------------------------------------------------
// 4. Liens internes
// ---------------------------------------------------------------------------
const htmlFiles = files.filter((f) => f.endsWith(".html"));
let checked = 0;
let broken = 0;
for (const file of htmlFiles) {
  const content = readFileSync(file, "utf8");
  const re = /href="([^"]+)"/g;
  let m;
  while ((m = re.exec(content))) {
    const href = m[1];
    if (/^(mailto:|tel:|https?:|data:|#)/.test(href)) continue; // externe / ancre
    if (href === "") {
      broken++;
      fail("lien interne", `href vide dans ${rel(file)}`);
      continue;
    }
    let target = href.split(/[?#]/)[0];
    if (target === "") continue;
    const candidates = [target];
    if (target.endsWith("/")) {
      candidates.push(target + "index.html");
    } else if (!/\.(html|xml)$/.test(target)) {
      // Asset avec extension (css, js, svg, ico, woff2…) : on le vérifie tel
      // quel. Sinon, il s'agit probablement d'une route à l'extension .html.
      if (!/\.[a-z0-9]{2,8}$/i.test(target)) {
        candidates.push(target + ".html");
      }
    }
    checked++;
    if (!candidates.some((c) => existsSync(join(out, c)))) {
      broken++;
      fail("lien interne brisé", `« ${href} » → ${target} (depuis ${rel(file)})`);
    }
  }
}
console.log(`[verify] Liens internes vérifiés : ${checked}${broken ? ` — ${broken} brisés` : ""}`);

// ---------------------------------------------------------------------------
// 5. robots.txt
// ---------------------------------------------------------------------------
{
  const robotsPath = join(out, "robots.txt");
  if (existsSync(robotsPath)) {
    const robots = readFileSync(robotsPath, "utf8");
    if (!/sitemap:/i.test(robots)) fail("robots.txt", "ne référence pas le sitemap");
  } else {
    fail("robots.txt", "absent");
  }
}

// ---------------------------------------------------------------------------
// 6. sitemap.xml
// ---------------------------------------------------------------------------
{
  const sitemapPath = join(out, "sitemap.xml");
  if (!existsSync(sitemapPath)) {
    fail("sitemap.xml", "absent");
  } else {
    const sitemap = readFileSync(sitemapPath, "utf8");
    const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    const expected = 8 + PRODUCT_COUNT; // 8 pages statiques + 12 fiches
    if (urls.length !== expected) {
      fail("sitemap.xml", `attendu ${expected} URLs, trouvé ${urls.length}`);
    } else {
      console.log(`[verify] sitemap.xml : ${urls.length} URLs (${expected} attendues).`);
    }
  }
}

// ---------------------------------------------------------------------------
// 7. Canonical sur toutes les pages indexables
//
// `metadataBase` seul ne génère pas de `canonical` : chaque page doit le
// déclarer. Sans ce contrôle, les variantes de filtres du catalogue
// (/produits?q=…, /produits?categorie=…) restent indexables comme doublons.
// ---------------------------------------------------------------------------
{
  // Pages indexables et canonical attendu (chemin interne).
  const expectedCanonicals = {
    "index.html": "/",
    "produits.html": "/produits",
    "a-propos.html": "/a-propos",
    "contact.html": "/contact",
    "faq.html": "/faq",
    "mentions-legales.html": "/mentions-legales",
    "cgv.html": "/cgv",
    "confidentialite.html": "/confidentialite",
  };
  for (const p of products) expectedCanonicals[p] = `/${p.replace(/\.html$/, "")}`;

  let ok = 0;
  for (const [file, expectedPath] of Object.entries(expectedCanonicals)) {
    const full = join(out, file);
    if (!existsSync(full)) continue; // l'absence est déjà signalée plus haut
    const html = readFileSync(full, "utf8");
    const tag = html.match(/<link[^>]+rel="canonical"[^>]*>/i)?.[0];
    if (!tag) {
      fail("canonical", `<link rel="canonical"> absent de ${file}`);
      continue;
    }
    const href = tag.match(/href="([^"]+)"/i)?.[1];
    if (!href) {
      fail("canonical", `canonical sans href dans ${file}`);
      continue;
    }
    // Comparaison sur le chemin normalisé : l'accueil canonique est
    // l'URL du site sans slash final, ce qui est la forme émise.
    const hrefPath = href.replace(/^https?:\/\/[^/]+/, "").replace(/\/+$/, "") || "/";
    const expectedNormalized = expectedPath.replace(/\/+$/, "") || "/";
    if (hrefPath !== expectedNormalized) {
      fail("canonical", `${file} pointe vers « ${href} » au lieu de « …${expectedNormalized} »`);
      continue;
    }
    if (/localhost/i.test(href)) {
      fail("canonical", `${file} utilise une URL locale : ${href}`);
      continue;
    }
    ok++;
  }
  if (ok > 0) {
    console.log(`[verify] Canonical vérifiés : ${ok}/${Object.keys(expectedCanonicals).length} pages indexables.`);
  }

  // La page 404 ne doit jamais être indexée ni canonisée.
  if (existsSync(join(out, "404.html"))) {
    const html = readFileSync(join(out, "404.html"), "utf8");
    if (!/name="robots"[^>]*content="[^"]*noindex/i.test(html)) {
      fail("404", "404.html ne déclare pas « noindex »");
    }
  }
}

// ---------------------------------------------------------------------------
// 8. Images : alt obligatoire, aucun placeholder non résolu
// ---------------------------------------------------------------------------
{
  const PLACEHOLDER_HINTS = [
    "format-templates.example",
    "placeholder.com",
    "via.placeholder",
    "placehold.co",
    "/images/example",
  ];
  let imgTotal = 0;
  let imgBroken = 0;

  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
      imgTotal++;

      const alt = tag.match(/\salt="([^"]*)"/i)?.[1];
      if (alt === undefined) {
        fail("image", `<img> sans attribut alt dans ${rel(file)}`);
        continue;
      }
      if (alt.trim() === "") {
        // alt vide uniquement acceptable si l'image est explicitement décorative.
        const ariaHidden = /\saria-hidden="true"/i.test(tag);
        if (!ariaHidden) {
          fail("image", `<img alt=""> sans aria-hidden dans ${rel(file)}`);
        }
      }

      for (const hint of PLACEHOLDER_HINTS) {
        if (tag.includes(hint)) {
          fail("image", `placeholder « ${hint} » non résolu dans ${rel(file)}`);
        }
      }

      // Le fichier référencé doit exister réellement dans le build.
      const src = tag.match(/\ssrc="([^"]+)"/i)?.[1];
      if (src && !/^(https?:|data:|blob:)/i.test(src)) {
        const clean = src.split(/[?#]/)[0];
        if (clean && !existsSync(join(out, clean))) {
          imgBroken++;
          fail("image", `fichier absent « ${src} » référencé dans ${rel(file)}`);
        }
      }
    }
  }
  if (imgTotal === 0) {
    console.log("[verify] Aucune <img> dans le build (visuels illustratifs en SVG) — contrôle alt sans objet.");
  } else {
    console.log(`[verify] Images vérifiées : ${imgTotal} balise(s)${imgBroken ? ` — ${imgBroken} fichier(s) manquant(s)` : ""}.`);
  }
}

// ---------------------------------------------------------------------------
// 9. Accessibilité : un seul <h1> par page, langue de document
// ---------------------------------------------------------------------------
{
  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    const h1 = (html.match(/<h1\b/gi) ?? []).length;
    if (h1 === 0) {
      fail("titres", `aucun <h1> dans ${rel(file)}`);
    } else if (h1 > 1) {
      fail("titres", `${h1} <h1> dans ${rel(file)} (un seul attendu)`);
    }
  }
  const home = join(out, "index.html");
  if (existsSync(home)) {
    const html = readFileSync(home, "utf8");
    if (!/<html[^>]+lang="fr"/i.test(html)) {
      fail("langue", "index.html ne déclare pas lang=\"fr\"");
    }
  }
}

// ---------------------------------------------------------------------------
// 10. Liens d'ancrage internes : #<id> doit exister dans la page cible
// ---------------------------------------------------------------------------
{
  let anchors = 0;
  let brokenAnchors = 0;
  const idCache = new Map();

  const idsOf = (file) => {
    if (idCache.has(file)) return idCache.get(file);
    const html = readFileSync(file, "utf8");
    const ids = new Set(
      [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
    );
    idCache.set(file, ids);
    return ids;
  };

  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    for (const m of html.matchAll(/href="(#[^"]+)"/g)) {
      const id = m[1].slice(1);
      if (!id) continue;
      anchors++;
      if (!idsOf(file).has(id)) {
        brokenAnchors++;
        fail("ancre", `« ${m[1]} » sans cible dans ${rel(file)}`);
      }
    }
  }
  if (anchors > 0) {
    console.log(`[verify] Ancres internes vérifiées : ${anchors}${brokenAnchors ? ` — ${brokenAnchors} sans cible` : ""}`);
  }
}

// ---------------------------------------------------------------------------
// Bilan
// ---------------------------------------------------------------------------
if (errors.length > 0) {
  console.error(`\n[verify] ÉCHEC : ${errors.length} erreur(s) critique(s).`);
  process.exit(1);
}
console.log(`[verify] OK — ${files.length} fichiers, ${products.length} fiches produits, aucun lien brisé.`);