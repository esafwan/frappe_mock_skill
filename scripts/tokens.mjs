import { open, go, BASE, ROOT } from './lib.mjs';
import fs from 'fs'; import path from 'path';
const T = ROOT + 'tokens/'; for (const d of ['css','fonts','icons']) fs.mkdirSync(T + d, { recursive: true });
const { browser, page, ctx } = await open();
await go(page, '/desk');
const sheets = await page.evaluate(() => [...document.styleSheets].map(s => s.href).filter(Boolean));
const get = async (u) => Buffer.from(await (await page.request.get(u)).body());
const fontsSeen = new Set(); const names = {};
for (const href of sheets) {
  let css = (await get(href)).toString();
  const base = href.replace(/[^/]*$/, '');
  const m = href.match(/\/assets\/(\w+)\/dist\/css\/(\w+)\.bundle/); const name = m ? `${m[1]}-${m[2]}.css` : path.basename(href);
  css = await replaceAsync(css, /url\(["']?([^)"']+)["']?\)/g, async (full, u) => {
    if (u.startsWith('data:') || u.startsWith('#')) return full;
    const abs = new URL(u, href).href; const fn = path.basename(abs.split('?')[0]);
    const ext = fn.split('.').pop(); const dir = /woff2?|ttf|otf/.test(ext) ? 'fonts' : 'icons';
    try { const r = await page.request.get(abs); if (!r.ok()) return full; fs.writeFileSync(T + dir + '/' + fn, await r.body()); return `url("../${dir}/${fn}")`; } catch { return full; }
  });
  fs.writeFileSync(T + 'css/' + name, css); names[name] = href;
}
async function replaceAsync(s, re, fn) { const ms = [...s.matchAll(re)]; const out = await Promise.all(ms.map(m => fn(...m))); let i = 0; return s.replace(re, () => out[i++]); }
// icon sprite
const sprite = await page.evaluate(() => [...document.querySelectorAll('svg')].filter(s => s.querySelector('symbol')).map(s => s.outerHTML).join('\n'));
fs.writeFileSync(T + 'icons/sprite.svg.html', sprite);
// css variables light/dark
const vars = async (theme) => { await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
  return page.evaluate(() => { const cs = getComputedStyle(document.documentElement); const o = {};
    for (const s of document.styleSheets) { let rules; try { rules = s.cssRules } catch { continue }
      const walk = (rs) => { for (const r of rs) { if (r.cssRules && !r.selectorText) walk(r.cssRules); if (r.style) for (const p of r.style) if (p.startsWith('--')) o[p] = cs.getPropertyValue(p).trim(); } }; walk(rules); }
    return o; }); };
const light = await vars('light'), dark = await vars('dark');
const fmt = (sel, o) => `${sel} {\n${Object.entries(o).sort().map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`;
fs.writeFileSync(T + 'css/theme-vars.css', fmt(':root,[data-theme="light"]', light) + fmt('[data-theme="dark"]', dark));
fs.writeFileSync(T + 'tokens.json', JSON.stringify({ source: BASE, bundles: names, lightVarCount: Object.keys(light).length, darkVarCount: Object.keys(dark).length, light, dark }, null, 1));
console.log(Object.keys(names), Object.keys(light).length, Object.keys(dark).length, fs.readdirSync(T + 'fonts').length, sprite.length);
await browser.close();
