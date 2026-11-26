#!/usr/bin/env node
// sheet: contact sheet of every sample. Renders each samples/*.json to <out>/<name>.html and writes <out>/index.html
// with scaled live thumbnails (iframes) grouped by page, linking to the full render.
//
//   node bin/sheet.mjs [--samples dir] [--out dir] [--scale 0.25] [--filter substr]
//
// Integrator: `import { main, buildSheet } from './sheet.mjs'` and call main(argv). Default out: out/sheet.
// Failed renders appear as red tiles with the message. Deterministic, Node 18, no dependencies, generic.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSpec, renderSpec } from './mock.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function buildSheet({ samplesDir = path.join(KIT, 'samples'), outDir = path.join(KIT, 'out', 'sheet'), scale = 0.25, filter = '' } = {}) {
  fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(samplesDir).filter((f) => f.endsWith('.json') && f.includes(filter)).sort();
  const tiles = [];
  for (const f of files) {
    const name = path.basename(f, '.json');
    const outFile = path.join(outDir, `${name}.html`);
    const tile = { name, page: 'unknown', width: 1440, height: 900, ok: false, warnings: [], error: '' };
    try {
      const loaded = loadSpec(path.join(samplesDir, f));
      tile.page = loaded.raw?.page || 'unknown';
      if (!loaded.ok) throw new Error(loaded.errors.map((e) => `${e.path}: ${e.message}`).join('; '));
      const vp = loaded.spec.ctx?.viewport;
      const dims = vp === 'mobile' ? [375, 812] : vp === 'tablet' ? [768, 1024] : /^\d+x\d+$/.test(vp || '') ? vp.split('x').map(Number) : [1440, 900];
      [tile.width, tile.height] = dims;
      const res = await renderSpec(loaded, { outFile });
      fs.writeFileSync(outFile, res.html);
      tile.ok = true; tile.warnings = res.warnings;
    } catch (e) { tile.error = String(e.message || e).split('\n')[0]; }
    tiles.push(tile);
  }
  const groups = new Map();
  for (const t of tiles) { if (!groups.has(t.page)) groups.set(t.page, []); groups.get(t.page).push(t); }
  const sections = [...groups.keys()].sort().map((page) => {
    const cards = groups.get(page).map((t) => {
      const w = Math.round(t.width * scale), h = Math.round(t.height * scale);
      const thumb = t.ok
        ? `<a href="${esc(t.name)}.html" target="_blank"><div class="thumb" style="width:${w}px;height:${h}px"><iframe src="${esc(t.name)}.html" loading="lazy" tabindex="-1" style="width:${t.width}px;height:${t.height}px;transform:scale(${scale})"></iframe></div></a>`
        : `<div class="thumb err" style="width:${w}px;height:${h}px">${esc(t.error)}</div>`;
      return `<figure class="${t.ok ? (t.warnings.length ? 'warn' : '') : 'bad'}">${thumb}<figcaption>${esc(t.name)}${t.warnings.length ? ` <b title="${esc(t.warnings.join('\n'))}">${t.warnings.length} warning(s)</b>` : ''}</figcaption></figure>`;
    }).join('\n');
    return `<h2>${esc(page)} <small>${groups.get(page).length}</small></h2><div class="grid">\n${cards}\n</div>`;
  }).join('\n');
  const bad = tiles.filter((t) => !t.ok).length;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Contact sheet</title>
<style>${fs.readFileSync(path.join(KIT, 'kit-lib', 'base.css'), 'utf8').trim()}
body{font:13px/1.4 system-ui,sans-serif;margin:24px;color:var(--kit-ink);background:var(--kit-surface)}
h1{font-size:18px;margin:0 0 4px}h2{font-size:15px;margin:24px 0 8px;border-bottom:1px solid var(--kit-axis-line)}h2 small{color:var(--kit-grey);font-weight:400}
.grid{display:flex;flex-wrap:wrap;gap:16px}figure{margin:0}
.thumb{overflow:hidden;border:1px solid var(--kit-axis-line);border-radius:4px;background:var(--kit-surface-sunken);position:relative}
.thumb iframe{border:0;transform-origin:0 0;pointer-events:none;background:var(--kit-surface)}
.thumb.err{color:var(--kit-bad-ink);background:var(--kit-bad-bg);padding:8px;box-sizing:border-box;font-size:11px;overflow:auto}
figcaption{font-size:11px;margin-top:4px;max-width:360px;word-break:break-all}figcaption b{color:var(--kit-warn-ink)}
figure.bad figcaption{color:var(--kit-bad-ink)}
</style></head><body>
<h1>Contact sheet</h1><p>${tiles.length} samples, ${bad} failed to render.</p>
${sections}
</body></html>
`;
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  return { tiles, bad, index: path.join(outDir, 'index.html') };
}

export async function main(argv = process.argv.slice(2)) {
  const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
  const r = await buildSheet({
    samplesDir: path.resolve(opt('--samples', path.join(KIT, 'samples'))),
    outDir: path.resolve(opt('--out', path.join(KIT, 'out', 'sheet'))),
    scale: Number(opt('--scale', 0.25)), filter: opt('--filter', ''),
  });
  for (const t of r.tiles.filter((x) => !x.ok)) console.log(`FAIL ${t.name}: ${t.error}`);
  console.log(`sheet: ${r.tiles.length} samples, ${r.bad} failed -> ${path.relative(process.cwd(), r.index)}`);
  return r.bad ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(await main());
