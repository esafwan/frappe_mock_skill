#!/usr/bin/env node
// Renderer for loyal-arrow-desk components (components/la/<id>/). Deterministic, no network/clock/random.
//   node tools/render-la.mjs <id> [--in shell] [--state name] [--state name] [--theme dark] [--lang ar] [--locale ar-AE/AED] [--currency KWD] [--set slot=v ...] [--out f.html]
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
export const laStates = (id) => fs.existsSync(path.join(D(id), 'states.json')) ? J(path.join(D(id), 'states.json')).states : {};
export function laSlotValues(id, o = {}) {
  const all = laStates(id), st = o.state ? all[o.state] : null; if (o.state && Object.keys(all).length && !st) throw new Error(`${id}: unknown state ${o.state}`);
  const slots = JSON.parse(JSON.stringify(J(path.join(D(id), 'slots.json')).slots));
  for (const [k, ov] of Object.entries(st?.slotOverrides || {})) slots[k] = { ...slots[k], ...ov };
  const loc = o.locale ? universals.locales()[o.locale] : null;   // slotOverrides: e.g. switch a slot to type currency for one state
  const lang = o.lang || loc?.language || 'en'; const cur = o.currency || loc?.currency || (st?.slotOverrides ? 'AED' : null); const i18n = lang !== 'en' ? universals.i18n(lang) : {};
  const bound = fs.existsSync(path.join(D(id), 'texts.json')) ? J(path.join(D(id), 'texts.json')) : {};   // optional per-lang overrides {slot:{ar:"..."}}
  const v = {};
  const stF = path.join(D(id), 'states.json'); const stOv = o.state && fs.existsSync(stF) ? (J(stF)[o.state] || {}) : {};   // optional per-state slot overrides {state:{slot:value}}
  for (const [k, s] of Object.entries(slots)) {
    const smp = stOv[k] ?? s.sample; let x = bound[k]?.[lang] ?? i18n[smp] ?? smp;
    if (cur && s.type === 'currency') { const n = parseFloat(String(smp).replace(/[^\d.\-]/g, '')); if (!Number.isNaN(n)) x = formatMoney(n, cur, { lang }); }
    if (lang === 'ar' && /^(number|currency|date|time)$/.test(s.type) && o.arabicDigits !== false) x = digits(String(x));
    if (s.maxLength && String(x).length > s.maxLength) throw new Error(`${id}.${k} exceeds maxLength ${s.maxLength}`);
    v[k] = x;
  }
  const stx = o.state || laMeta(id).states?.[0]; const ov = laMeta(id).stateText?.[stx] || {};   // per-state slot overrides: string or {en,ar}
  for (const [k, x] of Object.entries(ov)) { const t = typeof x === 'string' ? x : (x[lang] ?? x.en); if (slots[k]?.maxLength && String(t).length > slots[k].maxLength) throw new Error(`${id}.${k} state ${stx} exceeds maxLength`); v[k] = lang === 'ar' && /^(number|currency|date|time)$/.test(slots[k]?.type) ? digits(String(t)) : t; }
  Object.assign(v, st?.set || {}, o.set || {});   // states.json {states:{name:{set:{slot:value}}}}
  for (const [k, s] of Object.entries(slots)) if (s.type === 'number') v[k + '__raw'] = String(o.set?.[k] ?? s.sample).replace(/[^\d.]/g, '');   // ASCII copy for data-fill attrs
  if ('current' in slots && 'target' in slots) { const c = parseFloat(v.current__raw), t = parseFloat(v.target__raw); v.fill__raw = String(t > 0 ? Math.max(0, Math.min(100, Math.round(c / t * 100))) : 0); }
  return v;
}
export function renderLa(id, o = {}) {
  const meta = laMeta(id); const loc = o.locale ? universals.locales()[o.locale] : null; const lang = o.lang || loc?.language || 'en';
  const rtl = o.rtl ?? (universals.languages()[lang]?.rtl === true); const state = o.state || meta.states?.[0] || 'default'; const sv = { ...laSlotValues(id, o), ...(meta.stateSlots?.[state] || {}), ...(o.set || {}) }; let body = fill(fs.readFileSync(fs.existsSync(path.join(D(id), 'states', state + '.html')) ? path.join(D(id), 'states', state + '.html') : path.join(D(id), 'component.html'), 'utf8').replaceAll('{{state}}', state), sv);
  if (o.state) { body = body.replace(`data-ui="${meta.id}"`, `data-ui="${meta.id}" data-state="${o.state}"`); }
  const prog = o.progress ?? (o.state ? laStates(id)[o.state]?.progress : undefined); if (prog != null) body = body.replace(`data-ui="${meta.id}"`, `data-ui="${meta.id}" style="--la-progress:${prog}"`);   // 0..1 driver for draw-in / grow / count-up (video engine sets it per frame)
  let vp = meta.viewport || { w: 1440, h: 900 };
  if (o.in) { const sh = o.in; const sm = laMeta(sh); const shSt = meta.shellState; const shF = shSt && fs.existsSync(path.join(D(sh), 'states', shSt + '.html')) ? path.join(D(sh), 'states', shSt + '.html') : path.join(D(sh), 'component.html'); body = fill(fs.readFileSync(shF, 'utf8'), laSlotValues(sh, { ...o, set: {}, state: shSt })).replace(`<!--${sm.contentSlot}-->`, body); vp = sm.viewport || vp; }
  const sys = J(path.join(ROOT, 'systems/loyal-arrow-desk/system.json')); const cssBase = o.cssBase ?? '../../../tokens/css/';
  const links = [...sys.tokens.css, ...(meta.css || [])].map(f => `<link rel="stylesheet" href="${cssBase}${path.basename(f)}">`).join('\n');
  return `<!doctype html>\n<html lang="${lang}" data-system="la" data-theme="${o.theme === 'dark' ? 'dark' : 'light'}"${rtl ? ' dir="rtl"' : ''}>\n<head><meta charset="utf-8"><title>${meta.name}</title>\n${links}\n<style>html,body{margin:0}*{animation:none!important;transition:none!important;caret-color:transparent!important}#ui-kit-stage{position:absolute;left:0;top:0;width:${vp.w}px;min-height:${vp.h}px${meta.kind === 'widget' && !o.in ? `;padding:${meta.pad ?? 16}px;box-sizing:border-box` : ''}}</style></head>\n<body class="la-root${meta.canvas === 'page' ? ' la-page' : ''}"><div id="ui-kit-stage">\n${body}\n</div></body></html>\n`;
}
if (process.argv[1]?.endsWith('render-la.mjs')) {
  const a = process.argv.slice(2); const id = a[0]; const o = { set: {} };
  for (let i = 1; i < a.length; i += 2) { const k = a[i], v = a[i + 1]; if (k === '--theme') o.theme = v; else if (k === '--lang') o.lang = v; else if (k === '--locale') o.locale = v; else if (k === '--currency') o.currency = v; else if (k === '--state') o.state = v; else if (k === '--state') o.state = v; else if (k === '--state') o.state = v; else if (k === '--state') o.state = v; else if (k === '--state') o.state = v; else if (k === '--in') o.in = v; else if (k === '--state') o.state = v; else if (k === '--variant') o.variant = v; else if (k === '--state') o.state = v; else if (k === '--progress') o.progress = v; else if (k === '--state') o.state = v; else if (k === '--state') o.state = v; else if (k === '--state') o.state = v; else if (k === '--out') o.out = v; else if (k === '--set') { const [s, ...r] = v.split('='); o.set[s] = r.join('='); } }
  if (!id) { console.error('usage: render-la.mjs <id> [--in shell] [--state name] [--theme dark] [--lang ar] [--currency KWD] [--set slot=v] [--out f]'); process.exit(1); }
  const doc = renderLa(id, o); o.out ? fs.writeFileSync(o.out, doc) : process.stdout.write(doc);
}
