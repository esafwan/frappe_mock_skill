import fs from 'node:fs'; import assert from 'node:assert/strict';
import { adaptFlatSidebar, flattenSidebar } from '../adapters/sidebar.mjs';
import { adaptWorkspace, toLegacyWorkspace, parseContent } from '../adapters/workspace.mjs';
import { adaptReport, toLegacyReport, parseColumn } from '../adapters/report.mjs';
const rd = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), 'utf8'));
const eq = assert.deepStrictEqual;

// sidebar: flat -> nested -> flat round trip, idempotent
const flat = rd('../../loyal-arrow/structure/sidebar.json');
const nested = adaptFlatSidebar(flat);
assert(nested.items.some((i) => i.children?.length) && nested.items.every((i) => i.indent === undefined));
eq(adaptFlatSidebar(nested), nested);
const back = flattenSidebar(nested);
eq(adaptFlatSidebar(back), nested);
eq(back.items.map((i) => [i.label, i.indent]), flat.items.map((i) => [i.label, i.indent ?? 0]));

// workspace
const wsj = rd('../../loyal-arrow/structure/workspaces.json').workspaces;
for (const w of wsj) {
  const n = adaptWorkspace(w);
  assert.equal(n.doctype, 'Workspace'); assert(Array.isArray(n.content));
  const cards = n.links.filter((l) => l.type === 'Card Break');
  assert.equal(cards.reduce((a, c) => a + c.link_count, 0), n.links.filter((l) => l.type === 'Link').length);
  assert(n.links.filter((l) => l.type === 'Link').every((l) => l.link_type));
  eq(adaptWorkspace(n), n);                                   // idempotent
  eq(adaptWorkspace(toLegacyWorkspace(n)), n);                // native -> legacy -> native
  eq(toLegacyWorkspace(adaptWorkspace(toLegacyWorkspace(n))), toLegacyWorkspace(n));
}
const sell = rd('../samples/workspaces/selling.json');
assert(typeof sell.content === 'string');
const ns = adaptWorkspace(sell);
eq(ns.content, parseContent(sell.content)); eq(adaptWorkspace(ns), ns);
assert.equal(adaptWorkspace({ name: 'x', links: [{ type: 'Link', link_to: 'a-page' }, { type: 'Link', link_to: 'R' }] }, { reports: ['R'] }).links[1].link_type, 'Report');

// report
for (const r of rd('../../loyal-arrow/structure/reports.json').reports) {
  const n = adaptReport(r);
  assert.equal(n.doctype, 'Report'); assert.equal(n.report_name, r.name);
  eq(adaptReport(n), n); eq(toLegacyReport(n), toLegacyReport(adaptReport(toLegacyReport(n))));
}
eq(parseColumn('Customer:Link/Customer:120'), { fieldname: 'customer', label: 'Customer', fieldtype: 'Link', options: 'Customer', width: 120 });
const rc = adaptReport({ name: 'R', ref_doctype: 'D', report_type: 'Script Report', columns: ['Amount:Currency:90', { label: 'Due Date' }] });
eq(rc.columns.map((c) => [c.fieldname, c.fieldtype]), [['amount', 'Currency'], ['due_date', 'Data']]);
eq(adaptReport(rc), rc);
console.log('adapters tests ok');
