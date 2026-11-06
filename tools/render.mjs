#!/usr/bin/env node
// Backend-free renderer for the UI kit. Pure functions + CLI. No network, no clock, no randomness.
//   node tools/render.mjs <component-id> [--locale ar-AE/AED] [--theme dark] [--menu mediterranean] [--lang ar] [--currency SAR]
//        [--set slot=value ...] [--out file.html]
import fs from 'fs'; import path from 'path';
import { harnessDoc, fill } from '../scripts/engine.mjs';
const ROOT = new URL('..', import.meta.url).pathname;
const J = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const exists = (p) => fs.existsSync(path.join(ROOT, p));

export const universals = {
  currencies: () => J('data/universals/currencies.json'), languages: () => J('data/universals/languages.json'),
  locales: () => J('data/universals/locales.json'), i18n: (l) => (exists(`data/universals/i18n/${l}.json`) ? J(`data/universals/i18n/${l}.json`) : {}),
};
export const menus = () => fs.readdirSync(path.join(ROOT, 'data/menus')).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
export const loadMenu = (id) => J(`data/menus/${id}.json`);

export function formatMoney(amount, code, { lang = 'en', useArabicSymbol } = {}) {
  const c = universals.currencies()[code]; if (!c) return String(amount);
  const dec = c.decimals ?? 2; let [i, f = ''] = Math.abs(amount).toFixed(dec).split('.');
  const nf = c.numberFormat || '#,###.##';
  if (nf.startsWith('#,##,')) i = i.length > 3 ? i.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + i.slice(-3) : i;
  else i = i.replace(/\B(?=(\d{3})+(?!\d))/g, c.thousandsSep || ',');
  let num = dec ? `${i}${c.decimalSep || '.'}${f}` : i;
  const sym = (lang === 'ar' || useArabicSymbol) && c.symbolAr ? c.symbolAr : c.symbol;
  const sp = c.space ? ' ' : '';
  return (amount < 0 ? '-' : '') + (c.symbolPosition === 'after' ? `${num}${sp}${sym}` : `${sym}${sp}${num}`);
}
const toArabicDigits = (s) => s.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

const pick = (v, lang) => (v && typeof v === 'object' && !Array.isArray(v) ? (v[lang] ?? v.en ?? Object.values(v)[0]) : v);
function resolve(expr, ctx) { // "menu.items[2].name" | "menu.items[2].price" | "menu.items[2].image" | "menu.categories[1].name" | "menu.name"
  const m = expr.split('|')[0].trim().split('.'); let cur = ctx;
  for (const part of m) { const mm = part.match(/^(\w+)(?:\[(\d+)\])?$/); if (!mm) return undefined; cur = cur?.[mm[1]]; if (mm[2] !== undefined) cur = cur?.[+mm[2]]; }
  const fmt = (expr.split('|')[1] || '').trim();
  if (fmt === 'price') { const p = cur; return p; }
  return cur;
}

export function slotValues(id, opts = {}) {
  const dir = path.join(ROOT, 'components', id); const slots = J(`components/${id}/slots.json`).slots;
  const loc = opts.locale ? universals.locales()[opts.locale] : null;
  const lang = opts.lang || loc?.language || 'en'; const currency = opts.currency || loc?.currency || null;
  const i18n = lang !== 'en' ? universals.i18n(lang) : {};
  const vals = {}; const menu = opts.menu ? loadMenu(opts.menu) : null;
  const bind = exists(`components/${id}/bindings.json`) ? J(`components/${id}/bindings.json`) : {};
  for (const [name, s] of Object.entries(slots)) {
    let v = s.sample;
    if (i18n[v]) v = i18n[v];                                           // fixed UI vocabulary -> language
    if (currency && s.type === 'currency' && /\d/.test(v)) { const num = parseFloat(v.replace(/[^\d.\-]/g, '').replace(/,/g, '')); if (!Number.isNaN(num)) v = formatMoney(num, currency, { lang }); }
    if (bind[name] && menu) {                                            // data-driven (menu JSON)
      const b = bind[name]; const exprs = typeof b === 'string' ? { expr: b } : b;
      const m = exprs.expr.match(/^menu\.items\[(\d+)\]\.(\w+)$/);
      if (m) { const it = menu.items[+m[1]] ?? menu.items[+m[1] % menu.items.length];
        if (m[2] === 'name' || m[2] === 'description') v = pick(it[m[2]], lang);
        else if (m[2] === 'price') { const code = currency || menu.defaultCurrency; v = formatMoney(it.prices?.[code] ?? Object.values(it.prices)[0], code, { lang }); }
        else if (m[2] === 'image') v = it.image.startsWith('data/') ? path.posix.relative(`components/${id}`, it.image) : it.image;
        else if (it[m[2]] !== undefined) v = String(pick(it[m[2]], lang)); }
      const c = exprs.expr.match(/^menu\.categories\[(\d+)\]\.name$/); if (c) v = pick(menu.categories[+c[1] % menu.categories.length].name, lang);
      if (exprs.expr === 'menu.name') v = pick(menu.name, lang);
    }
    if (lang === 'ar' && loc && /^(number|currency)$/.test(s.type) && opts.arabicDigits !== false && loc.numeralSystem === 'arab') v = toArabicDigits(v);
    vals[name] = v;
  }
  return Object.assign(vals, opts.set || {});
}

export function renderComponent(id, opts = {}) {
  const dir = path.join(ROOT, 'components', id);
  const html = fs.readFileSync(path.join(dir, 'component.html'), 'utf8');
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'harness.json'), 'utf8'));
  const loc = opts.locale ? universals.locales()[opts.locale] : null; const lang = opts.lang || loc?.language || 'en';
  const rtl = opts.rtl ?? (universals.languages()[lang]?.rtl === true);
  const spriteMatch = fs.readFileSync(path.join(dir, 'preview.html'), 'utf8').match(/<svg class="icon-sprite"[\s\S]*?<\/svg>/);
  const body = (spriteMatch ? spriteMatch[0] : '') + fill(html, slotValues(id, opts));
  return harnessDoc(meta, body, { dark: opts.theme === 'dark', rtl, title: meta.name });
}

if (process.argv[1] && process.argv[1].endsWith('render.mjs')) {
  const a = process.argv.slice(2); const id = a[0]; const o = { set: {} };
  for (let i = 1; i < a.length; i++) { const k = a[i]; const v = a[i + 1];
    if (k === '--locale') o.locale = v; else if (k === '--theme') o.theme = v; else if (k === '--menu') o.menu = v; else if (k === '--lang') o.lang = v; else if (k === '--currency') o.currency = v;
    else if (k === '--set') { const [s, ...r] = v.split('='); o.set[s] = r.join('='); } else if (k === '--out') o.out = v; else continue; i++; }
  if (!id) { console.error('usage: render.mjs <component-id> [--locale ar-AE/AED] [--theme dark] [--menu id] [--set slot=value] [--out file]'); process.exit(1); }
  const doc = renderComponent(id, o); if (o.out) fs.writeFileSync(o.out, doc); else process.stdout.write(doc);
}
