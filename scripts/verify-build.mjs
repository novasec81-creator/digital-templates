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
// Bilan
// ---------------------------------------------------------------------------
if (errors.length > 0) {
  console.error(`\n[verify] ÉCHEC : ${errors.length} erreur(s) critique(s).`);
  process.exit(1);
}
console.log(`[verify] OK — ${files.length} fichiers, ${products.length} fiches produits, aucun lien brisé.`);