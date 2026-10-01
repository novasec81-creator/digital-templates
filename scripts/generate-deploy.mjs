/**
 * Génère le dossier final de déploiement `dist/` (copie de `out/`)
 * puis l'archive `dist.zip`, destinés à l'upload Cloudflare Pages.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateRawSync } from "node:zlib";

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

function listFiles(dir, prefix = "") {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = resolve(dir, e.name);
    const entry = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...listFiles(p, entry));
    else out.push({ path: p, entry });
  }
  return out;
}

const files = listFiles(dist);
const count = files.length;

/**
 * Écriture d'un ZIP minimal (deflate) avec des séparateurs `/` en Always-Forward-Slash.
 * `Compress-Archive` produit des entrées `dossier\fichier` sous Windows : ces
 * antislashs ne sont pas conformes au format ZIP et cassent l'extraction côté
 * Cloudflare Pages (Linux). On écrit donc l'archive nous-mêmes.
 */
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

const localParts = [];
const centralParts = [];
let offset = 0;

for (const file of files) {
  const data = readFileSync(file.path);
  const nameBuf = Buffer.from(file.entry, "utf8");
  const crc = crc32(data);
  const deflated = deflateRawSync(data, { level: 9 });
  const useDeflate = deflated.length < data.length;
  const payload = useDeflate ? deflated : data;
  const method = useDeflate ? 8 : 0;

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x0800, 6); // drapeau UTF-8
  local.writeUInt16LE(method, 8);
  local.writeUInt16LE(0x21, 10); // date DOS fixe (01/01/1980) : build reproductible
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(payload.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  localParts.push(local, nameBuf, payload);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0x0800, 8);
  central.writeUInt16LE(method, 10);
  central.writeUInt16LE(0x21, 12); // même date DOS que l'entrée locale
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(payload.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(nameBuf.length, 28);
  central.writeUInt32LE(offset, 42);
  centralParts.push(central, nameBuf);

  offset += local.length + nameBuf.length + payload.length;
}

const centralBuf = Buffer.concat(centralParts);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(centralBuf.length, 12);
end.writeUInt32LE(offset, 16);

rmSync(zipPath, { force: true });
writeFileSync(zipPath, Buffer.concat([...localParts, centralBuf, end]));

const sizeMb = (statSync(zipPath).size / (1024 * 1024)).toFixed(2);
console.log(`[deploy] dist/ prêt : ${count} fichiers.`);
console.log(`[deploy] dist.zip : ${sizeMb} Mo.`);