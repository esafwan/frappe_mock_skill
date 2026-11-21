// ury-self-order: aggregates scripts/ury-v16/self-order/*.spec.mjs (static URY v16 mocks)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'ury-v16', 'self-order');
export const specs = (await Promise.all(fs.readdirSync(dir).filter((f) => f.endsWith('.spec.mjs')).sort().map((f) => import(pathToFileURL(path.join(dir, f)).href)))).flatMap((m) => m.specs);
const seen = new Set();
for (const s of specs) {
  if (!/^ury-self-order-/.test(s.id)) throw new Error('ury-self-order: id must match ^ury-self-order-: ' + s.id);
  if (seen.has(s.id)) throw new Error('ury-self-order: duplicate id ' + s.id);
  seen.add(s.id);
}
