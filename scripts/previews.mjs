// Regenerate preview*.html for every component from stored component.html + harness.json + slots.json (no bench needed).
import fs from 'fs'; import { ROOT } from './lib.mjs'; import { harnessDoc, fill } from './engine.mjs';
const sprite = fs.readFileSync(ROOT + 'tokens/icons/sprite.svg.html', 'utf8'); const sm = {}; for (const m of sprite.matchAll(/<symbol[^>]*id="([^"]+)"[\s\S]*?<\/symbol>/g)) sm[m[1]] = m[0];
const spriteFor = (h) => { const ids = new Set([...h.matchAll(/(?:xlink:)?href="#([^"]+)"/g)].map(m => m[1])); const s = [...ids].filter(i => sm[i]).map(i => sm[i]).join(''); return s ? `<svg class="icon-sprite" aria-hidden="true" style="display:none">${s}</svg>` : ''; };
const only = process.argv.slice(2);
for (const id of fs.readdirSync(ROOT + 'components')) { const d = ROOT + 'components/' + id + '/'; if (!fs.existsSync(d + 'harness.json') || (only.length && !only.includes(id))) continue;
  const meta = JSON.parse(fs.readFileSync(d + 'harness.json')); const html = fs.readFileSync(d + 'component.html', 'utf8'); const slots = JSON.parse(fs.readFileSync(d + 'slots.json')).slots;
  const body = spriteFor(html) + fill(html, Object.fromEntries(Object.entries(slots).map(([k, v]) => [k, v.sample])));
  fs.writeFileSync(d + 'preview.html', harnessDoc(meta, body, { title: meta.name })); fs.writeFileSync(d + 'preview.dark.html', harnessDoc(meta, body, { dark: true, title: meta.name })); fs.writeFileSync(d + 'preview.rtl.html', harnessDoc(meta, body, { rtl: true, title: meta.name })); }
console.log('previews regenerated');
