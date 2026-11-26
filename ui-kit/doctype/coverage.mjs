import fs from 'node:fs'; import path from 'node:path';
const H = path.dirname(new URL(import.meta.url).pathname);
const rend = {};
for (const f of fs.readdirSync(H + '/fields').filter(x => x.endsWith('.mjs')).sort()) {
  const m = (await import(H + '/fields/' + f)).default;
  for (const k of Object.keys(m)) rend[k] ??= 'fields/' + f;
}
const seen = {};
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name);
  if (e.isDirectory()) { if (e.name !== 'samples') walk(p); } else if (e.name.endsWith('.json')) {
    try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); for (const f of j.fields || []) { const k = f.fieldtype === 'Data' && f.options && rend['Data:' + f.options] ? 'Data:' + f.options : f.fieldtype; seen[k] = (seen[k] || 0) + 1; } } catch {} } } };
walk(H + '/fixtures');
const map = {}; let impl = 0, fb = 0;
for (const [k, n] of Object.entries(seen).sort()) { const r = rend[k] || 'fallback'; map[k] = { renderer: r, count: n }; r === 'fallback' ? fb++ : impl++; }
fs.writeFileSync(H + '/out/coverage.json', JSON.stringify({ implemented: impl, fallback: fb, fieldtypes: map }, null, 2));
console.log(impl, fb, Object.entries(map).filter(([, v]) => v.renderer === 'fallback').map(([k]) => k).join(','));
