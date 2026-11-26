// Hygiene gate: no undefined / NaN / [object Object] / {{ in any out/**.html (visible text and markup).
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'out');
const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (e.name === 'node_modules' ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []) : [];
const pats = [['undefined', /\bundefined\b/], ['NaN', /\bNaN\b/], ['[object Object]', /\[object Object\]/], ['{{', /\{\{/]];
const strip = (s) => s.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');
const files = walk(root).sort(); const bad = [];
for (const f of files) {
  const t = strip(fs.readFileSync(f, 'utf8'));
  for (const [n, re] of pats) { const m = re.exec(t); if (m) bad.push(`${path.relative(root, f)}: ${n} ...${t.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ')}...`); }
}
console.log(`hygiene: ${files.length} files, ${bad.length} problems`);
for (const b of bad) console.log('  FAIL ' + b);
process.exit(bad.length ? 1 : 0);
