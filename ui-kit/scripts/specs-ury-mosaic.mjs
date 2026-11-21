// ury-mosaic: aggregates scripts/ury-v16/mosaic/*.spec.mjs (static URY v16 mocks)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'ury-v16', 'mosaic');
export const specs = (await Promise.all(fs.readdirSync(dir).filter((f) => f.endsWith('.spec.mjs')).sort().map((f) => import(pathToFileURL(path.join(dir, f)).href)))).flatMap((m) => m.specs);
const seen = new Set();
for (const s of specs) {
  if (!/^ury-mosaic-/.test(s.id)) throw new Error('ury-mosaic: id must match ^ury-mosaic-: ' + s.id);
  if (seen.has(s.id)) throw new Error('ury-mosaic: duplicate id ' + s.id);
  seen.add(s.id);
}
