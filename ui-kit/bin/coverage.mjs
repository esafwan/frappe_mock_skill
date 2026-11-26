#!/usr/bin/env node
// coverage: matrix of surface (page) x state x renderer, green when a sample spec exercises the cell.
//
//   node bin/coverage.mjs [--samples dir] [--out file.html] [--json] [--strict]
//
// Static: reads the spec JSON of every samples/*.json (extends applied), no rendering.
// Cells: green = a sample exercises it, red = required and missing, grey = optional and unexercised.
// --strict exits 1 when any red cell remains. Default output: out/coverage/index.html.
// Integrator: `import { main, computeCoverage } from './coverage.mjs'` and call main(argv).
// Deterministic, Node 18, no dependencies, generic (no doctype/app/brand names).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, OVERLAY_TYPES, STATES, MENU_TARGETS, readSpecFile, rendererPath } from './mock.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..');

const BASE_STATES = ['default', 'dark', 'rtl', 'mobile', 'empty', 'loading'];
export const COLUMNS = [...BASE_STATES, ...OVERLAY_TYPES.filter((t) => t !== 'state'), ...STATES.map((s) => `state:${s}`)];
/** Columns a surface must exercise (red if missing). Everything else is optional (grey). */
export const REQUIRED = ['default', 'dark', 'rtl', 'mobile', 'menu_open', 'dialog', 'empty'];
/** Columns that do not apply to a surface, each with a one-line reason. Shown as n/a (grey), never red; `coverage --strict` prints the list. */
export const NOT_APPLICABLE = {
  dialog: {
    dialog: 'the page is itself a dialog', default: 'a dialog has no page chrome of its own; light is its only theme variant here',
    dark: 'dialog theming is covered by the pages that host dialogs', rtl: 'dialog direction is covered by the pages that host dialogs',
    mobile: 'dialog sizing on mobile is covered by tests/viewports.mjs', empty: 'a dialog has no empty state', menu_open: 'a dialog opens no menus',
  },
  workspace: { dialog: 'workspace dialogs only open from edit mode (descoped: workspace edit mode)' },
  dashboard: { dialog: 'chart filters open as popovers (menu_open dashboard.chart-filter), not dialogs' },
  calendar: { menu_open: 'Frappe has no row context menu on the calendar view' },
  gantt: { menu_open: 'Frappe has no row context menu on the gantt view' },
  tree: { menu_open: 'Frappe has no row context menu on the tree view' },
  image: { menu_open: 'Frappe has no row context menu on the image view' },
  map: { menu_open: 'Frappe has no row context menu on the map view' },
  inbox: { menu_open: 'Frappe has no row context menu on the inbox view' },
};
const isNA = (page, col) => !!(NOT_APPLICABLE[page] && NOT_APPLICABLE[page][col]);
const SKIP_PAGES = new Set(['blank']);

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Tags (column ids) a spec exercises. */
export function tagsOf(raw, file) {
  const tags = new Set();
  const ctx = raw.ctx || {};
  const base = path.basename(file, '.json');
  if (ctx.theme === 'dark') tags.add('dark');
  const rtlLocale = ['ar', 'he', 'fa', 'ur'].includes(String(ctx.locale || '').toLowerCase().split(/[-_]/)[0]);
  if (ctx.rtl || (ctx.rtl === undefined && rtlLocale)) tags.add('rtl');
  const vp = ctx.viewport;
  if (vp === 'mobile' || vp === 'tablet' || (typeof vp === 'string' && /^\d+x\d+$/.test(vp) && Number(vp.split('x')[0]) < 1024)) tags.add('mobile');
  if (!ctx.theme || ctx.theme === 'light') if (!tags.has('rtl') && !tags.has('mobile')) tags.add('default');
  if (/(^|[-_])(empty|no-results)([-_.]|$)/.test(base)) tags.add('empty');
  if (/(^|[-_])loading([-_.]|$)/.test(base)) tags.add('loading');
  for (const o of raw.overlays || []) {
    if (!isObj(o)) continue;
    if (o.type === 'state') { if (STATES.includes(o.state)) tags.add(`state:${o.state}`); tags.add('state'); }
    else if (OVERLAY_TYPES.includes(o.type)) tags.add(o.type);
  }
  const d = raw.data;
  if (isObj(d)) {
    if (d.loading === true) tags.add('loading');
    if (d.empty === true || (Array.isArray(d.rows) && d.rows.length === 0)) tags.add('empty');
  }
  return tags;
}

export function menuTargetsOf(raw) {
  return (raw.overlays || []).filter((o) => isObj(o) && o.type === 'menu_open' && typeof o.target === 'string').map((o) => o.target);
}

export function computeCoverage({ samplesDir = path.join(KIT, 'samples') } = {}) {
  const files = fs.readdirSync(samplesDir).filter((f) => f.endsWith('.json')).sort();
  const pages = PAGES.filter((p) => !SKIP_PAGES.has(p));
  const cells = Object.fromEntries(pages.map((p) => [p, Object.fromEntries(COLUMNS.map((c) => [c, []]))]));
  const menus = new Set();
  const errors = [];
  for (const f of files) {
    let raw;
    try { raw = readSpecFile(path.join(samplesDir, f)); } catch (e) { errors.push(`${f}: ${e.message}`); continue; }
    if (!isObj(raw) || !cells[raw.page]) { if (!isObj(raw) || !SKIP_PAGES.has(raw.page)) errors.push(`${f}: unknown page ${raw?.page}`); continue; }
    for (const t of tagsOf(raw, f)) if (cells[raw.page][t]) cells[raw.page][t].push(f);
    menuTargetsOf(raw).forEach((t) => menus.add(t));
  }
  const rows = pages.map((page) => {
    const renderer = fs.existsSync(rendererPath(page)) || fs.existsSync(path.join(KIT, 'renderers', page + '.mjs'));
    const cols = {};
    for (const c of COLUMNS) {
      const samples = cells[page][c];
      cols[c] = { samples, status: samples.length ? 'green' : isNA(page, c) ? 'grey' : REQUIRED.includes(c) ? 'red' : 'grey' };
    }
    return { page, renderer, cols, red: COLUMNS.filter((c) => cols[c].status === 'red').length + (renderer ? 0 : 1) };
  });
  const fixed = Object.keys(MENU_TARGETS.fixed).map((id) => ({ id, covered: menus.has(id) }));
  const prefixes = Object.keys(MENU_TARGETS.prefix).map((id) => ({ id, covered: [...menus].some((m) => m.startsWith(id)) }));
  return { samples: files.length, rows, menus: [...fixed, ...prefixes], errors, red: rows.reduce((n, r) => n + r.red, 0) };
}

const baseCss = () => fs.readFileSync(path.join(KIT, 'kit-lib', 'base.css'), 'utf8').trim(); // theme tokens: the only place raw colours live

export function renderHtml(cov) {
  const head = COLUMNS.map((c) => `<th class="${REQUIRED.includes(c) ? 'req' : ''}"><span>${esc(c)}</span></th>`).join('');
  const body = cov.rows.map((r) => {
    const tds = COLUMNS.map((c) => {
      const { samples, status } = r.cols[c];
      const title = samples.length ? samples.join(', ') : isNA(r.page, c) ? `n/a: ${NOT_APPLICABLE[r.page][c]}` : status === 'red' ? 'required, no sample' : 'optional, no sample';
      return `<td class="${status}" title="${esc(title)}">${samples.length || ''}</td>`;
    }).join('');
    return `<tr><th class="page">${esc(r.page)}</th><td class="${r.renderer ? 'green' : 'red'}">${r.renderer ? 'yes' : 'missing'}</td>${tds}</tr>`;
  }).join('\n');
  const menus = cov.menus.map((m) => `<li class="${m.covered ? 'green' : 'grey'}">${esc(m.id)}</li>`).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Coverage matrix</title>
<style>${baseCss()}
body{font:13px/1.4 system-ui,sans-serif;margin:24px;color:var(--kit-ink);background:var(--kit-surface)}
h1{font-size:18px;margin:0 0 4px}p{margin:0 0 16px;color:var(--kit-grey)}
table{border-collapse:collapse}th,td{border:1px solid var(--kit-axis-line);padding:4px 6px;text-align:center;min-width:28px}
th.page{text-align:left;font-weight:600}thead th{height:110px;vertical-align:bottom;font-weight:500}
thead th span{writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap}thead th.req{font-weight:700}
.green{background:var(--kit-ok-bg)}.red{background:var(--kit-bad-bg);font-weight:700}.grey{background:var(--kit-surface-sunken);color:var(--kit-grey)}
ul{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:6px}li{padding:2px 8px;border-radius:10px;border:1px solid var(--kit-axis-line)}
</style></head><body>
<h1>Coverage matrix</h1>
<p>${cov.samples} samples, ${cov.red} red cell(s). Green: exercised (count of samples). Red: required, missing. Grey: optional, not exercised. Bold columns are required.</p>
<table><thead><tr><th>surface</th><th>renderer</th>${head}</tr></thead><tbody>
${body}
</tbody></table>
<h1 style="margin-top:24px">Menu targets</h1>
<ul>${menus}</ul>
${cov.errors.length ? `<h1>Errors</h1><pre>${esc(cov.errors.join('\n'))}</pre>` : ''}
</body></html>
`;
}

export async function main(argv = process.argv.slice(2)) {
  const opt = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const samplesDir = path.resolve(opt('--samples') || path.join(KIT, 'samples'));
  const out = path.resolve(opt('--out') || path.join(KIT, 'out', 'coverage', 'index.html'));
  const cov = computeCoverage({ samplesDir });
  if (argv.includes('--json')) console.log(JSON.stringify(cov, null, 2));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, renderHtml(cov));
  if (!argv.includes('--json')) {
    for (const r of cov.rows) {
      const miss = COLUMNS.filter((c) => r.cols[c].status === 'red');
      console.log(`${r.page.padEnd(13)} renderer:${r.renderer ? 'yes' : 'MISSING'}  red:${miss.length ? miss.join(',') : '-'}`);
    }
    console.log(`coverage: ${cov.samples} samples, ${cov.red} red cell(s) -> ${path.relative(process.cwd(), out)}`);
  }
  if (argv.includes('--strict')) {
    console.log('not applicable (skipped on purpose):');
    for (const [page, cols] of Object.entries(NOT_APPLICABLE)) for (const [c, why] of Object.entries(cols)) console.log(`  ${page}.${c}: ${why}`);
    if (cov.red) return 1;
  }
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(await main());
