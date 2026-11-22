#!/usr/bin/env node
// Renderer for loyal-arrow-desk components (components/la/<id>/). Deterministic, no network/clock/random.
//   node tools/render-la.mjs <id> [--in shell] [--theme dark] [--lang ar] [--locale ar-AE/AED] [--currency KWD] [--set slot=v ...] [--out f.html]
// Also exported: renderLa(id, opts), laComponents(), laMeta(id). Reuses formatMoney/universals from render.mjs.
import fs from 'fs'; import path from 'path';
import { fill } from '../scripts/engine.mjs';
import { universals, formatMoney } from './render.mjs';
const ROOT = new URL('..', import.meta.url).pathname;
const D = (id) => path.join(ROOT, 'components/la', id);
const J = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
export const laComponents = () => fs.existsSync(path.join(ROOT, 'components/la')) ? fs.readdirSync(path.join(ROOT, 'components/la'), { withFileTypes: true }).filter(e => e.isDirectory() && fs.existsSync(path.join(D(e.name), 'component.json'))).map(e => e.name).sort() : [];
export const laMeta = (id) => J(path.join(D(id), 'component.json'));
const digits = (s) => s.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
export function laSlotValues(id, o = {}) {
  const slots = J(path.join(D(id), 'slots.json')).slots; const loc = o.locale ? universals.locales()[o.locale] : null;
  const lang = o.lang || loc?.language || 'en'; const cur = o.currency || loc?.currency || null; const i18n = lang !== 'en' ? universals.i18n(lang) : {};
  const bound = fs.existsSync(path.join(D(id), 'texts.json')) ? J(path.join(D(id), 'texts.json')) : {};   // optional per-lang overrides {slot:{ar:"..."}}
  const v = {};
  for (const [k, s] of Object.entries(slots)) {
    let x = bound[k]?.[lang] ?? i18n[s.sample] ?? s.sample;
    if (cur && s.type === 'currency') { const n = parseFloat(String(s.sample).replace(/[^\d.\-]/g, '')); if (!Number.isNaN(n)) x = formatMoney(n, cur, { lang }); }
    if (lang === 'ar' && /^(number|currency|date|time)$/.test(s.type) && o.arabicDigits !== false) x = digits(String(x));
    if (s.maxLength && String(x).length > s.maxLength) throw new Error(`${id}.${k} exceeds maxLength ${s.maxLength}`);
    v[k] = x;
  }
  const st = o.state || laMeta(id).states?.[0]; const ov = laMeta(id).stateSlots?.[st] || {};   // per-state slot overrides: string or {en,ar}
  for (const [k, x] of Object.entries(ov)) { const t = typeof x === 'string' ? x : (x[lang] ?? x.en); if (slots[k]?.maxLength && String(t).length > slots[k].maxLength) throw new Error(`${id}.${k} state ${st} exceeds maxLength`); v[k] = lang === 'ar' && /^(number|currency|date|time)$/.test(slots[k]?.type) ? digits(String(t)) : t; }
  return Object.assign(v, o.set || {});
}
export function renderLa(id, o = {}) {
  const meta = laMeta(id); const loc = o.locale ? universals.locales()[o.locale] : null; const lang = o.lang || loc?.language || 'en';
  const rtl = o.rtl ?? (universals.languages()[lang]?.rtl === true); const state = o.state || meta.states?.[0] || 'default'; const sv = { ...laSlotValues(id, o), ...(meta.stateSlots?.[state] || {}), ...(o.set || {}) }; let body = fill(fs.readFileSync(path.join(D(id), 'component.html'), 'utf8').replaceAll('{{state}}', state), sv);
  let vp = meta.viewport || { w: 1440, h: 900 };
  if (o.in) { const sh = o.in; const sm = laMeta(sh); body = fill(fs.readFileSync(path.join(D(sh), 'component.html'), 'utf8'), laSlotValues(sh, o)).replace(`<!--${sm.contentSlot}-->`, body); vp = sm.viewport || vp; }
  const sys = J(path.join(ROOT, 'systems/loyal-arrow-desk/system.json')); const cssBase = o.cssBase ?? '../../../tokens/css/';
  const links = [...sys.tokens.css, ...(meta.css || [])].map(f => `<link rel="stylesheet" href="${cssBase}${path.basename(f)}">`).join('\n');
  return `<!doctype html>\n<html lang="${lang}" data-system="la" data-theme="${o.theme === 'dark' ? 'dark' : 'light'}"${rtl ? ' dir="rtl"' : ''}>\n<head><meta charset="utf-8"><title>${meta.name}</title>\n${links}\n<style>html,body{margin:0}*{animation:none!important;transition:none!important;caret-color:transparent!important}#ui-kit-stage{position:absolute;left:0;top:0;width:${vp.w}px;min-height:${vp.h}px}</style></head>\n<body class="la-root"><div id="ui-kit-stage">\n${body}\n</div></body></html>\n`;
}
if (process.argv[1]?.endsWith('render-la.mjs')) {
  const a = process.argv.slice(2); const id = a[0]; const o = { set: {} };
  for (let i = 1; i < a.length; i += 2) { const k = a[i], v = a[i + 1]; if (k === '--theme') o.theme = v; else if (k === '--lang') o.lang = v; else if (k === '--locale') o.locale = v; else if (k === '--currency') o.currency = v; else if (k === '--state') o.state = v; else if (k === '--state') o.state = v; else if (k === '--in') o.in = v; else if (k === '--out') o.out = v; else if (k === '--set') { const [s, ...r] = v.split('='); o.set[s] = r.join('='); } }
  if (!id) { console.error('usage: render-la.mjs <id> [--in shell] [--theme dark] [--lang ar] [--currency KWD] [--set slot=v] [--out f]'); process.exit(1); }
  const doc = renderLa(id, o); o.out ? fs.writeFileSync(o.out, doc) : process.stdout.write(doc);
}
