/**
 * Génère le dossier final de déploiement `dist/` (copie de `out/`)
 * puis l'archive `dist.zip`, destinés à l'upload Cloudflare Pages.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "out");
const dist = resolve(root, "dist");
const zipPath = resolve(root, "dist.zip");

if (!existsSync(out)) {
  console.error("[deploy] Le dossier out/ n'existe pas. Lancez d'abord npm run build.");
  process.exit(1);
}

mkdirSync(dist, { recursive: true });
cpSync(out, dist, { recursive: true, force: true });

const fileCount = (dir) => {
  let n = 0;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = resolve(d, e.name);
      if (e.isDirectory()) walk(p);
      else n++;
    }
  };
  walk(dir);
  return n;
};
const count = fileCount(dist);

try {
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${dist}\\*' -DestinationPath '${zipPath}' -Force"`, { stdio: "ignore" });
} catch {
  console.error("[deploy] Échec de la création de dist.zip.");
  process.exit(1);
}

const sizeMb = (statSync(zipPath).size / (1024 * 1024)).toFixed(2);
console.log(`[deploy] dist/ prêt : ${count} fichiers.`);
console.log(`[deploy] dist.zip : ${sizeMb} Mo.`);