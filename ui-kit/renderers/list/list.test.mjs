// Acceptance tests for the list renderer (T-L2 + T-L3). Run: node renderers/list/list.test.mjs (from ui-kit/).
import { fitColumns } from './fit.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadSpec, renderSpec } from '../../bin/mock.mjs';
import { enabledViews } from '../../kit-lib/viewswitch.mjs';
import { listColumns } from './rows.mjs';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'list-test-'));
const field = (i, extra = {}) => ({ fieldname: `f${i}`, fieldtype: ['Data', 'Select', 'Currency', 'Date', 'Check', 'Percent'][i % 6], label: `Field ${i}`, in_list_view: 1, ...(i % 6 === 1 ? { options: 'One\nTwo\nThree' } : {}), ...extra });
const mkMeta = (n, title) => ({ name: 'Widget Thing', module: 'Stuff', ...(title ? { title_field: 'f0' } : {}), fields: Array.from({ length: n }, (_, i) => field(i)) });
async function build(name, spec) {
  const f = path.join(dir, `${name}.json`);
  const doc = { page: 'list', data: { rows: { $gen: { count: 6, seed: 3 } } }, ...spec, ctx: { today: '2026-11-27', chrome: { sidebar: 'hidden', dock: false }, ...(spec.ctx || {}) } };
  fs.writeFileSync(f, JSON.stringify(doc));
  const loaded = loadSpec(f);
  assert.ok(loaded.ok, `${name}: invalid spec ${JSON.stringify(loaded.errors)}`);
  const out = await renderSpec(loaded, { outFile: path.join(dir, `${name}.html`) });
  return { html: out.html, warnings: out.warnings, loaded };
}
const count = (html, re) => (html.match(re) || []).length;

// 1) columns: 1, 4, 8, 12 field columns, with and without title_field. No hard-wired doctype.
for (const [n, title] of [[1, false], [4, true], [8, false], [12, true], [12, false]]) {
  const meta = mkMeta(n, title);
  const { html, warnings } = await build(`cols-${n}-${title}`, { meta: { doctype: meta } });
  const headerCols = count(html.split('list-row-head')[1].split('</header>')[0], /<div class="list-row-col /g);
  const cols = listColumns({ meta: {}, view: {} }, meta, {});
  assert.equal(cols.length, 1 + (n - (title ? 1 : 0)) + (title ? 1 : 0), `column model n=${n} title=${title}`);
  const shown = fitColumns(cols, { available: 1440 - 48 - 230 - 64 - 230, gap: 15 }).cols.length; // wide lists drop trailing columns instead of overflowing
  assert.ok(headerCols >= shown, `header has ${headerCols} cols for ${shown}`);
  assert.equal(count(html, /class="list-row-container" tabindex/g), 6, 'six rows');
  { const m = (html.split('data-ui="shell.head"')[1] || '').match(/.{30}(Customer|ERPNext|Selling)\b.{30}/); assert.ok(!m, `hard-wired name: ${m?.[0]}`); }
  assert.ok(warnings.every((w) => !/list/.test(w) || /overlay/.test(w) === false), `warnings: ${warnings}`);
  assert.ok(html.includes('Add Widget Thing'));
}

// 2) view switcher: 3 extra views -> 4 entries; desk_settings.view_switcher=false hides it
{
  const meta = mkMeta(3, true);
  const { html } = await build('views', { meta: { doctype: meta }, view: { views: ['kanban', 'calendar', 'report'] } });
  assert.equal(count(html, /data-view="/g), 4, 'four entries');
  assert.equal(enabledViews(meta, { views: ['kanban', 'calendar', 'report'] }, {}).length, 4);
  const hidden = await build('views-hidden', { meta: { doctype: meta }, view: { views: ['kanban', 'calendar', 'report'] }, ctx: { desk_settings: { view_switcher: false } } });
  assert.ok(!hidden.html.includes('view-switcher'), 'switcher hidden');
  const baseline = await build('views-default', { meta: { doctype: meta } });
  assert.equal(count(baseline.html, /data-view="/g), 1, 'list only by default');
}

// 3) overlays: filter chips + popover, selection, sort menu, state, empty state
{
  const meta = mkMeta(4, true);
  const { html, warnings } = await build('overlays', { meta: { doctype: meta }, overlays: [
    { type: 'filter_chips', items: [['f1', '=', 'Two'], ['f2', '>', 5]], open: true },
    { type: 'list_select', rows: [0, 2, 4], open: true },
    { type: 'menu_open', target: 'page.sort' },
    { type: 'state', target: 'row:1', state: 'hover' },
    { type: 'state', target: 'cell:1:f1', state: 'focus' },
    { type: 'button', label: 'Sync', style: 'default' },
  ] });
  assert.ok(html.includes('3 items selected'));
  assert.ok(html.includes('2 filters'));
  assert.ok(html.includes('filter-popover'));
  assert.ok(/data-ui="list\.row\.1"[^>]*data-state="hover"|data-state="hover"[^>]*data-ui="list\.row\.1"/.test(html));
  assert.ok(html.includes('data-ui="list.button.Sync"'));
  assert.deepEqual(warnings.filter((w) => /not drawn/.test(w)), [], 'all overlays drawn');
  const empty = await build('empty', { meta: { doctype: meta }, data: { rows: [] } });
  assert.ok(empty.html.includes("You haven't created a Widget Thing yet"));
  const nr = await build('noresult', { meta: { doctype: meta }, data: { rows: [] }, overlays: [{ type: 'filter_chips', items: [['f1', '=', 'x']] }] });
  assert.ok(nr.html.includes('Nothing to show'));
}

// 4) determinism
{
  const meta = mkMeta(5, true);
  const a = await build('det', { meta: { doctype: meta } });
  const b = await build('det', { meta: { doctype: meta } });
  assert.equal(a.html, b.html);
}
fs.rmSync(dir, { recursive: true, force: true });
console.log('list.test ok');
