// RTL + dark acceptance. Renders one spec per page type in {light,dark} x {ltr,rtl(ar)} with kit-lib/base.css applied,
// checks: dark actually dark, dir=rtl, no horizontal overflow, no zero-area [data-ui], RTL layout mirrored
// (main content right of sidebar), Arabic strings from data/universals/i18n/ar.json present, and no hard-coded hex colours
// outside kit-lib/base.css in kit-lib, renderers, shell, bin, adapters, schemas (var(--x,#hex) fallbacks are tolerated).
// Usage: node tests/rtl-dark.mjs [--no-hex]
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { loadSpec, renderSpec } from '../bin/mock.mjs';
const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(KIT, 'out', 'rtl-dark'); fs.mkdirSync(OUT, { recursive: true });
const baseCss = fs.readFileSync(path.join(KIT, 'kit-lib', 'base.css'), 'utf8');
const ar = JSON.parse(fs.readFileSync(path.join(KIT, 'data/universals/i18n/ar.json'), 'utf8'));
const SAMPLES = { blank: 's7-blank', dashboard: 's4-dashboard', form: 's1-sinv-submitted', list: 's3-customer-list', query_report: 's4-query-report', report: 's4-report-chart-hidden', workspace: 's4-workspace-all' };
const bad = [];
const files = [];
for (const [page, name] of Object.entries(SAMPLES)) for (const theme of ['light', 'dark']) for (const rtl of [false, true]) {
  const ov = { theme, rtl, ...(rtl ? { locale: 'ar' } : {}) };
  const tag = `${page}.${theme}.${rtl ? 'rtl' : 'ltr'}`;
  try {
    const loaded = loadSpec(path.join(KIT, 'samples', name + '.json'), ov);
    if (!loaded.ok) { bad.push(`${tag}: spec invalid ${JSON.stringify(loaded.errors).slice(0, 160)}`); continue; }
    const outFile = path.join(OUT, tag + '.html');
    let html = (await renderSpec(loaded, { outFile })).html;
    html = html.replace('</head>', `<style data-ui="kit.base">${baseCss}</style></head>`);
    fs.writeFileSync(outFile, html); files.push({ f: outFile, tag, theme, rtl });
  } catch (e) { bad.push(`${tag}: render failed ${e.message.slice(0, 160)}`); }
}
let b; try { b = await chromium.launch(); } catch { b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); }
const pg = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const arSample = Object.values(ar).slice(0, 80);
for (const { f, tag, theme, rtl } of files) {
  await pg.goto('file://' + f); await pg.waitForTimeout(150);
  const r = await pg.evaluate(({ theme, rtl }) => {
    const o = { empty: [], over: [], notes: [] };
    for (const el of document.querySelectorAll('[data-ui]')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || el.hidden || (el.checkVisibility && !el.checkVisibility()) || el.closest('[data-state="closed"]')) continue;
      const b = el.getBoundingClientRect(); if (!(b.width > 0 && b.height > 0)) o.empty.push(el.getAttribute('data-ui'));
    }
    const de = document.documentElement; if (de.scrollWidth > de.clientWidth + 1) o.over.push(`${de.scrollWidth}>${de.clientWidth}`);
    if (document.documentElement.dir !== (rtl ? 'rtl' : 'ltr')) o.notes.push('html dir is ' + document.documentElement.dir);
    const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number); return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255; };
    const bg = lum(getComputedStyle(document.body).backgroundColor === 'rgba(0, 0, 0, 0)' ? getComputedStyle(document.documentElement).backgroundColor : getComputedStyle(document.body).backgroundColor);
    if (theme === 'dark' && bg > 0.35) o.notes.push('dark theme but background luminance ' + bg.toFixed(2));
    if (theme === 'light' && bg < 0.6) o.notes.push('light theme but background luminance ' + bg.toFixed(2));
    const side = document.querySelector('.layout-side-section, .desk-sidebar, [data-ui="sidebar"]'), main = document.querySelector('.layout-main-section, .main-section, main');
    if (side && main) { const s = side.getBoundingClientRect(), m = main.getBoundingClientRect(); if (s.width && m.width && (s.left < m.left) === rtl && Math.abs(s.left - m.left) > 4) o.notes.push(`sidebar not mirrored (side.left ${Math.round(s.left)}, main.left ${Math.round(m.left)})`); }
    return o;
  }, { theme, rtl });
  if (r.empty.length) bad.push(`${tag}: zero-area ${[...new Set(r.empty)].slice(0, 6).join(', ')}`);
  for (const x of r.over) bad.push(`${tag}: horizontal overflow ${x}`);
  for (const n of r.notes) bad.push(`${tag}: ${n}`);
}
await b.close();
// Arabic acceptance: the spec rendered with ctx.locale=ar should show at least one string from ar.json
const arHits = files.filter((x) => x.rtl).map((x) => ({ tag: x.tag, hit: arSample.some((s) => fs.readFileSync(x.f, 'utf8').includes(s)) }));
const arMissing = arHits.filter((x) => !x.hit).map((x) => x.tag);
if (arMissing.length) bad.push(`Arabic strings (data/universals/i18n/ar.json) not applied in: ${arMissing.join(', ')}`);
// Form meta labels (tab/section/field labels, banner, naming series) must be translated and code-like values isolated left-to-right
{
  const ff = files.find((x) => x.rtl && /form/.test(x.tag));
  if (ff) {
    const h = fs.readFileSync(ff.f, 'utf8');
    for (const [en, why] of [['>Accounting Dimensions<', 'section label'], ['>Currency and Price List<', 'section label'], ['>Terms<', 'tab label']]) if (h.includes(en)) bad.push(`form rtl: ${why} ${en} still English`);
    if (/>\.This invoice/.test(h)) bad.push('form rtl: banner punctuation not handled');
    if (!/<bdi dir="ltr">[A-Z]{2,}-[A-Z.\-]*/.test(h)) bad.push('form rtl: naming series is not isolated in <bdi dir="ltr">');
  }
}
// hex-colour guard
const HEX = /#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (e.name === 'node_modules' ? [] : walk(path.join(d, e.name))) : /\.(mjs|css|json)$/.test(e.name) && !/\.test\.mjs$/.test(e.name) ? [path.join(d, e.name)] : []);
// Frozen debt list: `path | max hex count | reason`. It may shrink but never grow; a file's count may not rise; every entry needs a reason.
const FROZEN_ALLOW = ['kit-lib/chart/axis.mjs', 'kit-lib/chart/heatmap.mjs', 'kit-lib/chart/pie.mjs', 'kit-lib/numbercard.mjs', 'renderers/workspace/blocks/common.mjs', 'shell/navbar.mjs'];
const HEX_ALLOW = new Map();
for (const l of (fs.existsSync(path.join(KIT, 'tests', 'hex-allowlist.txt')) ? fs.readFileSync(path.join(KIT, 'tests', 'hex-allowlist.txt'), 'utf8') : '').split('\n').map((x) => x.trim()).filter((x) => x && !x.startsWith('#'))) {
  const [file, count, ...why] = l.split('|').map((x) => x.trim());
  if (!FROZEN_ALLOW.includes(file)) bad.push(`hex allowlist grew: "${file}" is not in the frozen list (move its colours to kit-lib/base.css tokens instead)`);
  if (!why.join('').trim()) bad.push(`hex allowlist entry "${file}" has no reason`);
  if (!/^\d+$/.test(count || '')) bad.push(`hex allowlist entry "${file}" has no max hex count`);
  HEX_ALLOW.set(file, Number(count));
}
const hexIn = (f) => (fs.readFileSync(f, 'utf8').replace(/var\(--[\w-]+\s*,\s*(?:var\(--[\w-]+\s*,\s*)?#[0-9a-fA-F]{3,8}\)?/g, '').replace(/&#\d+;|&#x[0-9a-f]+;/gi, '').match(HEX) || []).length;
for (const [file, max] of HEX_ALLOW) { const n = fs.existsSync(path.join(KIT, file)) ? hexIn(path.join(KIT, file)) : 0; if (n > max) bad.push(`new hex colour in allowlisted ${file}: ${n} > ${max} (frozen)`); else if (n < max) bad.push(`${file} has ${n} hex colours, allowlist says ${max}: lower the count in tests/hex-allowlist.txt`); }
let hexCount = 0; const hexBy = {};
if (!process.argv.includes('--no-hex')) for (const dir of ['kit-lib', 'renderers', 'shell', 'bin', 'adapters', 'schemas']) {
  for (const f of walk(path.join(KIT, dir))) {
    if (f === path.join(KIT, 'kit-lib', 'base.css') || HEX_ALLOW.has(path.relative(KIT, f))) continue;
    const src = fs.readFileSync(f, 'utf8').replace(/var\(--[\w-]+\s*,\s*(?:var\(--[\w-]+\s*,\s*)?#[0-9a-fA-F]{3,8}\)?/g, '').replace(/&#\d+;|&#x[0-9a-f]+;/gi, '');
    const n = (src.match(HEX) || []).length; if (n) { hexBy[path.relative(KIT, f)] = n; hexCount += n; }
  }
}
if (hexCount) bad.push(`hard-coded hex colours outside base.css: ${hexCount} in ${Object.keys(hexBy).length} files: ${Object.entries(hexBy).map(([k, v]) => `${k}(${v})`).join(' ')}`);
console.log(`rtl-dark: ${files.length} renders (${Object.keys(SAMPLES).length} page types x light/dark x ltr/rtl), ${bad.length} problems`);
for (const x of bad) console.log('  FAIL ' + x);
process.exit(bad.length ? 1 : 0);
