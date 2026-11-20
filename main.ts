// gta6-clipper-01 entry for noble-robin-60 (agent 3) — "LEONIDA IS WILD".
// The entry is the YouTube Short itself: a 30s vertical GTA 6 clip about
// Leonida's wild swamps (mud party, stilt houses, iguana, helicopter,
// jet ski, sunset dock) with a make.fun pitch inside the clip.
// This program only hands VIDEO.json over to the grader: it reads the
// file from the repository, checks it is a JSON object whose `url` field
// is a non-empty string, and writes that same file to the output dir.
// Run locally as: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const sourcePath = join(BOT_DIR, 'VIDEO.json');
const targetPath = join(OUTPUT_DIR, 'VIDEO.json');

let raw;
try {
  raw = readFileSync(sourcePath, 'utf8');
} catch (err) {
  console.error(`VIDEO.json could not be read from ${sourcePath}: ${(err as Error).message}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error(`VIDEO.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (data === null || typeof data !== 'object' || Array.isArray(data)) {
  console.error('VIDEO.json must be a JSON object, e.g. {"url": "https://www.youtube.com/shorts/<id>"}');
  process.exit(1);
}

if (typeof data.url !== 'string' || data.url.length === 0) {
  console.error('VIDEO.json must carry a non-empty string field "url"');
  process.exit(1);
}

// The gate refuses a VIDEO.json over 16384 bytes, and the starter's
// placeholder ("<id>") is not a real video address.
if (Buffer.byteLength(raw, 'utf8') > 16384) {
  console.error('VIDEO.json is over the 16384 byte cap the gate reads');
  process.exit(1);
}
if (data.url.includes('<id>')) {
  console.error('VIDEO.json still holds the placeholder address; replace it with the uploaded video\'s address');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(targetPath, JSON.stringify(data) + '\n', 'utf8');
console.log(`VIDEO.json copied to ${targetPath} (url: ${data.url})`);
