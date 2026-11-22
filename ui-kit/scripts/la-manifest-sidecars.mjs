// Folds every pages/la sidecar (*.manifest.json measured boxes, *.page.json, *.targets.json, *.boxes.json) into manifest.json
// so each committed LA page variant has a manifest entry with per-target pixel boxes. Idempotent; never removes existing entries.
// Run after the page generators/measurers: node scripts/la-manifest-sidecars.mjs
import fs from 'fs'; import { ROOT } from './lib.mjs';
const dir = ROOT + 'pages/la/'; const m = JSON.parse(fs.readFileSync(ROOT + 'manifest.json'));
const box = t => { const b = t.box || t; return { id: t.id, ...(t.tag ? { tag: t.tag } : {}), box: { x: b.x, y: b.y, w: b.w, h: b.h } }; };
const known = new Set(); for (const p of Object.values(m.pages)) { const vs = Array.isArray(p.variants) ? p.variants : Object.values(p.variants || {}); for (const v of vs) if (v.file) known.add(v.file); if (p.html) known.add(p.html); }
const fileOf = (k, v) => (v && v.file) || (k.endsWith('.html') ? 'pages/la/' + k : 'pages/la/' + k + '.html');
const rank = f => f.endsWith('.manifest.json') ? 0 : f.endsWith('.boxes.json') ? 1 : f.endsWith('.targets.json') ? 2 : 3; // measured first
let added = 0;
for (const f of fs.readdirSync(dir).filter(x => /\.(manifest|page|targets|boxes)\.json$/.test(x)).sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))) {
  const j = JSON.parse(fs.readFileSync(dir + f)); const base = f.replace(/\.(manifest|page|targets|boxes)\.json$/, ''); let id = j.id || 'la-' + base;
  if (j.boxes && !Array.isArray(j.boxes)) { j.variants = Object.fromEntries(Object.entries(j.boxes).map(([k, o]) => [k, Object.entries(o).map(([tid, a]) => ({ id: tid, x: a[0], y: a[1], w: a[2], h: a[3] }))])); }
  if (!j.variants && !j.id) j.variants = Object.fromEntries(Object.entries(j).map(([k, o]) => [k, Object.entries(o).map(([tid, a]) => Array.isArray(a) ? { id: tid, x: a[0], y: a[1], w: a[2], h: a[3] } : { id: tid, ...a })]));
  let entries = Array.isArray(j.variants) ? j.variants.map(v => [v.id || v.name || v.file, v]) : Object.entries(j.variants || {});
  for (const [k, v] of entries) {
    const file = fileOf(String(k), Array.isArray(v) ? null : v); if (known.has(file) || !fs.existsSync(ROOT + file)) continue;
    const targets = (Array.isArray(v) ? v : v.targets || v.boxes || []).filter(t => t && t.id).map(box); if (!targets.length) continue;
    const p = m.pages[id] ||= { id, title: j.title, system: j.system || 'loyal-arrow-desk', group: 'la', viewport: j.viewport, reference: j.reference, source: 'pages/la/' + f, variants: {} };
    if (Array.isArray(p.variants)) p.variants.push({ file, targets }); else p.variants[file.replace(/^pages\/la\//, '').replace(/\.html$/, '')] = { file, ...(v.theme ? { theme: v.theme, lang: v.lang, currency: v.currency, state: v.state } : {}), targets };
    known.add(file); added++; }
}
fs.writeFileSync(ROOT + 'manifest.json', JSON.stringify(m, null, 2)); console.log('la-manifest-sidecars: added', added, 'variants');
