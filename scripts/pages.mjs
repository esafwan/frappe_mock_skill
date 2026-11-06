// node scripts/pages.mjs build [ids]   -> pages/<id>.html assembled ONLY from components/<id>/component.html
// node scripts/pages.mjs verify [ids]  -> screenshot composed page (JS off) vs live page at 1440x900@2x, fail > 0.5%
import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright'; import { PNG } from 'pngjs'; import pixelmatch from 'pixelmatch';
import { ROOT, open, go } from './lib.mjs'; import { harnessDoc, fill } from './engine.mjs'; import { slotValues } from '../tools/render.mjs';
const [cmd = 'build', ...only] = process.argv.slice(2);
const specs = fs.readdirSync(ROOT + 'pages').filter(f => f.endsWith('.page.json')).map(f => JSON.parse(fs.readFileSync(ROOT + 'pages/' + f))).filter(p => !only.length || only.includes(p.id));
const sprite = (html) => { const m = {}; for (const x of fs.readFileSync(ROOT + 'tokens/icons/sprite.svg.html', 'utf8').matchAll(/<symbol[^>]*id="([^"]+)"[\s\S]*?<\/symbol>/g)) m[x[1]] = x[0];
  const ids = new Set([...html.matchAll(/href="#([^"]+)"/g)].map(x => x[1])); const s = [...ids].filter(i => m[i]).map(i => m[i]).join(''); return s ? `<svg class="icon-sprite" aria-hidden="true" style="display:none">${s}</svg>` : ''; };
export function buildPage(p, opts = {}) {
  const used = new Set(); const o = { locale: p.locale, menu: p.menu, theme: p.theme, ...opts };
  let shell = p.shell.replace(/<!--component:([a-z0-9-]+)-->/g, (m, id) => { used.add(id); const html = fs.readFileSync(ROOT + `components/${id}/component.html`, 'utf8'); const vals = { ...slotValues(id, { ...o, base: 'pages' }), ...((p.values || {})[id] || {}) }; for (const k in vals) if (typeof vals[k] === 'string' && vals[k].startsWith('assets/')) vals[k] = `../components/${id}/assets/${vals[k].slice(7)}`; return fill(html, vals); });
  const first = JSON.parse(fs.readFileSync(ROOT + `components/${[...used][0]}/harness.json`));
  const meta = { ...first, ancestors: (p.bodyFrom ? JSON.parse(fs.readFileSync(ROOT + `components/${p.bodyFrom}/harness.json`)) : first).ancestors.filter(a => a.tag === 'html' || a.tag === 'body').map(a => ({ ...a, attrs: Object.fromEntries(Object.entries(a.attrs).map(([k, v]) => [k, v])) })), cssBase: '../tokens/css/', css: p.css || first.css, size: { w: 1440 }, bg: first.bg, origin: { x: 0, y: 0 } };
  let doc = harnessDoc(meta, sprite(shell) + shell, { dark: o.theme === 'dark', rtl: !!p.rtl, title: p.title });
  doc = doc.replace(/<div id="ui-kit-stage">/, '<div id="ui-kit-stage" class="ui-kit-page">').replace(/#ui-kit-stage\{[^}]*\}/, '#ui-kit-stage{display:contents}');
  if (p.inlineCssFrom) doc = doc.replace('</head>', `<style>${p.inlineCssFrom.map(id => { const f = ROOT + `components/${id}/inline.css`; return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : ''; }).join('\n')}</style></head>`);
  return { doc, used: [...used] };
}
if (cmd === 'build' || cmd === 'verify') for (const p of specs) { const { doc, used } = buildPage(p); fs.writeFileSync(ROOT + `pages/${p.id}.html`, doc); console.log('built', p.id, used.join(','));
  fs.writeFileSync(ROOT + `pages/${p.id}.dark.html`, buildPage({ ...p, theme: 'dark' }).doc);
  fs.writeFileSync(ROOT + `pages/${p.id}.ar-AED.html`, buildPage({ ...p, locale: 'ar-AE/AED', rtl: true, lang: 'ar' }, { lang: 'ar' }).doc);
  fs.writeFileSync(ROOT + `pages/${p.id}.en-EUR.html`, buildPage({ ...p, locale: 'de-DE/EUR' }).doc); }
if (cmd === 'verify') {
  const { browser, page } = await open(); const b2 = await chromium.launch(); let fail = 0;
  for (const p of specs) {
    await go(page, p.url, { dark: p.theme === 'dark' }); if (p.prepare) await eval(p.prepare)(page); await page.waitForTimeout(1500); await page.mouse.move(0, 0);
    await page.evaluate(() => document.querySelectorAll('#ury-return-to-app').forEach(e => e.remove()));
    const live = await page.screenshot({ path: ROOT + `pages/${p.id}.png` });
    const ctx = await b2.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, javaScriptEnabled: false }); const pg = await ctx.newPage(); await pg.goto('file://' + ROOT + `pages/${p.id}.html`); await pg.waitForTimeout(300);
    const mine = await pg.screenshot({ path: ROOT + `pages/${p.id}.composed.png` }); await ctx.close();
    const a = PNG.sync.read(live), b = PNG.sync.read(mine); const d = new PNG({ width: a.width, height: a.height }); const n = pixelmatch(a.data, b.data, d.data, a.width, a.height, { threshold: 0.1 }); const pct = n / (a.width * a.height);
    fs.writeFileSync(ROOT + `pages/${p.id}.diff.png`, PNG.sync.write(d)); const ok = pct <= 0.005; if (!ok) fail++; console.log(ok ? 'PASS' : 'FAIL', p.id, (pct * 100).toFixed(3) + '%');
  }
  await browser.close(); await b2.close(); process.exit(fail ? 1 : 0);
}
