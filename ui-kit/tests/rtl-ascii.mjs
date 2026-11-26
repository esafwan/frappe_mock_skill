// RTL translation gate: on locale=ar pages, text nodes that are Latin-only and outside <bdi> must be listed in
// tests/rtl-ascii-allowlist.json (per sample: strings). The list is the known-gap baseline; new untranslated or
// un-isolated text fails. Run: node tests/rtl-ascii.mjs [--update]  (--update rewrites the allowlist; review the diff).
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { loadSpec, renderSpec } from '../bin/mock.mjs';
const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AL = path.join(KIT, 'tests', 'rtl-ascii-allowlist.json');
const allow = fs.existsSync(AL) ? JSON.parse(fs.readFileSync(AL, 'utf8')) : {};
const names = fs.readdirSync(path.join(KIT, 'samples')).filter((f) => /^s5-.*-rtl\.json$/.test(f)).map((f) => f.replace(/\.json$/, '')).sort();
const found = {}; const bad = [];
for (const n of names) {
  const l = loadSpec(path.join(KIT, 'samples', n + '.json'));
  if (!l.ok) { bad.push(`${n}: invalid spec`); continue; }
  let h = (await renderSpec(l)).html;
  h = h.replace(/<(script|style|svg)[\s\S]*?<\/\1>/g, '').replace(/<bdi[\s\S]*?<\/bdi>/g, '');
  const t = [...h.matchAll(/>([^<>]+)</g)].map((m) => m[1].replace(/&amp;/g, '&').trim())
    .filter((s) => /[A-Za-z]{2}/.test(s) && !/[؀-ۿ]/.test(s));
  found[n] = [...new Set(t)].sort();
  for (const s of found[n]) if (!(allow[n] || []).includes(s)) bad.push(`${n}: untranslated/unisolated text "${s}"`);
}
if (process.argv.includes('--update')) { fs.writeFileSync(AL, JSON.stringify(found, null, 1) + '\n'); console.log('rtl-ascii: allowlist rewritten'); process.exit(0); }
if (bad.length) { console.error(bad.join('\n')); console.error(`rtl-ascii: ${bad.length} new Latin-only text nodes`); process.exit(1); }
console.log(`rtl-ascii: ${names.length} ar samples, no new Latin-only text outside the allowlist (${Object.values(allow).flat().length} known gaps)`);
