// Slice 4 gate: stress report, query report, workspace coverage, dashboard, group-by, stacked dialogs. node tests/slice4.test.mjs
import assert from 'node:assert/strict'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { loadSpec, renderSpec } from '../bin/mock.mjs';
const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = async (n) => { const l = loadSpec(path.join(KIT, 'samples', n + '.json')); assert(l.ok, n + ' invalid'); const o = await renderSpec(l); assert.equal(o.warnings.length, 0, n + ': ' + o.warnings.join('|')); return o.html; };
const n = (h, re) => (h.match(re) || []).length;

let h = await r('s4-report-stress');
assert(h.includes('Qty (Odd Child)') || h.includes('Item (Odd Child)'), 'child column labels');
assert(h.includes('Index (Odd Child)'), 'idx labelled Index (Child)');
assert(h.includes('data-ui="datatable.totals"'), 'totals row');
assert(n(h, /class="bar"/g) >= 5, 'chart bars');
h = await r('s4-report-groupby');
assert(h.includes('Group By: Status') && h.includes('data-chart-type="pie"') && h.includes('datatable.totals'), 'group-by + chart + totals');
h = await r('s4-query-report');
assert(n(h, /data-fieldname="(company|from_date|to_date|status|party|include_all|min_qty|range)"/g) >= 5 || h.includes('Company'), 'filters');
assert(h.includes('Total Amount') && h.includes('data-chart-type="bar"') && h.includes('datatable.totals'), 'summary, chart, totals');
h = await r('s4-workspace-all');
for (const t of ['header', 'paragraph', 'spacer', 'shortcut', 'card', 'number_card', 'chart', 'quick_list', 'onboarding', 'custom_block']) assert(h.includes(`data-ui="block:${t}"`), 'block ' + t);
for (const c of [3, 4, 6, 12]) assert(h.includes(`grid-col-${c}"`), 'col ' + c);
for (const v of ['/view/report', '/view/dashboard', '/view/tree', '/new', '/view/calendar', '/view/kanban/Order%20Board', '/view/image', '/view/gantt', '/view/map', '/view/inbox']) assert(h.includes(`href="/desk/odd-a${v}"`), 'doc_view ' + v);
assert(h.includes('href="/desk/odd-a"'), 'list view');
h = await r('s4-dashboard');
assert(n(h, /data-ui="dashboard\.card-cell"/g) === 4 && n(h, /data-ui="dashboard\.chart-cell"/g) === 7, 'dashboard grid');
assert(h.includes('data-ui="chart.no-data"') && h.includes('Others'), 'no-data and Others bucket');
assert((await r('s4-dashboard-filter')).includes('dashboard.chart-filter:Revenue Trend'), 'chart filter popover');
assert((await r('s4-list-groupby')).includes('group-by-dropdown'), 'list group-by dropdown');
for (const k of ['pick-columns', 'add-column', 'export', 'save-as', 'create-chart']) assert((await r('s4-report-dialog-' + k)).includes('modal-dialog'), 'dialog ' + k);
// stacked dialogs are offset both ways
h = await r('s3-dialog-confirm-stack');
assert(!/\+\s*px/.test(h), 'stacked dialog offset lost its number');
assert(/padding-top:calc\(5vh \+ 28px\);padding-left:28px/.test(h) && /padding-top:calc\(5vh \+ 0px\);padding-left:0px/.test(h), 'stacked dialogs offset diagonally by 28px');

// chart values are non-zero for the child-column keys
h = await r('s4-report-stress');
const vals = [...h.matchAll(/class="bar" data-value="([\d.]+)"/g)].map((m) => Number(m[1]));
assert(vals.length >= 5 && vals.every((v) => v > 0), 'child-column chart values non-zero: ' + vals.join(','));

// pick columns: child groups, shown child columns pre-checked
h = await r('s4-report-dialog-pick-columns');
assert(h.includes('Odd Child') && /Odd Child/.test(h.slice(h.indexOf('Pick Columns'))), 'pick columns child group header');
const chk = (id) => new RegExp(`data-fieldname="${id}"[^>]*>[\\s\\S]{0,400}?<input[^>]*type="checkbox"[^>]*>`).exec(h)?.[0] || '';
assert(/checked/.test(chk('Odd_Child_qty')), 'shown child column pre-checked');

// renderer-owned overlay targets: unregistered, non-owned target errors; owned dashboard.menu is drawn exactly once
{
  const base = loadSpec(path.join(KIT, 'samples', 's4-dashboard-menu.json'));
  const once = await renderSpec(base);
  assert(once.html.includes('Refresh All') && once.html.includes('aria-label="Menu"'), 'dashboard.menu items drawn in place');
  assert.equal(n(once.html, /data-ui="dashboard\.menu"/g), 1, 'dashboard.menu container once');
  assert.equal(n(once.html, /data-popover-target="dashboard\.menu"/g), 0, 'dashboard.menu not redrawn in popover layer');
  const { isOwnedTarget } = await import('../kit-lib/draw.mjs');
  assert(isOwnedTarget('dashboard.menu') && isOwnedTarget('dashboard.chart-filter:X') && !isOwnedTarget('nope.menu'), 'owned allowlist');
  const l = loadSpec(path.join(KIT, 'samples', 's4-dashboard-menu.json'));
  l.spec.overlays = [{ type: 'menu_open', target: 'nope.unregistered' }];
  await assert.rejects(() => renderSpec(l), /not in the menu registry/, 'unregistered, non-owned target must error');
}

// browser checks: equal column widths across head/body/totals; report fills >= 95% of the content area
{
  const { chromium } = await import('playwright');
  let b; try { b = await chromium.launch(); } catch { b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); }
  const pg = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  for (const name of ['s4-report-stress', 's4-report-groupby', 's4-query-report']) {
    const o = await renderSpec(loadSpec(path.join(KIT, 'samples', name + '.json')));
    const f = path.join(KIT, 'out', 'slice4', '.w-' + name + '.html'); fs.writeFileSync(f, o.html);
    await pg.goto('file://' + f);
    const m = await pg.evaluate(() => {
      const w = (sel) => { const o = {}; document.querySelectorAll(sel).forEach((c) => { const i = c.getAttribute('data-col-index'); if (i !== null && !c.matches('[data-is-header]:not([data-ui^="datatable.head"])')) (o[i] ||= []).push(Math.round(c.getBoundingClientRect().width)); }); return o; };
      const rv = document.querySelector('[data-ui="report-view"],[data-ui="report.table"],.datatable');
      const host = rv && (rv.closest('.layout-main-section') || rv.parentElement);
      const area = document.querySelector('.layout-main-section, .layout-main, main');
      return { head: w('.dt-cell[data-is-header="1"]'), body: w('.dt-cell:not([data-is-header="1"]):not([data-ui^="datatable.totals"])'), tot: w('[data-ui="datatable.totals.cell"]'), view: rv ? rv.getBoundingClientRect().width : 0, area: area ? area.getBoundingClientRect().width : 0, host: host ? host.getBoundingClientRect().width : 0 };
    });
    fs.rmSync(f, { force: true });
    const nh = Object.keys(m.head).length, nt = Object.keys(m.tot).length, off = nh - nt;
    assert(off >= 0, `${name}: totals has more columns than head`);
    for (const i of Object.keys(m.tot)) {
      const hw = m.head[Number(i) + off]?.[0], bw = m.body[Number(i) + off] || [], tw = m.tot[i][0];
      assert(hw !== undefined, `${name}: head col ${Number(i) + off} missing`);
      assert(bw.every((x) => x === hw) && tw === hw, `${name}: col ${i} widths differ head=${hw} body=${[...new Set(bw)]} totals=${tw}`);
    }
    assert(m.area > 0 && m.view / m.area >= 0.95, `${name}: report width ${m.view} is under 95% of content area ${m.area}`);
  }
  await b.close();
}
console.log('slice4 tests ok');
