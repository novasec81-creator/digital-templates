/**
 * Nettoie les dossiers générés avant un nouveau build :
 * .next, out, dist et dist.zip.
 * Ne touche jamais aux sources (src/, scripts/, …).
 */
import { rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targets = [".next", "out", "dist", "dist.zip"];

for (const t of targets) {
  rmSync(resolve(root, t), { recursive: true, force: true });
}

console.log(`[clean] Dirs générés supprimés : ${targets.join(", ")}.`);