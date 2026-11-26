// node renderers/dialog.test.mjs : dialog sizes, layout, Table, quick entry; deterministic and hygienic.
import assert from 'node:assert/strict';
import { loadDialogKit, renderDialog } from './dialog.mjs';
import { renderQuickEntry, quickEntryFields, isQuickEntry } from './quick-entry.mjs';
const kit = await loadDialogKit();
const fields = [
  { fieldname: 'a', fieldtype: 'Data', label: 'A', reqd: 1 },
  { fieldname: 'cb', fieldtype: 'Column Break' },
  { fieldname: 'b', fieldtype: 'Select', label: 'B', options: 'x\ny' },
  { fieldname: 'sb', fieldtype: 'Section Break', label: 'Items' },
  { fieldname: 't', fieldtype: 'Table', label: 'Rows', fields: [{ fieldname: 'c1', fieldtype: 'Data', label: 'C1', in_list_view: 1 }] },
];
const clean = (h) => assert(!/undefined|NaN|\[object Object\]|\{\{/.test(h), 'hygiene');
for (const size of ['small', 'default', 'large', 'extra-large']) {
  const h = renderDialog({ title: 'T', size, fields, values: { a: 'v', t: [{ c1: 'r' }] } }, 0, kit);
  assert.equal(h, renderDialog({ title: 'T', size, fields, values: { a: 'v', t: [{ c1: 'r' }] } }, 0, kit));
  assert(h.includes(`data-dialog-size="${size}"`)); clean(h);
  assert(h.includes('form-column') && h.includes('data-fieldtype="Table"') && h.includes('section-head'));
  assert(h.includes('dialog.0.primary'));
}
const meta = { name: 'Thing', fields: [
  { fieldname: 'n', fieldtype: 'Data', label: 'Name', reqd: 1 }, { fieldname: 'cb', fieldtype: 'Column Break' },
  { fieldname: 'opt', fieldtype: 'Data', label: 'Opt' }, { fieldname: 'g', fieldtype: 'Link', options: 'X', label: 'G', reqd: 1 },
  { fieldname: 'it', fieldtype: 'Table', options: 'Y', reqd: 0 }] };
assert(isQuickEntry(meta));
assert.deepEqual(quickEntryFields(meta).map((f) => f.fieldname), ['n', 'cb', 'g']);
const q = renderQuickEntry(meta, {}, 0, kit);
assert(q.includes('Edit Full Form') && q.includes('New Thing') && !q.includes('data-fieldname="opt"')); clean(q);
console.log('dialog tests ok');
