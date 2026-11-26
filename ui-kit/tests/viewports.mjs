// Viewport gate: form, list, report, query_report, workspace, dashboard, dialogs and kanban render at 375x812 and 768x1024
// with no horizontal overflow; the form also gets a sticky bottom action bar and stacked columns.
// Usage: node tests/viewports.mjs [spec.json...]   (default: every samples/*.json whose page is in the covered set; kanban samples are picked up when they exist)
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { loadSpec, renderSpec } from '../bin/mock.mjs';
import { applyFormMobile } from '../renderers/form/mobile.mjs';
const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VIEWPORTS = [{ w: 375, h: 812, name: '375' }, { w: 768, h: 1024, name: '768' }];
const PAGES = new Set(['form', 'list', 'report', 'query_report', 'workspace', 'dashboard', 'kanban', 'calendar', 'gantt', 'tree', 'image', 'inbox', 'map', 'dialog']);
const OUT = path.join(KIT, 'out', 'viewports');

const argv = process.argv.slice(2);
const files = (argv.length ? argv.map((f) => path.resolve(f)) : fs.readdirSync(path.join(KIT, 'samples')).filter((n) => n.endsWith('.json')).sort().map((n) => path.join(KIT, 'samples', n)));
const bad = []; const skipped = []; const jobs = [];
for (const f of files) {
  let raw; try { raw = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { continue; }
  const hasDialog = (raw.overlays || []).some((o) => o.type === 'dialog');
  const page = raw.page;
  if (!argv.length && !PAGES.has(page) && !hasDialog) continue;
  jobs.push({ f, page, name: path.basename(f, '.json') });
}
fs.mkdirSync(OUT, { recursive: true });

let b; try { b = await chromium.launch(); } catch { b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); }
const pg = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
let checked = 0;
for (const j of jobs) for (const v of VIEWPORTS) {
  const tag = `${j.name}@${v.name}`;
  let html;
  try {
    const loaded = loadSpec(j.f, { viewport: `${v.w}x${v.h}` });
    if (!loaded.ok) { skipped.push(`${tag}: invalid spec`); continue; }
    const outFile = path.join(OUT, `${j.name}.${v.name}.html`);
    html = (await renderSpec(loaded, { outFile })).html;
    if (j.page === 'form') html = applyFormMobile(html, { viewport: `${v.w}x${v.h}` });
    fs.writeFileSync(outFile, html);
    await pg.setViewportSize({ width: v.w, height: v.h });
    await pg.goto('file://' + outFile); await pg.waitForTimeout(120);
  } catch (e) { bad.push(`${tag}: render failed: ${String(e.message).split('\n')[0]}`); continue; }
  checked++;
  const r = await pg.evaluate(({ isForm, phone }) => {
    const out = { over: [], form: [] };
    const de = document.documentElement, vw = de.clientWidth;
    if (de.scrollWidth > vw + 1) out.over.push(`document ${de.scrollWidth}>${vw}`);
    if (document.body.scrollWidth > vw + 1) out.over.push(`body ${document.body.scrollWidth}>${vw}`);
    // visible elements poking past the right edge that no ancestor clips or scrolls
    const clipped = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o !== 'visible') return true; } return false; };
    const hits = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('svg,script,style,[hidden]')) continue;
      const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed' && !el.getBoundingClientRect().width) continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      if (r.right > vw + 2 && !clipped(el)) hits.push(el.getAttribute('data-ui') || el.className?.toString().split(' ')[0] || el.tagName.toLowerCase());
    }
    if (hits.length) out.over.push(`elements past right edge: ${[...new Set(hits)].slice(0, 6).join(', ')}`);
    if (isForm) {
      const bar = document.querySelector('.page-head .standard-items-section');
      if (!bar) out.form.push('no action bar');
      else { const r = bar.getBoundingClientRect(), cs = getComputedStyle(bar); if (cs.position !== 'fixed' || Math.abs(r.bottom - innerHeight) > 1 || r.width < vw - 1) out.form.push(`action bar not sticky at bottom (position ${cs.position}, bottom ${Math.round(r.bottom)}, width ${Math.round(r.width)})`); }
      const wrap = document.querySelector('.layout-main-section-wrapper'), side = document.querySelector('.layout-side-section');
      if (phone && wrap && (!side || getComputedStyle(side).display === 'none') && wrap.getBoundingClientRect().width < vw - 40) out.form.push(`form body squeezed to ${Math.round(wrap.getBoundingClientRect().width)}px of ${vw}px`);
      if (phone) for (const s of document.querySelectorAll('.section-body')) {
        const cols = [...s.querySelectorAll(':scope > .form-column')].filter((c) => c.getBoundingClientRect().height > 0);
        if (cols.length > 1 && new Set(cols.map((c) => Math.round(c.getBoundingClientRect().left))).size > 1) { out.form.push('columns not stacked'); break; }
      }
    }
    return out;
  }, { isForm: j.page === 'form', phone: v.w < 768 });
  for (const o of r.over) bad.push(`${tag}: horizontal overflow ${o}`);
  for (const o of r.form) bad.push(`${tag}: form ${o}`);
}
await b.close();
console.log(`viewports: ${jobs.length} specs x ${VIEWPORTS.length} widths, ${checked} rendered, ${bad.length} problems${skipped.length ? `, ${skipped.length} skipped` : ''}`);
for (const s of skipped) console.log('  SKIP ' + s);
for (const x of bad) console.log('  FAIL ' + x);
process.exit(bad.length ? 1 : 0);
