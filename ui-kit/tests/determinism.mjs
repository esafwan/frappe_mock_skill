// Render every sample twice (fresh loads) and require byte-identical output, zero warnings unless listed. node tests/determinism.mjs [samples...]
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { loadSpec, renderSpec } from '../bin/mock.mjs';
const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const files = (args.length ? args : fs.readdirSync(path.join(KIT, 'samples')).filter((f) => f.endsWith('.json')).map((f) => path.join('samples', f))).sort();
let bad = 0;
for (const f of files) {
  const abs = path.resolve(KIT, f);
  const out = path.join(KIT, 'out', 'slice4', path.basename(f, '.json') + '.html');
  const a = await renderSpec(loadSpec(abs), { outFile: out }), b = await renderSpec(loadSpec(abs), { outFile: out });
  const same = a.html === b.html;
  fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, a.html); // keep out/slice4/ current for shots and geometry
  if (!same || a.warnings.length) { bad++; console.log(`FAIL ${f}${same ? '' : ' (not byte-identical)'}${a.warnings.length ? ' warnings: ' + a.warnings.join(' | ') : ''}`); }
}
console.log(`determinism: ${files.length} samples, ${bad} problems`);
process.exit(bad ? 1 : 0);
